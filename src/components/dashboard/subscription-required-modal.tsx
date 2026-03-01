"use client"

import React from "react"
import { AlertCircle, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

interface SubscriptionRequiredModalProps {
    isOpen: boolean
    onClose: () => void
    userName?: string
    canClose?: boolean
}

export default function SubscriptionRequiredModal({
    isOpen,
    onClose,
    userName = "User",
    canClose = false
}: SubscriptionRequiredModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    const handleSubscribe = () => {
        // Navigate to subscription/upgrade page
        router.push('/upgrade')
    }

    const handleLogout = () => {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('accountType')
        router.push('/auth')
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop - Cannot close if canClose is false */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={canClose ? onClose : undefined}
            />

            {/* Modal - Centered with proper spacing */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6 text-white relative">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold truncate">Subscription Required</h2>
                            <p className="text-white/90 text-xs sm:text-sm mt-1 truncate">Hello, {userName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-4 sm:mb-6">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                            To access the <span className="font-semibold text-gray-900">Seller Dashboard</span> and all its powerful features, you need an active subscription.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                Why Subscribe?
                            </h3>
                            <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5 sm:space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    <span>List unlimited products on the marketplace</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    <span>Access advanced analytics and sales reports</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    <span>Manage inventory and orders efficiently</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    <span>Get priority customer support</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600">
                            Choose a plan that fits your business needs and start selling today!
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <button
                            onClick={handleSubscribe}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
                        >
                            View Subscription Plans
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors active:scale-95 text-sm sm:text-base"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                    <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed">
                        Need help? Contact our support team at{" "}
                        <a href="mailto:support@ebakx.com" className="text-blue-600 hover:underline">
                            support@ebakx.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
