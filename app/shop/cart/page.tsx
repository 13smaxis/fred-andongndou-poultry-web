"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { STORE_WHATSAPP } from "@/lib/constants";
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
  const { cart, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleWhatsAppOrder = () => {
    const items = cart
      .map((i) => `- ${i.name}${i.variant_title ? ` (${i.variant_title})` : ""} x${i.quantity}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hi! I'd like to place an order:\n\n${items}\n\nPlease confirm availability and delivery.`,
    );
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Shopping Cart</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700">
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="rounded-xl bg-white py-20 text-center shadow-sm">
          <ShoppingCart className="mx-auto mb-4 h-20 w-20 text-gray-300" />
          <h2 className="mb-2 text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="mb-6 text-gray-500">Browse our products and add items to your cart.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item, idx) => (
              <div
                key={`${item.product_id}-${item.variant_id}-${idx}`}
                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
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
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
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
                  <span className="font-bold text-gray-900">Pricing</span>
                  <span className="text-sm font-medium text-gray-500">Provided on confirmation</span>
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