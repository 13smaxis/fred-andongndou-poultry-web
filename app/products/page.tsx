import { Suspense } from "react";
import ProductsClient from "@/components/ProductsClient";

function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="h-64 animate-pulse rounded-[32px] bg-gray-200" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="h-[38rem] animate-pulse rounded-[30px] bg-gray-200" />
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-72 animate-pulse rounded-[30px] bg-gray-200" />
            <div className="h-72 animate-pulse rounded-[30px] bg-gray-200" />
          </div>
          <div className="h-96 animate-pulse rounded-[30px] bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsClient />
    </Suspense>
  );
}
