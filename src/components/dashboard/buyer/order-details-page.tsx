
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
    productDetails?: {
        brand?: string
        sku?: string
        carrier?: string
        size?: string
        color?: string
        category?: string
        paymentStatus?: string
        returnPolicy?: string
        description?: string
    }
}

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')

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
    productDetails,
}: OrderDetailsPageProps) {
    const total = summary.subtotal + summary.deliveryFee + summary.tax

    const handleDownloadReceipt = () => {
        if (typeof window === 'undefined') return

        const itemsRows = items
            .map(
                (item) => `
                                        <tr>
                                                <td>${escapeHtml(item.title)}</td>
                                                <td>${item.quantity}</td>
                                                <td>${formatCurrency(item.price)}</td>
                                                <td>${formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                `,
            )
            .join('')

        const receiptHtml = `<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice ${escapeHtml(orderNumber)}</title>
        <style>
            :root {
                --bg: #f5f8ff;
                --card: #ffffff;
                --ink: #171717;
                --muted: #6b7280;
                --primary: #0f5bd7;
                --line: #e5e7eb;
            }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                padding: 28px;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                background: radial-gradient(circle at top right, #eef4ff, #f7f9fd 42%, #ffffff 100%);
                color: var(--ink);
            }
            .invoice {
                max-inline-size: 920px;
                margin: 0 auto;
                background: var(--card);
                border: 1px solid var(--line);
                border-radius: 16px;
                overflow: hidden;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 28px;
                background: linear-gradient(120deg, #edf3ff 0%, #f7fbff 50%, #ffffff 100%);
                border-block-end: 1px solid var(--line);
            }
            .title {
                margin: 0;
                font-size: 28px;
                line-height: 1;
            }
            .chip {
                padding: 8px 12px;
                border-radius: 999px;
                background: #dbeafe;
                color: var(--primary);
                font-weight: 600;
                font-size: 12px;
            }
            .meta {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
                padding: 24px 28px;
                border-block-end: 1px solid var(--line);
            }
            .box {
                padding: 16px;
                border: 1px solid var(--line);
                border-radius: 12px;
                background: #fbfdff;
            }
            .label {
                display: block;
                margin-block-end: 6px;
                color: var(--muted);
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.04em;
            }
            .value {
                font-size: 14px;
                font-weight: 600;
            }
            table {
                inline-size: calc(100% - 56px);
                margin: 24px 28px;
                border-collapse: collapse;
            }
            th, td {
                text-align: start;
                padding: 12px;
                border-block-end: 1px solid var(--line);
                font-size: 14px;
            }
            th {
                background: #f9fafb;
                color: #374151;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.04em;
            }
            .totals {
                margin: 0 28px 28px;
                display: flex;
                justify-content: flex-end;
            }
            .totals-card {
                min-inline-size: 320px;
                border: 1px solid var(--line);
                border-radius: 12px;
                padding: 16px;
            }
            .row {
                display: flex;
                justify-content: space-between;
                margin-block-end: 8px;
                font-size: 14px;
            }
            .row.total {
                margin-block-start: 12px;
                padding-block-start: 12px;
                border-block-start: 1px solid var(--line);
                font-size: 18px;
                font-weight: 700;
            }
            .footer {
                padding: 20px 28px 24px;
                color: var(--muted);
                font-size: 12px;
                text-align: center;
            }
            @media (max-inline-size: 760px) {
                body { padding: 14px; }
                .header { flex-direction: column; gap: 10px; align-items: flex-start; }
                .meta { grid-template-columns: 1fr; }
                table { inline-size: calc(100% - 24px); margin: 12px; }
                .totals { margin: 0 12px 14px; }
                .totals-card { min-inline-size: 100%; }
            }
        </style>
    </head>
    <body>
        <section class="invoice">
            <header class="header">
                <div>
                    <h1 class="title">Invoice</h1>
                    <div class="value">Order #${escapeHtml(orderNumber)}</div>
                </div>
                <span class="chip">${escapeHtml(deliveryStatus || 'Processing')}</span>
            </header>

            <div class="meta">
                <div class="box">
                    <span class="label">Order Date</span>
                    <div class="value">${escapeHtml(orderDate)}</div>
                </div>
                <div class="box">
                    <span class="label">Payment</span>
                    <div class="value">${escapeHtml(paymentMethod.type)} ending in ${escapeHtml(paymentMethod.last4)}</div>
                </div>
                <div class="box">
                    <span class="label">Billing / Delivery</span>
                    <div class="value">${escapeHtml(address.name)}</div>
                    <div>${escapeHtml(address.street)}</div>
                    <div>${escapeHtml(address.city)}, ${escapeHtml(address.state)} ${escapeHtml(address.zip)}</div>
                </div>
                <div class="box">
                    <span class="label">Barcode Ref</span>
                    <div class="value">${escapeHtml(barcode || 'N/A')}</div>
                </div>
                <div class="box">
                    <span class="label">Product Info</span>
                    <div><strong>Brand:</strong> ${escapeHtml(productDetails?.brand || 'N/A')}</div>
                    <div><strong>SKU:</strong> ${escapeHtml(productDetails?.sku || 'N/A')}</div>
                    <div><strong>Size:</strong> ${escapeHtml(productDetails?.size || 'N/A')}</div>
                    <div><strong>Color:</strong> ${escapeHtml(productDetails?.color || 'N/A')}</div>
                </div>
                <div class="box">
                    <span class="label">Fulfillment</span>
                    <div><strong>Carrier:</strong> ${escapeHtml(productDetails?.carrier || 'N/A')}</div>
                    <div><strong>Payment:</strong> ${escapeHtml(productDetails?.paymentStatus || 'N/A')}</div>
                    <div><strong>Return:</strong> ${escapeHtml(productDetails?.returnPolicy || 'N/A')}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
            </table>

            <div class="totals">
                <div class="totals-card">
                    <div class="row"><span>Subtotal</span><span>${formatCurrency(summary.subtotal)}</span></div>
                    <div class="row"><span>Delivery Fee</span><span>${formatCurrency(summary.deliveryFee)}</span></div>
                    <div class="row"><span>Tax</span><span>${formatCurrency(summary.tax)}</span></div>
                    <div class="row total"><span>Total</span><span>${formatCurrency(total)}</span></div>
                </div>
            </div>

            <div class="footer">
                Thank you for shopping with us. Keep this invoice for your records.
            </div>
        </section>
    </body>
</html>`

        const file = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = `invoice-${orderNumber}.html`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    }

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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#000000]">
                                {orderDate} order
                            </h1>
                            <p className="text-sm sm:text-2xl text-[#171717B2] font-normal">
                                {orderNumber}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleDownloadReceipt}
                            className="inline-flex items-center justify-center rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1667d1]"
                        >
                            Download Receipt
                        </button>
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

                        {/* Product Details */}
                        {/* <div className="bg-card rounded-lg p-4 sm:p-6">
                            <h3 className="text-xl font-semibold text-foreground mb-4">
                                Product details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Brand: <span className="text-[#171717] font-medium">{productDetails?.brand || 'N/A'}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    SKU: <span className="text-[#171717] font-medium">{productDetails?.sku || 'N/A'}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Size: <span className="text-[#171717] font-medium">{productDetails?.size || 'N/A'}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Color: <span className="text-[#171717] font-medium">{productDetails?.color || 'N/A'}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Carrier: <span className="text-[#171717] font-medium">{productDetails?.carrier || 'N/A'}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Payment: <span className="text-[#171717] font-medium capitalize">{productDetails?.paymentStatus || 'N/A'}</span>
                                </p>
                            </div>
                            {productDetails?.returnPolicy && (
                                <p className="text-sm text-muted-foreground mt-3">
                                    Return policy: <span className="text-[#171717] font-medium">{productDetails.returnPolicy}</span>
                                </p>
                            )}
                            {productDetails?.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                    {productDetails.description}
                                </p>
                            )}
                        </div> */}

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
                                        {formatCurrency(summary.deliveryFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="text-foreground font-medium">
                                        {formatCurrency(summary.tax)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between">
                                    <span className="text-2xl font-semibold text-foreground">Total</span>
                                    <span className="text-2xl font-semibold text-foreground">
                                        {formatCurrency(total)}
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
