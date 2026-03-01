"use client"

import { Star } from "lucide-react"

interface Feedback {
  id: string
  rating: number
}

interface FeedbackStatsProps {
  feedbacks: Feedback[]
}

export default function FeedbackStats({ feedbacks }: FeedbackStatsProps) {
  const totalFeedback = feedbacks.length
  const averageRating =
    feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 0

  const ratingDistribution = {
    5: feedbacks.filter((f) => f.rating === 5).length,
    4: feedbacks.filter((f) => f.rating === 4).length,
    3: feedbacks.filter((f) => f.rating === 3).length,
    2: feedbacks.filter((f) => f.rating === 2).length,
    1: feedbacks.filter((f) => f.rating === 1).length,
  }

  const positivePercentage =
    totalFeedback > 0 ? Math.round(((ratingDistribution[5] + ratingDistribution[4]) / totalFeedback) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Main Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Feedback ratings</h2>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{averageRating}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">out of 5.0</p>
              </div>
              <div className="flex flex-col gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(Number.parseFloat(averageRating as string))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Positive", value: positivePercentage, color: "bg-green-500" },
            { label: "Neutral", value: 0, color: "bg-gray-400" },
            { label: "Negative", value: 100 - positivePercentage, color: "bg-red-500" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">{item.label}</span>
              <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white w-10 text-right">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Detailed Ratings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Detailed seller ratings</h2>

        <div className="space-y-4">
          {[
            { label: "Accurate description", rating: 5.0 },
            { label: "On-time shipping", rating: 5.0 },
            { label: "Communication", rating: 5.0 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-gray-300 dark:bg-slate-700 rounded-full" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
