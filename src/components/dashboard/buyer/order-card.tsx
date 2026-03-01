/* eslint-disable @next/next/no-img-element */
'use client'

import { Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type OrderCardProps = {
    status: 'in-progress' | 'delivered' | 'canceled'
    deliveryDate: string
    productImage: string
    productQuantity: number
    orderTotal: number
    id: string | number
}

export function OrderCard({ status, deliveryDate, productImage, productQuantity, orderTotal, id }: OrderCardProps) {
    const statusConfig = {
        'in-progress': { label: 'In Progress', color: 'text-yellow-500' },
        'delivered': { label: 'Delivered', color: 'text-green-600' },
        'canceled': { label: 'Canceled', color: 'text-red-500' },
    }

    const config = statusConfig[status]

    return (
        <div className=" p-4 sm:p-6 mb-4 cursor-pointer  transition-shadow">
            {/* Header with status and view details link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0  bg-[#1717170F] p-2 rounded-full">
                        <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs sm:text-xs text-[#171717B2] font-medium">Delivery from shop</p>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#171717] text-balance">
                            {config.label} on {deliveryDate}
                        </h3>
                    </div>
                </div>

                {/* View details link - responsive */}
                <Link href={`/dashboard/history?id=${id}`} className="flex items-center gap-2 px-3 py-2 border border-[#171717] rounded-full bg-[#f1f1f1] text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap">
                    View details
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Product and total section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
                {/* Product image with quantity badge */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                        src={productImage || "/placeholder.svg"}
                        alt="Product"
                        className="w-full h-full object-cover rounded-lg border border-border"
                    />
                    <div className="absolute -top-2 -right-2 bg-white text-black border-2 size-[20px] rounded-full flex items-center justify-center font-semibold text-sm">
                        {productQuantity}
                    </div>
                </div>

                <div className="flex-1 sm:flex-none text-right">
                    <p className="text-xs sm:text-sm text-[#171717] font-medium">Order total ${orderTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}
