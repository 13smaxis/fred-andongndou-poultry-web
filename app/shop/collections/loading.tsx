export default function CollectionLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-12 w-48 animate-pulse rounded-lg bg-gray-200" />

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <div className="mb-2 h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white">
            <div className="aspect-square rounded-t-xl bg-gray-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
