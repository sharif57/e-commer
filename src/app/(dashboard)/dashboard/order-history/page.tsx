/* eslint-disable @next/next/no-img-element */


"use client"

import { useState } from "react"
import { Search, ChevronDown, MonitorSmartphone, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Right from "@/components/icon/right"
import Track from "@/components/icon/track"
import Location from "@/components/icon/location"
import Link from "next/link"
import { useGetProductsQuery } from "@/redux/feature/seller/productSellerSlice"

interface Order {
    _id: string
    orderId: string
    deliveryStatus: "placed" | "preparing" | "in_transit" | "delivered"
    paymentStatus: string
    createdAt: string
    price: number
    quantity: number
    productId: {
        _id: string
        title: string
        brand: string
        image: string[]
    }
    userId: {
        firstName: string
        lastName: string
        email: string
    }
    color?: string
    size?: string
    firstName: string
    lastName: string
    streetName: string
    city: string
    area: string
}

export default function OrderHistory() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [notes, setNotes] = useState<Record<string, string>>({})

    const { data: ordersData } = useGetProductsQuery(undefined)
    const orders: Order[] = ordersData?.data?.result || []

    
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.productId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleNoteSubmit = (orderId: string) => {
        if (notes[orderId]) {
            console.log(`Note for ${orderId}: ${notes[orderId]}`)
            setNotes({ ...notes, [orderId]: "" })
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "placed":
                return "bg-orange-100 text-orange-700"
            case "preparing":
                return "bg-yellow-100 text-yellow-700"
            case "in_transit":
                return "bg-blue-100 text-blue-700"
            case "delivered":
                return "bg-green-100 text-green-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    const getStatusMessage = (status: string) => {
        switch (status) {
            case "placed":
                return "Order placed"
            case "preparing":
                return "Preparing order"
            case "in_transit":
                return "In transit"
            case "delivered":
                return "Delivered"
            default:
                return status
        }
    }

    const getButtonColor = (status: string) => {
        switch (status) {
            case "placed":
                return "bg-green-600 hover:bg-green-700 text-white"
            case "preparing":
                return "bg-yellow-400 hover:bg-yellow-500 text-black"
            case "in_transit":
                return "bg-blue-500 hover:bg-blue-600 text-white"
            default:
                return "bg-gray-300 hover:bg-gray-400 text-gray-800"
        }
    }

    const getTimelineSteps = (status: string) => {
        const baseSteps = [
            { label: "Placed", completed: false, current: false },
            { label: "Preparing", completed: false, current: false },
            { label: "In transit", completed: false, current: false },
            { label: "Delivered", completed: false, current: false },
        ]

        switch (status) {
            case "placed":
                baseSteps[0].completed = true
                baseSteps[0].current = true
                break
            case "preparing":
                baseSteps[0].completed = true
                baseSteps[1].completed = true
                baseSteps[1].current = true
                break
            case "in_transit":
                baseSteps[0].completed = true
                baseSteps[1].completed = true
                baseSteps[2].completed = true
                baseSteps[2].current = true
                break
            case "delivered":
                baseSteps.forEach(step => {
                    step.completed = true
                    step.current = false
                })
                break
        }
        return baseSteps
    }

    return (
        <main className="min-h-screen">
            <div className="">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Order history</h1>

                    {/* Search Bar */}
                    <div className="relative mb-6 w-1/3">
                        <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search order item"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 md:gap-4">
                        <Button
                            onClick={() => setFilterType("all")}
                            className={`${filterType === "all"
                                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                                } px-4 py-2 rounded-full font-medium transition-colors`}
                        >
                            All
                        </Button>
                        <Button
                            onClick={() => setStatusFilter(statusFilter === "all" ? "pending" : "all")}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors"
                        >
                            By dates <ChevronDown className="h-4 w-4" />
                        </Button>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-full font-medium transition-colors"
                        >
                            <option value="all">All Status</option>
                            <option value="placed">Placed</option>
                            <option value="preparing">Preparing</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.length === 0 ? (
                        <Card className="p-8 text-center text-gray-500 ">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No orders found</p>
                        </Card>
                    ) : (
                        filteredOrders.map((order) => {
                            const timelineSteps = getTimelineSteps(order.deliveryStatus)
                            return (
                                <Card
                                    key={order._id}
                                    className="p-4 md:p-6   transition-shadow"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-[#1717170F] p-2 rounded-full">
                                                <MonitorSmartphone className="h-5 w-5 text-[#171717]" />
                                            </div>
                                            <div>
                                                <p
                                                    className={`text-[11px] font-medium ${getStatusColor(order.deliveryStatus)} px-2 py-1 rounded inline-block`}
                                                >
                                                    {getStatusMessage(order.deliveryStatus)}
                                                </p>
                                                <p className="text-xl font-semibold text-[#171717] mt-1">
                                                    Order #{order.orderId} on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>


                                        </div>
                                        <div className="flex flex-col sm:flex-col gap-2">
                                            <Button
                                                className={`${getButtonColor(order.deliveryStatus)} px-4 py-2 rounded-lg font-medium text-sm transition-colors`}
                                            >
                                                {order.deliveryStatus === "placed"
                                                    ? "Process order"
                                                    : order.deliveryStatus === "preparing"
                                                        ? "Update status"
                                                        : "View details"}
                                            </Button>
                                            <Link href={`/dashboard/order-history/${order._id}`}>
                                                <Button className="bg-white hover:bg-gray-50 text-[#171717] border-2 border-[#171717] px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                                                    View details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>



                                    {/* <OrderTimeline steps={timelineSteps} /> */}

                                    <div className="">

                                        {/* Horizontal timeline (Desktop & Tablet) */}
                                        <div className="hidden sm:flex items-center justify-between relative">

                                            {/* Dotted Line Background */}
                                            <div className="absolute left-10 right-10 top-10 h-0.5 border-t-2 border-dashed border-gray-300" />

                                            {timelineSteps.map((step, index) => (
                                                <div key={index} className="relative flex flex-col items-center z-10">

                                                    {/* ICON CIRCLE */}
                                                    <div
                                                        className={`
                                        w-20 h-20 rounded-full flex items-center justify-center 
                                        transition-all
                                    `}
                                                    >
                                                        {step.completed ? (
                                                            <Right />
                                                        ) : step.current ? (
                                                            <Track />
                                                        ) : (
                                                            <Location />
                                                        )}
                                                    </div>

                                                    {/* LABEL */}
                                                    <p
                                                        className={`
                                         text-sm font-medium whitespace-nowrap
                                        ${step.completed || step.current ? "text-gray-900" : "text-gray-500"}
                                    `}
                                                    >
                                                        {step.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                    {/* Additional Message */}
                                    {order.paymentStatus === "pending" && order.deliveryStatus === "preparing" && (
                                        <p className="text-sm text-gray-600 mb-4">We&lsquo;re preparing your order...</p>
                                    )}

                                    {/* Product Info */}
                                    <div className="mb-4 flex gap-4">
                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                            <img
                                                src={order.productId.image[0] || "/images/products.jpg"}
                                                alt={order.productId.title}
                                                className="w-full h-full object-cover rounded-lg border border-border"
                                            />
                                            <div className="absolute -top-2 -right-2 bg-white text-black border-2 size-[20px] rounded-full flex items-center justify-center font-semibold text-sm">
                                                {order.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-[#171717]">{order.productId.title}</p>
                                            <p className="text-sm text-gray-600">{order.productId.brand}</p>
                                            {order.color && <p className="text-xs text-gray-500">Color: {order.color}</p>}
                                            {order.size && <p className="text-xs text-gray-500">Size: {order.size}</p>}
                                            <p className="text-sm font-medium text-[#171717] mt-2">Buyer: {order.firstName} {order.lastName}</p>
                                            <p className="text-xs text-gray-500">{order.streetName}, {order.area}, {order.city}</p>
                                            <p className="text-[13px] font-medium text-[#171717] mt-2">Order total ${(order.price * order.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Note Section */}
                                    {/* <div className=" pt-4 mt-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Write a note for buyer"
                                                value={notes[order._id] || ""}
                                                onChange={(e) => setNotes({ ...notes, [order._id]: e.target.value })}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <Button
                                                onClick={() => handleNoteSubmit(order._id)}
                                                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div> */}
                                </Card>
                            )
                        })
                    )}
                </div>
            </div>
        </main>
    )
}
