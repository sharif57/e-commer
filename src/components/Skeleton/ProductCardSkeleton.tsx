const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col bg-card overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-muted">
        {/* Wishlist button skeleton */}
        <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-gray-200" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 pt-4">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />

        {/* Rating placeholder */}
        <div className="h-3 bg-gray-200 rounded mb-3 w-24" />

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
