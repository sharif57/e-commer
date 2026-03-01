import React from 'react'

export default function InventorySkeleton() {
    return (
        <div>
            <div className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />

                <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2 w-44 bg-gray-200 rounded" />
                </div>

                <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
        </div>
    )
}
