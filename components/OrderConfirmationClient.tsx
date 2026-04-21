"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { STORE_PHONE, STORE_WHATSAPP } from "@/lib/constants";
import { CheckCircle, Package, Phone, MessageCircle, ArrowRight } from "lucide-react";

export default function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      if (orderId.startsWith("local-")) {
        setOrder({ id: orderId, created_at: new Date().toISOString(), shipping: 0 });
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: orderData } = await supabase.from("ecom_orders").select("*").eq("id", orderId).single();

      if (orderData) {
        setOrder(orderData);
        const { data: itemsData } = await supabase.from("ecom_order_items").select("*").eq("order_id", orderId);
        setItems(itemsData || []);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-xl bg-white p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">Order Confirmed!</h1>
        <p className="mb-4 text-gray-600">Thank you for your order. We&apos;ll start preparing it right away.</p>
        {order && (
          <p className="text-sm text-gray-500">
            Order #{orderId?.slice(0, 8).toUpperCase()} &middot;{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {order && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
            <Package className="h-5 w-5 text-green-600" />
            Order Details
          </h2>
          <div className="mb-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-gray-100 py-2 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-gray-500">
                Your order details are being finalized. We will confirm exact item lines shortly.
              </p>
            )}
          </div>
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Status</span>
              <span className="font-medium text-green-700">Confirmed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">{order.shipping === 0 ? "Free" : "Standard"}</span>
            </div>
          </div>
        </div>
      )}

      {order?.shipping_address && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-900">Shipping Address</h2>
          <p className="text-sm text-gray-600">
            {order.shipping_address.name}
            <br />
            {order.shipping_address.address}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
          </p>
        </div>
      )}

      <div className="mb-8 rounded-xl bg-green-50 p-6">
        <h3 className="mb-3 font-semibold text-green-800">Need Help?</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${STORE_PHONE}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-200 bg-white py-3 font-medium text-green-700 transition-colors hover:bg-green-100"
          >
            <Phone className="h-4 w-4" /> Call Us
          </a>
          <a
            href={`https://wa.me/${STORE_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:underline">
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
