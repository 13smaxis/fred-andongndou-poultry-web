"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { STORE_WHATSAPP } from "@/lib/constants";
import { SHOP_CATEGORIES, SHOP_PRODUCTS, SHOP_PROMOTIONS, type ShopCategory, type ShopProduct } from "@/lib/shop-data";

export default function ShopPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>("All");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const categoryParam = new URLSearchParams(window.location.search).get("category") as ShopCategory | null;
    if (categoryParam && SHOP_CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
      return;
    }
    setSelectedCategory("All");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOP_PROMOTIONS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return SHOP_PRODUCTS;
    }
    return SHOP_PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = (product: ShopProduct) => {
    addToCart({
      product_id: product.id,
      variant_id: undefined,
      name: product.name,
      variant_title: undefined,
      sku: product.id,
      price: 0,
      image: product.image,
    });
  };

  const handleWhatsApp = (product: ShopProduct) => {
    const msg = encodeURIComponent(`Hi! I would like to order ${product.name}. Please share availability and pricing.`);
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <section className="mb-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
        <div className="relative h-56 sm:h-64 md:h-72">
          {SHOP_PROMOTIONS.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${activeSlide === idx ? "opacity-100" : "opacity-0"}`}
            >
              <Image src={slide.image} alt={slide.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-900/55 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div className="max-w-xl text-white">
                  <span className="mb-2 inline-block rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {slide.badge}
                  </span>
                  <h2 className="text-2xl font-bold md:text-3xl">{slide.title}</h2>
                  <p className="mt-2 text-sm text-green-100 md:text-base">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-green-100 bg-white p-3">
          {SHOP_PROMOTIONS.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${activeSlide === idx ? "w-8 bg-green-700" : "w-2.5 bg-green-200"}`}
              aria-label={`Show promotion ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Categories</h3>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {SHOP_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">All Products</h3>
            <p className="text-sm text-gray-500">{filteredProducts.length} items</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                  {product.tags?.includes("featured") && (
                    <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                      Featured
                    </span>
                  )}
                  {product.tags?.includes("discount") && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                      Discount
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{product.category}</p>
                  <h4 className="mt-1 text-base font-semibold text-gray-900">{product.name}</h4>
                  <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleWhatsApp(product)}
                      className="inline-flex items-center justify-center rounded-lg bg-green-500 px-3 py-2.5 text-white transition-colors hover:bg-green-600"
                      title="Order via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
