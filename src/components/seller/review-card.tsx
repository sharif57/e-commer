/* eslint-disable @next/next/no-img-element */
import { Star } from 'lucide-react'

interface Review {
  id: number
  author: string
  avatar: string
  timeAgo: string
  rating: number
  text: string
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="py-">
      <div className=" md:py-6">
        <div className="flex items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4 ">
          {/* Profile Section */}
          <div className="flex items-center gap-3 flex-1 md:flex-initial">
            <img
              src={review.avatar || "/placeholder.svg"}
              alt={review.author}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h4 className="text-sm md:text-base font-medium text-gray-900">
                {review.author}
              </h4>
            </div>
          </div>

          {/* Time and Rating on Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <span className="text-sm text-gray-600">
              {review.timeAgo}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Time and Rating on Mobile */}
        <div className="flex md:hidden items-center justify-between mb-3">
          <span className="text-xs text-gray-600">
            {review.timeAgo}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          {review.text}
        </p>
      </div>
    </div>
  )
}
