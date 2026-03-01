
'use client'

import { OrderTimeline } from './order-timeline'
import { OrderItem } from './order-item'
import Breadcrumb from '@/components/Breadcrumb'
import Barcode from './Barcode'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'


interface OrderDetailsPageProps {
    orderNumber: string
    orderDate: string
    deliveryStatus?: string
    timelineSteps: Array<{
        id: string
        label: string
        completed: boolean
        icon: 'placed' | 'preparing' | 'transit' | 'delivered'
    }>
    items: Array<{
        id: string
        image: string
        title: string
        price: number
        quantity: number
    }>
    address: {
        name: string
        street: string
        city: string
        state: string
        zip: string
    }
    paymentMethod: {
        type: string
        last4: string
    }
    summary: {
        subtotal: number
        deliveryFee: number
        tax: number
    }
    barcode: string
}

export function OrderDetailsPage({
    orderNumber,
    orderDate,
    deliveryStatus,
    timelineSteps,
    items,
    address,
    paymentMethod,
    summary,
    barcode,
}: OrderDetailsPageProps) {
    const total = summary.subtotal

    return (
        <main className="">
            <Breadcrumb items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Purchase history", href: "/dashboard" },
                { label: "Order Details" }
            ]} />
            {/* Header */}
            <div className=" ">
                <div className="  py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center   gap-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#000000]">
                            {orderDate} order
                        </h1>
                        <p className="text-sm sm:text-2xl text-[#171717B2]  font-normal ">
                            {orderNumber}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className=" ">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">


                    {/* Left Column - Timeline and Items */}
                    <div className="lg:col-span-2 space-y-6 border border-border rounded-lg bg-card">

                        {/* Timeline */}
                        <OrderTimeline steps={timelineSteps} deliveryStatus={deliveryStatus} />

                        {/* Items */}
                        <div className="bg-card rounded-lg p-4 sm:p-6">
                            <h3 className="text-sm font-semibold     text-[#171717] mb-4">
                                {items.length} items
                            </h3>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <OrderItem
                                        key={item.id}
                                        image={item.image}
                                        title={item.title}
                                        price={item.price}
                                        quantity={item.quantity}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Address, Payment, and Summary */}
                    <div className="space-y-6 border rounded-lg">
                        {/* Delivery Address */}
                        <div className="bg-card rounded-lg p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="secondary" className='text-[#1877F2]'>Delivery</Badge>
                            </div>
                            <div className="flex flex-col gap-1 sm:gap-2">
                                <p className="font-semibold text-foreground text-sm sm:text-xl">
                                    {/* {address.name} */}Address

                                </p>

                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {address.name}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {address.street}
                                </p>

                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {address.city}, {address.state} {address.zip}
                                </p>
                            </div>

                        </div>

                        {/* Payment Method */}
                        <div className="bg-card rounded-lg p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-xl font-semibold text-foreground">
                                    Payment method
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <Card /> */<Image src="/images/Mastercard.png" alt="Card Icon" className="w-10 h-6" width={800} height={600} />}
                                <p className="text-sm font-semibold text-[#171717]">
                                    Ending in {paymentMethod.last4}
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-card rounded-lg p-4 sm:p-6 space-y-4">
                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-foreground">
                                    Subtotal
                                </h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Item</span>
                                    <span className="text-foreground font-medium">
                                        ${summary.subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery fee</span>
                                    <span className="text-foreground font-medium">
                                        {/* ${summary.deliveryFee.toFixed(2)} */}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="text-foreground font-medium">
                                        {/* ${summary.tax.toFixed(2)} */}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between">
                                    <span className="text-2xl font-semibold text-foreground">Total</span>
                                    <span className="text-2xl font-semibold text-foreground">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Barcode */}
                        {barcode && (
                            <div className="bg-card rounded-lg p-4 sm:p-6 flex flex-col items-center">
                                <div className="text-center">
                                    <Barcode />
                                    <p className="text-sm text-muted-foreground">
                                        Order#{barcode}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
