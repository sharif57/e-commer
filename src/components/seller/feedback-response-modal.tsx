"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface Feedback {
  id: string
  author: string
  title: string
  message: string
}

interface FeedbackResponseModalProps {
  feedback: Feedback
  responseText: string
  onResponseChange: (text: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function FeedbackResponseModal({
  feedback,
  responseText,
  onResponseChange,
  onSubmit,
  onClose,
}: FeedbackResponseModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Respond to Feedback</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-slate-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Success Message */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              <span className="font-semibold">✓ Them,</span> I'm just received the product and found an issue ones it.
              Looking forward to hearing from you.
            </p>
          </div>

          {/* Original Feedback */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Original Feedback</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-1">{feedback.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{feedback.message}</p>
          </div>

          {/* Response Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Write a reply</label>
            <textarea
              value={responseText}
              onChange={(e) => onResponseChange(e.target.value)}
              placeholder="Write your response..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-600 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:focus:border-blue-400"
              rows={4}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{responseText.length}/1000 characters</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!responseText.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
