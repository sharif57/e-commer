/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Package, Star, Handbag, PackageSearch, AudioWaveform, ChartNoAxesCombined, Zap, ChartLine, TruckElectric } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import SalesReport from "@/components/seller/sales-report"
import { useAccountHealthRatioQuery, useAccountMsgResponseQuery, useAllReviewAndRatingRatioQuery, useOnTimeDeliveryRatioQuery, useSellerWalletDataQuery, useTodaySalesQuery, useTotalPendingOrdersQuery } from "@/redux/feature/seller/accountSetting"
import { useGetRecentMessageQuery } from "@/redux/feature/seller/message"
import MessageSkeleton from "@/components/Skeleton/MessageSkeleton"
import Link from "next/link"
import { useGetSellerProductsQuery } from "@/redux/feature/seller/productSellerSlice"
import InventorySkeleton from "@/components/Skeleton/InventorySkeleton"

export default function DashboardOverview() {
    const [timeRange, setTimeRange] = useState("total balance")
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
    console.log(msg, 'msg========')
    const { data: sellerWalletData } = useSellerWalletDataQuery(timeRange);
    const { data: pendingOrdersData } = useTotalPendingOrdersQuery(undefined);
    const { data: todaySalesData } = useTodaySalesQuery(undefined);

    console.log(pendingOrdersData, '======pending orders==')
    console.log(todaySalesData, '======today sales==')

    const stats = [
        {
            icon: ChartLine,
            label: "Sales",
            value: `$${sellerWalletData?.data?.totalAmount || 0}`,
            badge: 'today',
            badgeColor: "text-gray-400",
        },
        {
            icon: TruckElectric,
            label: "Open Orders",
            value: `1`,
            badge: "Total Count",
            badgeColor: "text-gray-400",
            status: "1 Unshipped",
        },
        {
            icon: Package,
            label: "Payments",
            value: `$${sellerWalletData?.data?.totalAmount || 0}`,
            badge: 'total balance',
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
    console.log(sellerProducts, 'seller product========')


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
                {/* <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 rounded-xl overflow-hidden">
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
                                <div className="flex items-center justify-between">
                                    {
                                        stat.status && (
                                            <p className="text-xs font-medium text-gray-400">Status</p>
                                        )
                                    }
                                    {stat.status && (
                                        <p className={`text-xs font-medium ${stat.status === 'Excellent' ? 'text-green-400' : stat.status === 'Good' ? 'text-yellow-400' : 'text-[#1877F2]'}`}>
                                            {stat.status}
                                        </p>
                                    )}

                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performing Products */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-full">
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

                    <div className="flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            {!performingProducts || performingProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                                    <Zap className="w-10 h-10 mb-3 text-gray-300" />
                                    <p className="text-sm font-medium text-gray-900">No products found</p>
                                    <p className="text-xs text-gray-500">There are no performing products to show.</p>
                                </div>
                            ) : (
                                performingProducts.map((product) => (
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
                                ))
                            )}
                        </div>

                        {performingProducts && performingProducts.length > 0 && (
                            <div className="flex flex-col items-start justify-start mt-auto">
                                <Button
                                    variant="link"
                                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 px-0"
                                >
                                    View all 21 items →
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sales Report */}
                <SalesReport />
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-full">
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

                    <div className="flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <MessageSkeleton key={index} />
                                ))
                            ) : !msg?.data?.result || msg?.data?.result?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                                    <svg className="w-10 h-10 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">No recent messages</p>
                                    <p className="text-xs text-gray-500">You don't have any unread messages.</p>
                                </div>
                            ) : (
                                msg?.data?.result?.map((item: any) => (
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
                                ))
                            )}
                        </div>

                        {msg?.data?.result && msg?.data?.result?.length > 0 && (
                            <Link href={'/dashboard/message'} className="mt-auto flex flex-col items-start justify-start">
                                <Button
                                    variant="link"
                                    className="px-0 mt-4 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View all messages →
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Inventory */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-full">
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
                    <div className="flex-1 flex flex-col">
                        <div className="space-y-4 flex-1">
                            {sellerProductsLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <InventorySkeleton key={i} />
                                ))
                            ) : !sellerProducts?.data?.result || sellerProducts?.data?.result?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                                    <Package className="w-10 h-10 mb-3 text-gray-300" />
                                    <p className="text-sm font-medium text-gray-900">No inventory found</p>
                                    <p className="text-xs text-gray-500">There are no items matching your filter.</p>
                                </div>
                            ) : (
                                sellerProducts?.data?.result?.map((item: any) => (
                                    <Link href={`/best_deal/${item?._id}`} key={item._id} className="flex items-start gap-3">
                                        {/* Image */}
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={item?.variants?.[0]?.images?.[0] || item.image?.[0] || "/placeholder.svg"}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#171717] truncate">
                                                {item.title}
                                            </p>
                                            <p className="text-[11px] text-[#17171766] truncate">
                                                {item.categoryId?.title}
                                                {item.subCategoryId?.title &&
                                                    ` > ${item.subCategoryId.title}`}
                                            </p>
                                        </div>

                                        {/* Stock */}
                                        <div className="text-right flex-shrink-0">
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
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {sellerProducts?.data?.result && sellerProducts?.data?.result?.length > 0 && (
                            <Link href={'/dashboard/inventory'} className="mt-auto flex flex-col items-start justify-start">
                                <Button
                                    variant="link"
                                    className="px-0 mt-4 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View all →
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
