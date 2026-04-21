"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { STORE_WHATSAPP } from "@/lib/constants";
import {
  ShoppingCart,
  MessageCircle,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  Clock,
} from "lucide-react";

type Variant = {
  id: string;
  title?: string;
  option1?: string;
  sku?: string;
  price?: number;
  inventory_qty?: number | null;
  position?: number;
};

type Product = {
  id: string;
  name: string;
  handle: string;
  description?: string;
  product_type?: string;
  sku?: string;
  price: number;
  images?: string[];
  has_variants?: boolean;
  inventory_qty?: number | null;
  metadata?: Record<string, unknown>;
  variants?: Variant[];
};

export default function ProductPage() {
  const params = useParams<{ handle: string }>();
  const handle = params?.handle;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setLoading(true);
      setSelectedVariant(null);
      setSelectedOption("");
      setQuantity(1);

      const { data } = await supabase
        .from("ecom_products")
        .select("*, variants:ecom_product_variants(*)")
        .eq("handle", handle)
        .single();

      if (data) {
        const typedData = data as Product;
        let variants = typedData.variants || [];
        if (typedData.has_variants && variants.length === 0) {
          const { data: variantData } = await supabase
            .from("ecom_product_variants")
            .select("*")
            .eq("product_id", typedData.id)
            .order("position");
          variants = (variantData as Variant[] | null) || [];
          typedData.variants = variants;
        }

        setProduct(typedData);
        if (variants.length > 0) {
          const sorted = [...variants].sort((a, b) => (a.position || 0) - (b.position || 0));
          const firstInStock = sorted.find((v) => v.inventory_qty == null || v.inventory_qty > 0) || sorted[0];
          setSelectedVariant(firstInStock);
          setSelectedOption(firstInStock?.option1 || "");
        }
      } else {
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [handle]);

  const handleOptionSelect = (opt: string) => {
    setSelectedOption(opt);
    const variant = product?.variants?.find(
      (v) => v.option1 === opt || v.title?.toLowerCase().includes(opt.toLowerCase()),
    );
    if (variant) setSelectedVariant(variant);
  };

  const variantOptions = useMemo(
    () => [...new Set(product?.variants?.map((v) => v.option1).filter(Boolean) || [])] as string[],
    [product?.variants],
  );
  const hasVariants = !!(product?.has_variants && product?.variants?.length);

  const inStock = useMemo(() => {
    if (selectedVariant) {
      if (selectedVariant.inventory_qty == null) return true;
      return selectedVariant.inventory_qty > 0;
    }
    if (product?.variants?.length) {
      return product.variants.some((v) => v.inventory_qty == null || v.inventory_qty > 0);
    }
    if (product?.has_variants) return true;
    if (product?.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  }, [product, selectedVariant]);

  const handleAddToCart = () => {
    if (!product) return;
    if (hasVariants && !selectedOption) return;
    if (!inStock) return;

    addToCart(
      {
        product_id: product.id,
        variant_id: selectedVariant?.id || undefined,
        name: product.name,
        variant_title: selectedVariant?.title || selectedOption || undefined,
        sku: selectedVariant?.sku || product.sku || product.handle,
        price: selectedVariant?.price || product.price,
        image: product.images?.[0],
      },
      quantity,
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const variant = selectedVariant?.title || selectedOption || "";
    const msg = encodeURIComponent(
      `Hi! I'd like to order:\n\nProduct: ${product?.name}\n${variant ? `Option: ${variant}\n` : ""}Quantity: ${quantity}\n\nPlease confirm availability.`,
    );
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Product Not Found</h1>
        <Link href="/" className="font-medium text-green-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate font-medium text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src={product.images?.[selectedImage] || product.images?.[0] || ""}
              alt={product.name}
              fill
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
          {product.images?.length && product.images.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === idx ? "border-green-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill unoptimized className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-green-600">{product.product_type}</p>
          <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-gray-500">Contact us for pricing</span>
            {inStock ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">In Stock</span>
            ) : (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">Out of Stock</span>
            )}
          </div>

          <p className="mb-6 leading-relaxed text-gray-600">{product.description}</p>

          {hasVariants && variantOptions.length > 0 ? (
            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-gray-900">Select Option</label>
              <div className="flex flex-wrap gap-2">
                {variantOptions.map((opt) => {
                  const variant = product.variants?.find((v) => v.option1 === opt);
                  const optInStock = variant ? variant.inventory_qty == null || variant.inventory_qty > 0 : true;
                  return (
                    <button
                      key={opt}
                      onClick={() => optInStock && handleOptionSelect(opt)}
                      disabled={!optInStock}
                      className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                        selectedOption === opt
                          ? "border-green-700 bg-green-700 text-white"
                          : optInStock
                            ? "border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-700"
                            : "cursor-not-allowed border-gray-200 text-gray-300 line-through"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-gray-900">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 transition-colors hover:border-green-500"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 transition-colors hover:border-green-500"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={(hasVariants && !selectedOption) || !inStock}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3.5 font-semibold transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : !inStock
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : "bg-green-700 text-white hover:bg-green-800"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <ShoppingCart className="h-5 w-5" />
              {added
                ? "Added to Cart!"
                : !inStock
                  ? "Out of Stock"
                  : hasVariants && !selectedOption
                    ? "Select an Option"
                    : "Add to Cart"}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-green-600 sm:flex-none"
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Health Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Fresh & Healthy</span>
            </div>
          </div>

          {product.metadata && Object.keys(product.metadata).length > 0 ? (
            <div className="rounded-xl border bg-white p-5">
              <h3 className="mb-3 font-semibold text-gray-900">Product Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.metadata).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}