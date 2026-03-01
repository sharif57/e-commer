import React from 'react'

export default function MessageSkeleton() {
    return (
        <div>
            <div className="flex items-start gap-3 animate-pulse">
                {/* Avatar Skeleton */}
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />

                {/* Content Skeleton */}
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>

                    <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}
