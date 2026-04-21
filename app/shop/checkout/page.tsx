"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { SHIPPING_RULES, STORE_WHATSAPP } from "@/lib/constants";
import { Lock, Truck, ChevronRight } from "lucide-react";

type CheckoutStep = "shipping" | "payment";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripeAccountId = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID;

const stripePromise =
  stripePublishableKey && stripeAccountId
    ? loadStripe(stripePublishableKey, { stripeAccount: stripeAccountId })
    : stripePublishableKey
      ? loadStripe(stripePublishableKey)
      : null;

function PaymentForm({ onSuccess }: { onSuccess: (paymentIntent: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-3.5 font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Lock className="h-4 w-4" />
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [processingShipping, setProcessingShipping] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/shop/cart");
    }
  }, [cart.length, router]);

  const updateField = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingShipping(true);
    setPaymentError("");

    let calculatedShipping = 0;
    let calculatedTax = 0;

    try {
      const { data: shipData } = await supabase.functions.invoke("calculate-shipping", {
        body: {
          cartItems: cart.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
          shippingRules: SHIPPING_RULES,
          subtotal: cartTotal,
        },
      });
      if (shipData?.success) {
        calculatedShipping = shipData.shippingCents;
        setShippingCost(calculatedShipping);
      }
    } catch (err) {
      console.error("Shipping calc error:", err);
    }

    if (shippingAddress.state) {
      try {
        const { data: taxData } = await supabase.functions.invoke("calculate-tax", {
          body: { state: shippingAddress.state, subtotal: cartTotal },
        });
        if (taxData?.success) {
          calculatedTax = taxData.taxCents;
          setTax(calculatedTax);
        }
      } catch (err) {
        console.error("Tax calc error:", err);
      }
    }

    const total = cartTotal + calculatedShipping + calculatedTax;
    if (total > 0) {
      try {
        const { data, error } = await supabase.functions.invoke("create-payment-intent", {
          body: { amount: total, currency: "usd", metadata: { customer_email: shippingAddress.email } },
        });
        if (error || !data?.clientSecret) {
          setPaymentError("Unable to initialize payment. Please try again or order via WhatsApp.");
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch {
        setPaymentError("Unable to initialize payment. Please try again.");
      }
    }

    setProcessingShipping(false);
    setStep("payment");
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    const subtotal = cartTotal;
    const orderTotal = subtotal + shippingCost + tax;

    try {
      const { data: customer } = await supabase
        .from("ecom_customers")
        .upsert(
          { email: shippingAddress.email, name: shippingAddress.name, phone: shippingAddress.phone },
          { onConflict: "email" },
        )
        .select("id")
        .single();

      const { data: order } = await supabase
        .from("ecom_orders")
        .insert({
          customer_id: customer?.id,
          status: "paid",
          subtotal,
          tax,
          shipping: shippingCost,
          total: orderTotal,
          shipping_address: shippingAddress,
          stripe_payment_intent_id: paymentIntent.id,
        })
        .select("id")
        .single();

      if (order) {
        const orderItems = cart.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          product_name: item.name,
          variant_title: item.variant_title || null,
          sku: item.sku || null,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.price * item.quantity,
        }));

        await supabase.from("ecom_order_items").insert(orderItems);

        try {
          await supabase.functions.invoke("send-order-confirmation", {
            body: {
              orderId: order.id,
              customerEmail: shippingAddress.email,
              customerName: shippingAddress.name,
              orderItems,
              subtotal,
              shipping: shippingCost,
              tax,
              total: orderTotal,
              shippingAddress,
            },
          });
        } catch (err) {
          console.error("Email error:", err);
        }

        clearCart();
        router.push(`/shop/order-confirmation/${order.id}`);
      }
    } catch (err) {
      console.error("Order creation error:", err);
    }
  };

  const handleWhatsAppCheckout = () => {
    const items = cart
      .map((i) => `- ${i.name}${i.variant_title ? ` (${i.variant_title})` : ""} x${i.quantity}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hi! I'd like to complete checkout:\n\n${items}\n\nName: ${shippingAddress.name}\nEmail: ${shippingAddress.email}\nPhone: ${shippingAddress.phone}`,
    );
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="font-medium text-green-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/shop/cart" className="hover:text-green-700">
          Cart
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className={step === "shipping" ? "font-medium text-green-700" : "text-gray-500"}>Shipping</span>
        <ChevronRight className="h-4 w-4" />
        <span className={step === "payment" ? "font-medium text-green-700" : "text-gray-500"}>Payment</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {step === "shipping" ? (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Shipping Information</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      required
                      value={shippingAddress.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      required
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      value={shippingAddress.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Address *</label>
                    <input
                      required
                      value={shippingAddress.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="123 Farm Road"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
                    <input
                      required
                      value={shippingAddress.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Green Valley"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">State *</label>
                    <input
                      required
                      value={shippingAddress.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="TX"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">ZIP Code *</label>
                    <input
                      required
                      value={shippingAddress.zip}
                      onChange={(e) => updateField("zip", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="75001"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="US">United States</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={processingShipping}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-3.5 font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
                >
                  {processingShipping ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      Calculating...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                  <button onClick={() => setStep("shipping")} className="text-sm text-green-600 hover:underline">
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {shippingAddress.name}
                  <br />
                  {shippingAddress.address}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Lock className="h-5 w-5 text-green-600" />
                  Secure Payment
                </h2>
                {!stripePromise ? (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="mb-2 font-medium text-yellow-800">Payment processing is being set up</p>
                    <p className="text-sm text-yellow-700">Please check back soon or order via WhatsApp for immediate processing.</p>
                  </div>
                ) : paymentError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-800">{paymentError}</p>
                    <button onClick={() => setStep("shipping")} className="mt-2 text-sm font-medium text-red-600 hover:underline">
                      Try Again
                    </button>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: { colorPrimary: "#15803d" },
                      },
                    }}
                  >
                    <PaymentForm onSuccess={handlePaymentSuccess} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-700" />
                    <span className="ml-3 text-gray-600">Loading payment form...</span>
                  </div>
                )}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="mt-3 w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition-colors hover:bg-green-600"
                >
                  Complete via WhatsApp Instead
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={`${item.product_id}-${item.variant_id}-${idx}`} className="flex gap-3">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      width={48}
                      height={48}
                      unoptimized
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Truck className="h-3.5 w-3.5" /> {SHIPPING_RULES}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-bold text-gray-900">Pricing</span>
                <span className="text-sm font-medium text-gray-500">Provided on confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}