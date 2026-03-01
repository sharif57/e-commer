interface RatingItem {
  label: string
  score: number
}

const ratings: RatingItem[] = [
  { label: 'Accurate description', score: 5.0 },
  { label: 'On time shipping', score: 5.0 },
  { label: 'Reasonable shipping cost', score: 5.0 },
  { label: 'Communication', score: 5.0 },
]

export function DetailedRatings() {
  return (
    <div>
      <h3 className="text-xl md:text-lg font-semibold text-[#000000] mb-4 md:mb-5">
        Detailed seller ratings
      </h3>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="text-sm md:text-base text-[#000000] font-normal flex-1">
              {rating.label}
            </span>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-20 md:w-24 h-0.5 md:h-0.5 bg-gray-800 rounded-full"></div>
              <span className="text-sm md:text-base text-[#000000] font-medium min-w-fit">
                {rating.score.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
