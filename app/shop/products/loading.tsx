export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-12 w-48 animate-pulse rounded-lg bg-gray-200" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-6 w-32 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="space-y-3">
            <div className="h-6 w-20 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
