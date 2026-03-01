"use client"

import { Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Feedback {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  title: string
  message: string
  response?: string
}

interface FeedbackListProps {
  feedbacks: Feedback[]
  onRespondClick: (id: string) => void
}

export default function FeedbackList({ feedbacks, onRespondClick }: FeedbackListProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Seller ratings ({feedbacks.length})</h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            {/* User Info */}
            <div className="flex items-start gap-4">
              <img
                src={feedback.avatar || "/placeholder.svg"}
                alt={feedback.author}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700"
              />
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feedback.author}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feedback.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feedback Title and Message */}
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feedback.title}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{feedback.message}</p>

                {/* Response Section */}
                {feedback.response ? (
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mt-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Your Response:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.response}</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRespondClick(feedback.id)}
                    className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-slate-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
