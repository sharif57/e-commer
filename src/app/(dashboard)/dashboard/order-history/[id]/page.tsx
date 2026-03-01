/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Barcode from '@/components/dashboard/buyer/Barcode'
import { OrderItem } from '@/components/dashboard/buyer/order-item'
import { OrderTimeline } from '@/components/dashboard/buyer/order-timeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetSingleProductSellerQuery, useOrderConfirmationMutation } from '@/redux/feature/seller/productSellerSlice'
import { Printer, Download } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'
import Logo from '@/components/icon/logo'

export default function OrderDetailsPage() {
    const params = useParams();
    const { id } = params;
    const invoiceRef = useRef<HTMLDivElement>(null);

    const statusOptions = [
        { value: 'placed', label: 'Placed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'in_transit', label: 'In transit' },
        { value: 'delivered', label: 'Delivered' },
    ]

    const { data } = useGetSingleProductSellerQuery(id as string);
    const orderData = data?.data;
    const [orderConfirmation, { isLoading: isUpdatingStatus }] = useOrderConfirmationMutation();
    const [selectedStatus, setSelectedStatus] = useState<string>('placed')
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [statusError, setStatusError] = useState<string | null>(null)


    // Initialize socket on mount
    useEffect(() => {
        const socket = getSocket();

        if (socket) {
            // Listen for incoming messages
            socket.on('message-received', (data: any) => {
                console.log('New message received:', data);
                toast.success('New message received');
            });

            return () => {
                socket.off('message-received');
            };
        }
    }, []);


    useEffect(() => {
        if (orderData?.deliveryStatus) {
            setSelectedStatus(orderData.deliveryStatus)
        }
    }, [orderData?.deliveryStatus])

    if (!orderData) {
        return <div className="flex items-center justify-center min-h-screen">Loading order details...</div>
    }

    // Helper function to get timeline steps based on deliveryStatus
    const getTimelineSteps = (status: string) => {
        const steps = [
            { id: "1", label: "Order placed", completed: false, icon: "placed" as const },
            { id: "2", label: "Preparing", completed: false, icon: "preparing" as const },
            { id: "3", label: "In transit", completed: false, icon: "transit" as const },
            { id: "4", label: "Delivered", completed: false, icon: "delivered" as const },
        ]

        switch (status) {
            case "placed":
                steps[0].completed = true
                break
            case "preparing":
                steps[0].completed = true
                steps[1].completed = true
                break
            case "in_transit":
                steps[0].completed = true
                steps[1].completed = true
                steps[2].completed = true
                break
            case "delivered":
                steps.forEach(step => step.completed = true)
                break
        }
        return steps
    }

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }



    const handleStatusUpdate = async () => {
        if (!id) return

        setStatusMessage(null)
        setStatusError(null)

        try {
            const res = await orderConfirmation({
                orderId: id as string,
                data: { deliveryStatus: selectedStatus }
            }).unwrap()
            toast.success(res?.data?.message || 'Delivery status updated successfully')
            setStatusMessage(res?.data?.message || 'Delivery status updated')
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update delivery status')
            setStatusError(error?.data?.message || 'Failed to update delivery status')
        }
    }

    // Calculate totals
    const subtotal = orderData.price * orderData.quantity
    const deliveryFee = parseInt(orderData.productId.deliveryChargeInDc) || 0
    const tax = Math.round(subtotal * 0.05)
    const total = subtotal + deliveryFee + tax

    const currentDeliveryStatus = selectedStatus || orderData.deliveryStatus
    const timelineSteps = getTimelineSteps(currentDeliveryStatus)
    const orderDate = formatDate(orderData.createdAt)

    return (
        <main>
            <div className="py-4 sm:py-6 flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <h1 className="text-xl sm:text-2xl font-bold">{orderDate} order</h1>
                    <p className="text-sm sm:text-2xl text-muted-foreground">{orderData.orderId}</p>
                </div>
                <div className='flex items-center gap-4'>

                    {/* <button
                        onClick={handleDownloadPDF}
                        className='flex items-center gap-2 cursor-pointer hover:text-blue-600 transition'
                    >
                        <Download className='size-5' />
                        <p className='text-[#1877F2] hover:underline'>PDF</p>
                    </button> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6 border border-border rounded-lg bg-card">

                    {/* Timeline */}
                    <OrderTimeline steps={timelineSteps} deliveryStatus={currentDeliveryStatus} />

                    {/* Items */}
                    <div className="bg-card rounded-lg p-4 sm:p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-4">
                            1 item
                        </h3>
                        <div className="space-y-4">
                            <div className='flex items-center justify-between'>
                                <OrderItem
                                    image={orderData.productId.image[0] || "/images/products.jpg"}
                                    title={orderData.productId.title}
                                    price={orderData.productId.price}
                                    quantity={orderData.quantity}
                                />
                                {/* <Button
                                    onClick={handleOpenChat}
                                    disabled={isChatLoading}
                                    className='flex items-center gap-2 bg-[#1877F2] hover:bg-blue-600 text-white px-4 py-2 rounded-lg'
                                >
                                    <MessageCircle className='h-4 w-4' />
                                    {isChatLoading ? 'Opening...' : 'Chat'}
                                </Button> */}
                            </div>
                            <div className="pt-4 flex flex-col gap-4">

                                {/* Update Status Button */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                    <select
                                        value={currentDeliveryStatus}
                                        onChange={(event) => setSelectedStatus(event.target.value)}
                                        className="w-full bg-[#F1F1F1] pr-24 px-4 py-2 border border-[#000000] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        disabled={isUpdatingStatus}
                                        className="bg-[#F2CB05] text-[#171717] hover:bg-[#F2CB05]/90 shrink-0"
                                    >
                                        {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </div>
                                {statusMessage && (
                                    <p className="text-xs text-green-600">{statusMessage}</p>
                                )}
                                {statusError && (
                                    <p className="text-xs text-red-600">{statusError}</p>
                                )}
                            </div>


                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 border rounded-lg">

                    {/* Address */}
                    <div className="bg-card rounded-lg p-4 sm:p-6">
                        <Badge variant="secondary" className="text-[#1877F2]">Delivery</Badge>

                        <div className="flex flex-col gap-1 mt-3">
                            <p className="font-semibold text-xl">Address</p>
                            <p className="text-sm text-muted-foreground">{orderData.firstName} {orderData.lastName}</p>
                            <p className="text-sm text-muted-foreground">{orderData.streetName}</p>
                            <p className="text-sm text-muted-foreground">
                                {orderData.area}, {orderData.city}, {orderData.state} {orderData.zip}
                            </p>
                            <p className="text-sm text-muted-foreground">{orderData.country}</p>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-card rounded-lg p-4 sm:p-6">
                        <h3 className="text-xl font-semibold mb-4">Payment method</h3>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Status: <span className={`${orderData.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'} font-bold`}>{orderData.paymentStatus.toUpperCase()}</span></p>
                            <p className="text-sm">Total Amount: <span className="font-bold">${(orderData.price * orderData.quantity / 100).toFixed(2)}</span></p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-card rounded-lg p-4 sm:p-6 space-y-4">
                        <div className="space-y-3">
                            <h3 className="text-xl font-semibold">Summary</h3>

                            <div className="flex justify-between text-sm">
                                <span>Item ({orderData.quantity}x)</span>
                                <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Delivery fee ({orderData.productId.carrier})</span>
                                <span className="font-medium">${(deliveryFee / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax</span>
                                <span className="font-medium">${(tax / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-2xl font-semibold">Total</span>
                                <span className="text-2xl font-semibold">${(total / 100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Barcode */}
                    {orderData.orderId && (
                        <div className="bg-card rounded-lg p-4 sm:p-6 flex flex-col items-center">
                            <Barcode />
                            <p className="text-sm text-muted-foreground mt-2">
                                Order#{orderData.orderId}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Invoice Template for PDF Generation */}
            <div
                ref={invoiceRef}
                style={{
                    position: 'fixed',
                    left: '-9999px',
                    top: 0,
                    width: '800px',
                    background: 'white',
                    color: '#111827',
                    padding: '32px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Logo />
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700 }}>Invoice</div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>Order #{orderData.orderId}</div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{orderDate}</div>
                    </div>
                </div>

                <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Billed To</div>
                        <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
                            {orderData.firstName} {orderData.lastName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4B5563' }}>{orderData.streetName}</div>
                        <div style={{ fontSize: '12px', color: '#4B5563' }}>
                            {orderData.area}, {orderData.city}, {orderData.state} {orderData.zip}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4B5563' }}>{orderData.country}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Payment</div>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#4B5563' }}>
                            Status: {orderData.paymentStatus}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4B5563' }}>
                            Delivery: {orderData.deliveryStatus}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', fontSize: '12px', color: '#6B7280' }}>
                                <th style={{ paddingBottom: '8px' }}>Product</th>
                                <th style={{ paddingBottom: '8px' }}>SKU</th>
                                <th style={{ paddingBottom: '8px' }}>Qty</th>
                                <th style={{ paddingBottom: '8px' }}>Price</th>
                                <th style={{ paddingBottom: '8px', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ fontSize: '12px', color: '#111827' }}>
                                <td style={{ padding: '8px 0' }}>{orderData.productId.title}</td>
                                <td style={{ padding: '8px 0' }}>{orderData.productId.sku || '-'}</td>
                                <td style={{ padding: '8px 0' }}>{orderData.quantity}</td>
                                <td style={{ padding: '8px 0' }}>${(orderData.price / 100).toFixed(2)}</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>${(subtotal / 100).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '260px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#6B7280' }}>Subtotal</span>
                            <span>${(subtotal / 100).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#6B7280' }}>Delivery fee</span>
                            <span>${(deliveryFee / 100).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: '#6B7280' }}>Tax</span>
                            <span>${(tax / 100).toFixed(2)}</span>
                        </div>
                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>Total</span>
                            <span>${(total / 100).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '32px', fontSize: '11px', color: '#6B7280' }}>
                    Thanks for your purchase. If you have any questions, contact support.
                </div>
            </div>
        </main>
    )
}
