"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { STORE_WHATSAPP } from "@/lib/constants";
import { SHOP_PRODUCTS } from "@/lib/shop-data";
import { formatEuroPrice } from "@/lib/utils";
import 
{
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  MessageCircle,
  Truck,
} from "lucide-react";

export default function CartPage() 
{
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const resolveCartImage = (productId: string, image?: string) => {
    if (image) return image;

    const product = SHOP_PRODUCTS.find((entry) => entry.id === productId);
    return product?.image;
  };

  const handleWhatsAppOrder = () => {
    const items = cart
      .map(
        (i) =>
          `- ${i.name}${i.variant_title ? ` (${i.variant_title})` : ""} x${i.quantity} @ ${formatEuroPrice(i.price)} = ${formatEuroPrice(i.price * i.quantity)}`,
      )
      .join("\n");
    const total = formatEuroPrice(cartTotal);
    const msg = encodeURIComponent(
      `Hi! I'd like to place an order:\n\n${items}\n\nTotal: ${total}\n\nPlease confirm availability and delivery.`,
    );
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-32">
      <div className="mb-8 flex items-center justify-between">
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700">
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-3xl bg-green-950 p-4 shadow-lg">
          <div className="relative rounded-4xl bg-green-50 px-6 pb-8 pt-16 text-center shadow-sm ring-1 ring-green-100">
            <div className="absolute left-1/2 top-0 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-700 text-white shadow-[0_18px_40px_rgba(21,128,61,0.35)] ring-8 ring-green-950">
              <div className="flex flex-col items-center gap-1">
                <ShoppingCart className="h-8 w-8" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Shopping Cart</span>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">Your cart is empty</h2>
            <p className="mb-6 text-gray-500">Browse our products and add items to your cart.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-green-50/80 p-4 shadow-sm ring-1 ring-green-100 lg:col-span-2">
            {cart.map((item, idx) => (
              <div
                key={`${item.product_id}-${item.variant_id}-${idx}`}
                className="mb-4 flex gap-3 rounded-xl bg-white p-4 shadow-sm last:mb-0"
              >
                {resolveCartImage(item.product_id, item.image) && (
                  <Image
                    src={resolveCartImage(item.product_id, item.image) as string}
                    alt={item.name}
                    width={72}
                    height={72}
                    unoptimized
                    className="h-18 w-18 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
                    </div>
                    <div className="text-right text-sm font-semibold text-blue-600">
                      <div>{formatEuroPrice(item.price)} each</div>
                      <div>{formatEuroPrice(item.price * item.quantity)} total</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product_id, item.variant_id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-green-50/80 p-6 shadow-sm ring-1 ring-green-100">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mb-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{cartCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    <Truck className="h-3.5 w-3.5" /> Free
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold text-gray-900">Total amount</span>
                  <span className="text-sm font-semibold text-blue-600">{formatEuroPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-3.5 font-semibold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </button>
              <Link href="/shop" className="mt-4 block text-center text-sm font-medium text-green-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}