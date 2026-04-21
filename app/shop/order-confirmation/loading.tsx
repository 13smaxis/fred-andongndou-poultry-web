export default function OrderConfirmationLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 rounded-xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200" />
        <div className="mb-2 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="mb-4 h-4 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-100 py-2">
              <div className="mb-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-green-50 p-6">
        <div className="mb-3 h-6 w-32 animate-pulse rounded-lg bg-gray-200" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
