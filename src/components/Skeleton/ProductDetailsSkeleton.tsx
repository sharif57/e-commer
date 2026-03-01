const ProductSkeleton = () => {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-gray-200 rounded-lg aspect-[4/5]" />

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg aspect-square"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Store link */}
            <div className="h-4 w-40 bg-gray-200 rounded" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 w-full bg-gray-200 rounded" />
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
            </div>

            {/* Rating */}
            <div className="h-4 w-32 bg-gray-200 rounded" />

            {/* Price */}
            <div className="h-8 w-32 bg-gray-200 rounded" />

            {/* Size */}
            <div className="space-y-3">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-3">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-24 h-36 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="border rounded-lg p-4 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            ))}

            <div className="h-8 w-32 bg-gray-200 rounded" />

            {/* Quantity */}
            <div className="h-12 w-full bg-gray-200 rounded-lg" />

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <div className="h-12 w-full bg-gray-200 rounded-lg" />
              <div className="h-12 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
