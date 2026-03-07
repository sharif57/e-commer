
'use client'

import { OrderDetailsPage } from "@/components/dashboard/buyer/order-details-page"
import { useOrderHistoryDetailQuery } from "@/redux/feature/buyer/orderProductSlice"
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';

function OrderPage() {

    const searchParams = useSearchParams();
    const orderId = searchParams.get('id') || '';

    const { data, isLoading } = useOrderHistoryDetailQuery(orderId);
    console.log(data?.data, 'order detail data');

    // Transform API data to match OrderDetailsPage props
    const transformOrderData = () => {
        if (!data?.data) return null;

        const orderData = data.data;
        const product = orderData.productId;

        // Prefer shippingCost from order; fallback to product shipping config.
        const deliveryFee = Number(orderData.shippingCost ?? product.shippingCost ?? 0);

        const subtotal = orderData.price * orderData.quantity;
        const tax = subtotal * 0.02; // 2% tax

        // Map delivery status to timeline steps
        const statusMap: { [key: string]: number } = {
            'placed': 1,
            'preparing': 2,
            'in_transit': 3,
            'delivered': 4
        };

        const currentStatusLevel = statusMap[orderData.deliveryStatus] || 1;

        const timelineSteps = [
            { id: '1', label: 'Placed', completed: currentStatusLevel >= 1, icon: 'placed' as const },
            { id: '2', label: 'Preparing', completed: currentStatusLevel >= 2, icon: 'preparing' as const },
            { id: '3', label: 'In transit', completed: currentStatusLevel >= 3, icon: 'transit' as const },
            { id: '4', label: 'Delivered', completed: currentStatusLevel >= 4, icon: 'delivered' as const },
        ];

        return {
            orderNumber: `Order#${orderData.orderId}`,
            orderDate: new Date(orderData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            deliveryStatus: orderData.deliveryStatus,
            timelineSteps,
            items: [
                {
                    id: product._id,
                    image: product.image[0] || '',
                    title: product.title,
                    price: orderData.price,
                    quantity: orderData.quantity,
                },
            ],
            address: {
                name: `${orderData.firstName} ${orderData.lastName}`,
                street: orderData.streetName,
                city: orderData.city,
                state: orderData.state,
                zip: orderData.zip.toString(),
            },
            paymentMethod: {
                type: 'Card',
                last4: orderData.paymentStatus?.toLowerCase() === 'paid' ? 'PAID' : '----',
            },
            summary: {
                subtotal,
                deliveryFee,
                tax,
            },
            barcode: orderData.orderId,
            productDetails: {
                brand: product.brand,
                sku: product.sku,
                carrier: product.carrier,
                size: orderData.size,
                color: orderData.color,
                category: product.categoryId,
                paymentStatus: orderData.paymentStatus,
                returnPolicy: product.return,
                description: product.des,
            },
        };
    };

    const orderData = transformOrderData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Order not found</p>
            </div>
        );
    }

    return (
        <>
            <title>order details</title>
            <OrderDetailsPage {...orderData} />
        </>
    );
}

export default function Order() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <OrderPage />
        </Suspense>
    );
}