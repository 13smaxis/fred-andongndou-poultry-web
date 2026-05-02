import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";

function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      {/* ShopClient contains all client-only hooks like useSearchParams and useCart. */}
      <ShopClient />
    </Suspense>
  );
}
