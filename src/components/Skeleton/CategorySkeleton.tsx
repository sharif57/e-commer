const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-200 rounded-lg" />

      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 rounded mt-6 w-3/4" />
    </div>
  );
};

export default CategorySkeleton;
