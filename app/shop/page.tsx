import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SHOP_COLLECTIONS } from "@/lib/constants";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span className="font-medium text-gray-900">Shop</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Shop Collections</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Browse all poultry categories and choose the collection that matches what you need today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHOP_COLLECTIONS.map((collection) => (
          <Link
            key={collection.id}
            href={`/shop/collections/${collection.handle}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
          >
            <p className="text-base font-semibold text-gray-900 transition-colors group-hover:text-green-700">
              {collection.title}
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-700">
              Browse collection
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
