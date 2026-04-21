"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

type Collection = {
  id: string;
  title: string;
  description?: string;
  handle: string;
};

export default function CollectionPage() {
  const params = useParams<{ handle: string }>();
  const handle = params?.handle;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("manual");

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (!handle) return;
      setLoading(true);

      const sourceHandle = handle === "chicken-mixed-portions" ? "poultry-feed" : handle;

      const { data: collectionData } = await supabase
        .from("ecom_collections")
        .select("*")
        .eq("handle", sourceHandle)
        .single();

      if (!collectionData) {
        setCollection(null);
        setProducts([]);
        setLoading(false);
        return;
      }

      const normalizedCollection =
        sourceHandle === "poultry-feed"
          ? { ...collectionData, title: "Chicken Mixed Portions", handle: "chicken-mixed-portions" }
          : collectionData;
      setCollection(normalizedCollection as Collection);

      const { data: productLinks } = await supabase
        .from("ecom_product_collections")
        .select("product_id, position")
        .eq("collection_id", collectionData.id)
        .order("position");

      if (!productLinks || productLinks.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productIds = productLinks.map((pl) => pl.product_id);
      const { data: productsData } = await supabase
        .from("ecom_products")
        .select("*, variants:ecom_product_variants(*)")
        .in("id", productIds)
        .eq("status", "active");

      const sortedProducts = productIds.map((id) => productsData?.find((p) => p.id === id)).filter(Boolean);
      setProducts(sortedProducts as any[]);
      setLoading(false);
    };

    fetchCollectionProducts();
  }, [handle]);

  const sortedProducts = useMemo(() => {
    const next = [...products];
    if (sortBy === "name") {
      next.sort((a, b) => a.name.localeCompare(b.name));
    }
    return next;
  }, [products, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-900">{collection?.title || "Collection"}</span>
      </nav>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white">
              <div className="aspect-square rounded-t-xl bg-gray-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{collection?.title}</h1>
              {collection?.description && <p className="mt-2 max-w-2xl text-gray-600">{collection.description}</p>}
              <p className="mt-1 text-sm text-gray-500">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="manual">Default</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-500">No products in this collection yet.</p>
              <Link href="/" className="mt-2 inline-block font-medium text-green-600 hover:underline">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}