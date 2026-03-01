/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Package, Star, Handbag, PackageSearch, AudioWaveform, ChartNoAxesCombined, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import SalesReport from "@/components/seller/sales-report"
import { useAccountHealthRatioQuery, useAccountMsgResponseQuery, useAllReviewAndRatingRatioQuery, useOnTimeDeliveryRatioQuery, useSellerWalletDataQuery } from "@/redux/feature/seller/accountSetting"
import { useGetRecentMessageQuery } from "@/redux/feature/seller/message"
import MessageSkeleton from "@/components/Skeleton/MessageSkeleton"
import Link from "next/link"
import { useGetSellerProductsQuery } from "@/redux/feature/seller/productSellerSlice"
import InventorySkeleton from "@/components/Skeleton/InventorySkeleton"

export default function DashboardOverview() {
    const [timeRange, setTimeRange] = useState("monthly")
    const [inventoryFilter, setInventoryFilter] = useState("in-stock")

    const { data } = useAccountHealthRatioQuery(undefined);
    const { data: msgData } = useAccountMsgResponseQuery(undefined);
    const { data: deliveryData } = useOnTimeDeliveryRatioQuery(undefined);



    const { data: reviewData } = useAllReviewAndRatingRatioQuery(undefined);
    const getRatingText = (rating: number) => {
        if (rating >= 4.5) return "Excellent"
        if (rating >= 4) return "Very Good"
        if (rating >= 3) return "Good"
        if (rating >= 2) return "Average"
        return "Poor"
    }

    const { data: msg, isLoading } = useGetRecentMessageQuery(undefined);
    const { data: sellerWalletData } = useSellerWalletDataQuery(timeRange)

    const stats = [
        {
            icon: Package,
            label: "Total Wallet",
            value: sellerWalletData?.data?.totalAmount || 0,
            badge: timeRange,
            badgeColor: "text-gray-400",
        },
        {
            icon: Handbag,
            label: "Response Rate",
            value: (msgData?.data?.responseRate || 0) + '%',
            badge: "Excellent",
            badgeColor: "text-blue-400",
        },
        {
            icon: PackageSearch,
            label: "On-time Delivery",
            value: (deliveryData?.data?.deliveryRatio || 0) + '%',
            badge: "till 90% is excellent",
            badgeColor: "text-gray-400",
        },
        {
            icon: ChartNoAxesCombined,
            label: "Review & Ratings",
            value: reviewData?.data?.averageRating || 0,
            badge: getRatingText(reviewData?.data?.averageRating || 0),
            badgeColor:
                (reviewData?.data?.averageRating || 0) >= 4
                    ? "text-green-400"
                    : (reviewData?.data?.averageRating || 0) >= 3
                        ? "text-yellow-400"
                        : "text-red-400",
        },

        {
            icon: AudioWaveform,
            label: "Account Health",
            value: (data?.data?.accountHealthRatio || 0) + '%',
            badge: data?.data?.healthStatus || '',
            badgeColor: "text-gray-400",
        },

    ]

    const performingProducts = [
        {
            id: 1,
            image: "/images/grill.jpg",
            name: "Animo Exclusive Toy Set for Kids",
            category: "Toys, Kids & Baby > Toys & Game",
            sold: "40.2k sold",
            rating: 4.5,
        },
        {
            id: 2,
            image: "/images/grill.jpg",
            name: "Women Western Modern Party Dress",
            category: "Fashion & Beauty > Clothing",
            sold: "19.8k sold",
            rating: 4.8,
        },
        {
            id: 3,
            image: "/images/grill.jpg",
            name: "Ladies Premium Mini Makeup COMBO Pack",
            category: "Health & Beauty > Skin Care",
            sold: "8.9k sold",
            rating: 5.0,
        },
        {
            id: 4,
            image: "/images/grill.jpg",
            name: "250 ML. Women Body Lotion for Winter",
            category: "Health & Beauty > Skin Care",
            sold: "7.1k sold",
            rating: 4.8,
        },
    ]

    const inStockParam =
        inventoryFilter === "in-stock"
            ? true
            : inventoryFilter === "out-of-stock"
                ? false
                : undefined

    const queryParams =
        inStockParam !== undefined
            ? { inStock: inStockParam }
            : {}

    const { data: sellerProducts, isLoading: sellerProductsLoading } =
        useGetSellerProductsQuery(queryParams)



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 rounded-xl overflow-hidden">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-[#171717] p-6 text-white">
                            <div className="flex items-start justify-between mb-4">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-[#FFFFFF] font-semibold">{stat.label}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-bold text-[#FFFFFF]">{stat.value}</p>
                                    <p className={`text-xs font-semibold ${stat.badgeColor}`}>{stat.badge}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performing Products */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#171717]" />
                            <h2 className="text-sm font-semibold text-[#171717]">Performing Products</h2>
                        </div>
                        <Select defaultValue="best-selling" >
                            <SelectTrigger className="w-40 text-sm " >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="best-selling">Sort by Best selling</SelectItem>
                                <SelectItem value="most-viewed">Most viewed</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        {performingProducts.map((product) => (
                            <div key={product.id} className="flex items-start gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{product.category}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-medium text-gray-900">{product.sold}</p>
                                    <div className="flex items-center justify-end gap-1 mt-0.5">
                                        <span className="text-xs font-medium text-gray-900">{product.rating}</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-start justify-start">
                        <Button
                            variant="link"
                            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                        >
                            View all 21 items →
                        </Button>
                    </div>

                </div>

                {/* Sales Report */}
                <SalesReport />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5  rounded">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-sm font-semibold text-[#171717]">Recent Messages</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-4">
                            {isLoading
                                ? Array.from({ length: 5 }).map((_, index) => (
                                    <MessageSkeleton key={index} />
                                ))
                                : msg?.data?.result?.map((item: any) => (
                                    <div key={item._id} className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                            <Image
                                                src="/images/grill.jpg"
                                                alt={`${item.receiver.firstName} ${item.receiver.lastName}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Message Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-[11px] font-medium text-[#171717B2]">
                                                    {item.receiver.firstName} {item.receiver.lastName}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {item.sentAt}
                                                </span>
                                            </div>

                                            <p className="text-sm text-[#171717] truncate font-medium">
                                                {item.message}
                                            </p>
                                        </div>

                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                                    </div>
                                ))}
                        </div>

                        <Link href={'/dashboard/message'} className="flex flex-col items-start justify-start">
                            <Button
                                variant="link"
                                className=" text-sm text-blue-600 hover:text-blue-700"
                            >
                                View all messages →
                            </Button>
                        </Link>
                    </div>



                </div>

                {/* Inventory */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-600" />
                            <h2 className="text-sm font-semibold text-[#171717]">Inventory</h2>
                        </div>

                        <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in-stock">In stock</SelectItem>
                                <SelectItem value="out-of-stock">Out of stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        {sellerProductsLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <InventorySkeleton key={i} />
                            ))
                            : sellerProducts?.data?.result?.map((item: any) => (
                                <div key={item._id} className="flex items-start gap-3">
                                    {/* Image */}
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={item.image?.[0] || "/placeholder.svg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-normal text-[#171717] truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-[11px] text-[#17171766] truncate">
                                            {item.categoryId?.title}
                                            {item.subCategoryId?.title &&
                                                ` > ${item.subCategoryId.title}`}
                                        </p>
                                    </div>

                                    {/* Stock */}
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {item.inStock ? "Available" : "Out"}
                                        </p>
                                        <p
                                            className={`text-xs ${item.inStock ? "text-[#04BF7B]" : "text-red-500"
                                                }`}
                                        >
                                            {item.inStock ? "In stock" : "Out of stock"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Footer */}
                    <Link href={'/dashboard/inventory'}>
                        <Button
                            variant="link"
                            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                        >
                            View all →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
