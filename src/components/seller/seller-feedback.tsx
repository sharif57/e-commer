/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useGetReviewCountQuery, useGetSellerFeedbackQuery } from "@/redux/feature/buyer/productSlice"
import { DetailedRatings } from "./detailed-ratings"
import { RatingStats } from "./rating-stats"
import { ReviewCard } from "./review-card"
import { formatDistanceToNow } from 'date-fns'

export default function SellerFeedback({sellerId }: {sellerId: string}) {

  const {data} = useGetSellerFeedbackQuery(sellerId || '');
  const {data: reviewCounter} = useGetReviewCountQuery(sellerId || '');

  // Format review data for ReviewCard component
  const formattedReviews = data?.data?.result?.map((review: any) => ({
    id: review._id,
    author: review.userId.email?.split('@')[0] || 'Anonymous',
    avatar: review.userId.image || '/images/seller profile photo.png',
    timeAgo: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }),
    rating: review.rating,
    text: review.review,
  })) || [];

  // Get review counts
  const totalReviews = data?.data?.meta?.total || 0;
  const positiveCount = reviewCounter?.data?.positive || 0;
  const neutralCount = reviewCounter?.data?.neutral || 0;
  const negativeCount = reviewCounter?.data?.negative || 0;

  return (
    <div className="w-full container mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-10">
      {/* Feedback Ratings Section */}
      <div className="mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row gap-14">
          <div>
            <h2 className="text-xl md:text-lg font-semibold text-[#000000] mb-4 md:mb-5">
              Feedback ratings
            </h2>
            <RatingStats
              title="Feedback ratings"
              stats={[
                { label: 'Positive', value: positiveCount.toString() },
                { label: 'Neutral', value: neutralCount.toString() },
                { label: 'Negative', value: negativeCount.toString() },
              ]}
            />
          </div>
          <DetailedRatings />
        </div>
      </div>

      {/* Seller Ratings Section */}
      <div className="mb-8 md:mb-10">
        <h3 className="text-lg md:text-xl font-semibold text-[#000000] mb-4 md:mb-5">
          Seller ratings <span className="text-[#00000099] font-normal">({totalReviews})</span>
        </h3>

        <div className="mb-6 md:mb-8">
          <RatingStats
            title="Seller ratings"
            stats={[
              { label: 'Positive', value: positiveCount.toString() },
              { label: 'Neutral', value: neutralCount.toString() },
              { label: 'Negative', value: negativeCount.toString() },
            ]}
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-2 md:space-y-0">
          {formattedReviews.length > 0 ? (
            formattedReviews.map((review: any) => (
              <div key={review.id}>
                <ReviewCard review={review} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

