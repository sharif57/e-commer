export default function SalesReportSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gray-200" />
          <div className="h-4 w-28 rounded bg-gray-200" />
        </div>
        <div className="h-9 w-28 rounded-md bg-gray-200" />
      </div>

      {/* Revenue */}
      <div className="mt-4 space-y-2">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
      </div>

      {/* Chart */}
      <div className="mt-6">
        <div className="h-[200px] w-full rounded-md bg-gray-200" />
      </div>

      {/* Hover Info */}
      <div className="mt-3 flex justify-center">
        <div className="h-8 w-40 rounded-md bg-gray-200" />
      </div>

      {/* Month Pills */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-6 w-12 rounded-full bg-gray-200"
          />
        ))}
      </div>
    </div>
  )
}
