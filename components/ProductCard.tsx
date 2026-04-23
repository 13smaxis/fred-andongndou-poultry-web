"use client";

import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { STORE_WHATSAPP } from "@/lib/constants";
import { ShoppingCart, MessageCircle, Eye } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const getInStock = (): boolean => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.some((v: any) => v.inventory_qty == null || v.inventory_qty > 0);
    }
    if (product.has_variants) return true;
    if (product.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  };

  const inStock = getInStock();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    addToCart({
      product_id: product.id,
      variant_id: undefined,
      name: product.name,
      variant_title: undefined,
      sku: product.sku || product.handle,
      price: product.price,
      image: product.images?.[0],
    });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Hi! I'm interested in ordering: ${product.name}. Please let me know about availability.`,
    );
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images?.[0] || product.image || ""}
            alt={product.name}
            fill
            unoptimized
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Out of Stock</span>
            </div>
          )}
          {inStock && product.tags?.includes("featured") && (
            <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {inStock && product.tags?.includes("bestseller") && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              Bestseller
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-linear-to-t from-black/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                disabled={!inStock}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={handleWhatsApp}
                className="rounded-lg bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-600"
                title="Order via WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-green-600">{product.product_type}</p>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-green-700 md:text-base">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Contact us for availability</p>
            {inStock ? (
              <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">In Stock</span>
            ) : (
              <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">Sold Out</span>
            )}
          </div>
          {product.metadata?.next_batch && (
            <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              {product.metadata.next_batch}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
