"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function CollectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Failed to Load Collection</h1>
      <p className="mb-6 text-gray-600">
        We encountered an error while loading this collection. Please try again.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={reset}
          className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back to Home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
