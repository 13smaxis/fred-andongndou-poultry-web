"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Bird,
  Drumstick,
  Egg,
  Leaf,
  Package,
  ShieldCheck,
  Sparkles,
  Wheat,
  Droplets,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopCategory, type ShopProduct } from "@/lib/shop-data";

type ProductCategory = Exclude<ShopCategory, "All">;

type CategoryMeta = {
  icon: typeof Bird;
  title: string;
  description: string;
  summary: string;
  specs: string[];
  nutrition: string[];
  accent: string;
  relatedHint: string;
};

const productCategories = SHOP_CATEGORIES.filter((category): category is ProductCategory => category !== "All");

const categoryMeta: Record<ProductCategory, CategoryMeta> = {
  "Live Chicken": {
    icon: Bird,
    title: "Live Chickens",
    description: "Healthy birds ready for pickup or delivery, with options for broilers, chicks, hens, and free-range stock.",
    summary: "Choose the right live bird for rearing, egg production, or immediate processing.",
    specs: ["Broilers, day-old chicks, hens, and free-range stock", "Healthy live birds sourced for farm use or resale", "Sized for small households and bulk buyers"],
    nutrition: ["High-quality protein after preparation", "Naturally rich in B vitamins", "Lean meat when prepared with minimal fat"],
    accent: "from-emerald-500/20 via-emerald-400/10 to-lime-500/10",
    relatedHint: "Live bird options",
  },
  "Tender Chicken Portions": {
    icon: Drumstick,
    title: "Chicken Portions",
    description: "Fresh-cut wings, thighs, breasts, backs, and mixed portions for quick family meals and bulk catering.",
    summary: "Versatile cuts that cook fast and work well across grills, roasts, and stews.",
    specs: ["Premium cuts for home kitchens and restaurants", "5kg packs for bulk buyers", "Fresh-cut and ready for cooking"],
    nutrition: ["High protein content", "Balanced fat for flavour and tenderness", "Good source of iron and zinc"],
    accent: "from-amber-500/20 via-orange-400/10 to-rose-500/10",
    relatedHint: "Fresh portion cuts",
  },
  Eggs: {
    icon: Egg,
    title: "Eggs",
    description: "Farm-fresh eggs packed daily in tray formats for households, bakeries, and food service buyers.",
    summary: "A dependable protein staple for cooking, baking, and breakfast service.",
    specs: ["Large and jumbo tray options", "Packed fresh for daily supply", "Ideal for home and commercial kitchens"],
    nutrition: ["High-quality complete protein", "Choline for brain support", "Vitamin D, selenium, and B12"],
    accent: "from-yellow-500/20 via-amber-400/10 to-orange-500/10",
    relatedHint: "Tray egg options",
  },
  Feed: {
    icon: Wheat,
    title: "Feed",
    description: "Grower and layer feed designed to support healthy growth, strong production, and consistent flock performance.",
    summary: "Balanced nutrition for birds at different stages of the production cycle.",
    specs: ["Grower and layer formulas", "25kg bags for bulk use", "Built for steady flock management"],
    nutrition: ["Crude protein for muscle and growth", "Energy for daily bird activity", "Calcium and vitamins for egg formation"],
    accent: "from-lime-500/20 via-green-400/10 to-emerald-500/10",
    relatedHint: "Feed formulas",
  },
};

function buildSearchUrl(category: ProductCategory, productId?: string) {
  const params = new URLSearchParams();
  params.set("category", category);
  if (productId) params.set("product", productId);
  return `/products?${params.toString()}`;
}

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedCategory = useMemo<ProductCategory>(() => {
    const category = searchParams.get("category");
    return productCategories.includes(category as ProductCategory) ? (category as ProductCategory) : "Live Chicken";
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const activeProduct = useMemo<ShopProduct>(() => {
    const selectedProductId = searchParams.get("product");
    const productById = filteredProducts.find((product) => product.id === selectedProductId);
    return productById || filteredProducts[0] || SHOP_PRODUCTS[0];
  }, [filteredProducts, searchParams]);

  const activeMeta = categoryMeta[selectedCategory];

  const handleCategoryChange = (category: ProductCategory) => {
    const firstProduct = SHOP_PRODUCTS.find((product) => product.category === category);
    router.push(buildSearchUrl(category, firstProduct?.id));
  };

  const handleProductChange = (product: ShopProduct) => {
    router.push(buildSearchUrl(product.category, product.id));
  };

  const activeCategoryMeta = categoryMeta[selectedCategory];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-linear-to-br from-green-950 via-emerald-900 to-slate-950 px-6 py-8 text-white shadow-2xl md:px-8 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_34%)]" />
        <div className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">
              <Package className="h-4 w-4" />
              Products
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Browse poultry products with a focused category view.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 md:text-base">
              Use the four filters below to jump between live chickens, tender portions, eggs, and feed. Each selection opens a product detail view with specs and nutrition at a glance.
            </p>
          </div>

          <div className="mt-8 sm:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${activeCategoryMeta.accent} text-white ring-1 ring-white/10`}>
                  <activeCategoryMeta.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/70">Filter</span>
                  <span className="block text-base font-semibold text-white">{activeCategoryMeta.title}</span>
                </span>
              </span>
              <ChevronDown className={`h-5 w-5 text-white transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-sm transition-all duration-300 ${mobileFiltersOpen ? "max-h-[24rem] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="grid gap-2 p-2">
                {productCategories.map((category) => {
                  const meta = categoryMeta[category];
                  const Icon = meta.icon;
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        handleCategoryChange(category);
                        setMobileFiltersOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        isActive ? "bg-white/15 text-white" : "text-slate-100 hover:bg-white/10"
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${meta.accent} text-white ring-1 ring-white/10`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold">{meta.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category) => {
              const meta = categoryMeta[category];
              const Icon = meta.icon;
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                    isActive
                      ? "border-amber-300/50 bg-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
                      : "border-white/10 bg-white/8 hover:bg-white/12"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${meta.accent} text-white ring-1 ring-white/10`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">Filter</span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{meta.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-50/80">{meta.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-200">
                    Open products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside className="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <div className={`relative aspect-square bg-linear-to-br ${activeMeta.accent} p-5`}>
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {selectedCategory}
            </div>
            <Image
              src={activeProduct.image}
              alt={activeProduct.name}
              fill
              className="object-contain p-10 drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
              unoptimized
            />
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-600">Selected product</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">{activeProduct.name}</h2>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {activeProduct.inStock ? "In stock" : "Check availability"}
              </span>
            </div>

            <p className="text-sm leading-7 text-gray-600">{activeMeta.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Pack size</p>
                <p className="mt-2 font-semibold text-gray-900">{activeProduct.size}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Price</p>
                <p className="mt-2 font-semibold text-gray-900">${activeProduct.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Why it matters
              </div>
              <p className="mt-2 leading-6">{activeMeta.summary}</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <article className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-600">Description</p>
                  <h3 className="text-xl font-bold text-gray-900">{activeProduct.name}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-600">{activeProduct.description}</p>
              <p className="mt-4 text-sm leading-7 text-gray-600">{activeMeta.description}</p>
            </article>

            <article className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">Specs & Nutrition</p>
                  <h3 className="text-xl font-bold text-gray-900">Key details</h3>
                </div>
              </div>

              <div className="mt-4 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Specs</h4>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
                    {activeMeta.specs.map((spec) => (
                      <li key={spec} className="flex gap-2">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Nutrition</h4>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {activeMeta.nutrition.map((entry) => (
                      <li key={entry} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>

          <article className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-600">More in this category</p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">{activeMeta.relatedHint}</h3>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {filteredProducts.length} items
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const isActive = product.id === activeProduct.id;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductChange(product)}
                    className={`group overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-0.5 ${
                      isActive
                        ? "border-green-500 bg-green-50 shadow-[0_14px_36px_rgba(16,185,129,0.14)]"
                        : "border-gray-200 bg-white hover:border-green-200 hover:shadow-lg"
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-semibold text-gray-900">{product.name}</h4>
                      <p className="mt-1 text-sm text-gray-600">{product.size}</p>
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                        Open product
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
