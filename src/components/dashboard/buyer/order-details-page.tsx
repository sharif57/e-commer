'use client'

import { useMemo, useState } from 'react'
import { OrderTimeline } from './order-timeline'
import { OrderItem } from './order-item'
import Breadcrumb from '@/components/Breadcrumb'
import Barcode from './Barcode'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { buildReturnPayload, validateReturnPayload } from '@/lib/returnRequest'
import { useCreateReturnProductMutation } from '@/redux/feature/buyer/returnSlice'
import { Copy, Minus, Plus, Printer, X } from 'lucide-react'
import { toast } from 'sonner'

interface OrderDetailsPageProps {
    orderId?: string
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

type ReturnStep = 1 | 2 | 3

const ISSUE_REASON_OPTIONS = [
    'The product was broken',
    'Incorrect item received',
    'Missing parts or accessories',
    'Product not as described',
    'No longer needed',
]

const CONDITION_OPTIONS = [
    'Opened but unused',
    'Used - like new',
    'Used - good',
    'Damaged',
]

const CARRIER_OPTIONS = ['FedEx', 'DHL', 'UPS', 'USPS']
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

const escapeHtml = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')

export function OrderDetailsPage({
    orderId,
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

    const [isReturnDrawerOpen, setIsReturnDrawerOpen] = useState(false)
    const [returnStep, setReturnStep] = useState<ReturnStep>(1)
    const [stepThreeView, setStepThreeView] = useState<'method' | 'review'>('method')
    const [selectedItemMap, setSelectedItemMap] = useState<Record<string, boolean>>({})
    const [returnQtyMap, setReturnQtyMap] = useState<Record<string, number>>({})
    const [issueReason, setIssueReason] = useState('')
    const [resolutionType, setResolutionType] = useState<'refund' | 'replacement'>('refund')
    const [itemCondition, setItemCondition] = useState('')
    const [comment, setComment] = useState('')
    const [returnMethod, setReturnMethod] = useState<'seller'>('seller')
    const [carrier, setCarrier] = useState('FedEx')
    const [trackingNumber, setTrackingNumber] = useState('DTN8765432109')
    const [createReturnProduct, { isLoading: isSubmittingReturn }] = useCreateReturnProductMutation()

    const selectedReturnItems = useMemo(
        () => items.filter((item) => selectedItemMap[item.id]),
        [items, selectedItemMap],
    )

    const activeReturnItem = selectedReturnItems[0] || items[0]
    const canContinueStepOne = selectedReturnItems.length > 0
    const canContinueStepTwo =
        issueReason.trim().length > 0 && itemCondition.trim().length > 0 && comment.trim().length > 0
    const canSubmitReview =
        carrier.trim().length > 0 &&
        trackingNumber.trim().length > 0 &&
        itemCondition.trim().length > 0 &&
        comment.trim().length > 0

    const initializeReturnState = () => {
        const quantityDefaults = Object.fromEntries(items.map((item) => [item.id, 1])) as Record<string, number>
        setSelectedItemMap({})
        setReturnQtyMap(quantityDefaults)
        setIssueReason('')
        setResolutionType('refund')
        setItemCondition('')
        setComment('')
        setReturnStep(1)
        setStepThreeView('method')
        setReturnMethod('seller')
        setCarrier('FedEx')
        setTrackingNumber('DTN8765432109')
    }

    const handleOpenReturnDrawer = () => {
        initializeReturnState()
        setIsReturnDrawerOpen(true)
    }

    const handleDrawerOpenChange = (open: boolean) => {
        setIsReturnDrawerOpen(open)
        if (!open) {
            initializeReturnState()
        }
    }

    const toggleItemSelection = (itemId: string, checked: boolean) => {
        setSelectedItemMap((previous) => ({
            ...previous,
            [itemId]: checked,
        }))
    }

    const updateReturnQuantity = (itemId: string, maxQuantity: number, action: 'increase' | 'decrease') => {
        setReturnQtyMap((previous) => {
            const current = previous[itemId] ?? 1
            const nextValue = action === 'increase' ? Math.min(maxQuantity, current + 1) : Math.max(1, current - 1)
            return {
                ...previous,
                [itemId]: nextValue,
            }
        })
    }

    const handleContinue = async () => {
        if (returnStep === 1 && canContinueStepOne) {
            setReturnStep(2)
            return
        }

        if (returnStep === 2 && canContinueStepTwo) {
            setReturnStep(3)
            setStepThreeView('method')
            return
        }

        if (returnStep === 3 && stepThreeView === 'method') {
            setStepThreeView('review')
            return
        }

        if (returnStep === 3 && stepThreeView === 'review' && canSubmitReview) {
            if (!activeReturnItem) {
                toast.error('No return item selected.')
                return
            }

            const normalizedOrderId = (orderId || '').trim()
            if (!OBJECT_ID_REGEX.test(normalizedOrderId)) {
                toast.error('Invalid order id. Please open this order from order history and try again.')
                return
            }

            const payload = buildReturnPayload({
                orderId: normalizedOrderId,
                reason: issueReason,
                resolutionType,
                condition: itemCondition,
                comment,
                carrier,
                trackingNumber,
                quantity: returnQtyMap[activeReturnItem.id] ?? 1,
            })

            const validation = validateReturnPayload(payload)

            if (!validation.isValid) {
                const firstError = Object.values(validation.errors)[0]
                toast.error(firstError || 'Please fill all required return fields.')
                return
            }

            try {
                const response = await createReturnProduct(payload).unwrap()
                const successMessage =
                    response?.data?.message || response?.message || 'Return request submitted successfully.'
                toast.success(successMessage)
                setIsReturnDrawerOpen(false)
                initializeReturnState()
            } catch (error: unknown) {
                const errorMessage =
                    error &&
                        typeof error === 'object' &&
                        'data' in error &&
                        error.data &&
                        typeof error.data === 'object' &&
                        'message' in error.data &&
                        typeof error.data.message === 'string'
                        ? error.data.message
                        : 'Failed to submit return request.'

                toast.error(errorMessage)
            }
        }
    }

    const handleBack = () => {
        if (returnStep === 1) {
            setIsReturnDrawerOpen(false)
            return
        }

        if (returnStep === 2) {
            setReturnStep(1)
            return
        }

        if (returnStep === 3 && stepThreeView === 'review') {
            setStepThreeView('method')
            return
        }

        setReturnStep(2)
    }

    const handleCopyTrackingNumber = async () => {
        if (typeof window === 'undefined') return
        if (!trackingNumber) return

        try {
            await navigator.clipboard.writeText(trackingNumber)
        } catch {
            // Fail silently for non-secure contexts.
        }
    }

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
        <>
            <main className="">
                <Breadcrumb
                    items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Purchase history', href: '/dashboard' },
                        { label: 'Order Details' },
                    ]}
                />
                <div className=" ">
                    <div className="  py-4 sm:py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                <h1 className="text-xl sm:text-2xl font-bold text-[#000000]">{orderDate} order</h1>
                                <p className="text-sm sm:text-2xl text-[#171717B2] font-normal">{orderNumber}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadReceipt}
                                className="inline-flex items-center justify-center rounded-lg  px-4 py-2.5 text-sm  text-black transition "
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                <div className=" ">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="lg:col-span-2 space-y-6 border border-border rounded-lg bg-card">
                            <OrderTimeline steps={timelineSteps} deliveryStatus={deliveryStatus} />

                            <div className="bg-card rounded-lg p-4 sm:p-6">
                                <h3 className="text-sm font-semibold text-[#171717] mb-4">{items.length} items</h3>
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

                        <div className="space-y-6">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleOpenReturnDrawer}
                                className="w-full text-[#000000] text-sm bg-[#1717170F] border-2 border-[#000000] hover:bg-[#000000] hover:text-white transition"
                            >
                                Start a return
                            </Button>

                            <div className="border rounded-lg">
                                <div className="bg-card rounded-lg p-4 sm:p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Badge variant="secondary" className="text-[#1877F2]">
                                            Delivery
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:gap-2">
                                        <p className="font-semibold text-foreground text-sm sm:text-xl">Address</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{address.name}</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{address.street}</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            {address.city}, {address.state} {address.zip}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-lg p-4 sm:p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-xl font-semibold text-foreground">Payment method</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/images/Mastercard.png"
                                            alt="Card Icon"
                                            className="w-10 h-6"
                                            width={800}
                                            height={600}
                                        />
                                        <p className="text-sm font-semibold text-[#171717]">Ending in {paymentMethod.last4}</p>
                                    </div>
                                </div>

                                <div className="bg-card rounded-lg p-4 sm:p-6 space-y-4">
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-semibold text-foreground">Subtotal</h3>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Item</span>
                                            <span className="text-foreground font-medium">${summary.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Delivery fee</span>
                                            <span className="text-foreground font-medium">{formatCurrency(summary.deliveryFee)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span className="text-foreground font-medium">{formatCurrency(summary.tax)}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-2xl font-semibold text-foreground">Total</span>
                                            <span className="text-2xl font-semibold text-foreground">{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {barcode && (
                                    <div className="bg-card rounded-lg p-4 sm:p-6 flex flex-col items-center">
                                        <div className="text-center">
                                            <Barcode />
                                            <p className="text-sm text-muted-foreground">Order#{barcode}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Drawer direction="right" open={isReturnDrawerOpen} onOpenChange={handleDrawerOpenChange}>
                <DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:max-w-[320px] p-0 border-l border-[#E2E2E2]">
                    <div className="flex h-screen flex-col bg-[#F8F8F8]">
                        <div className="px-5 pt-4 pb-3 border-b border-[#E7E7E7]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] text-[#6C6C6C] leading-4">
                                        {returnStep === 1 && 'Step 1 of 3'}
                                        {returnStep === 2 && 'Step 2 of 3'}
                                        {returnStep === 3 && 'Step 3 of 3'}
                                    </p>
                                    <h2 className="text-[33px] leading-9 font-semibold text-[#171717] mt-1">
                                        {returnStep === 1 && 'Select items'}
                                        {returnStep === 2 && 'Item details'}
                                        {returnStep === 3 && (stepThreeView === 'method' ? 'Return method' : 'Review')}
                                    </h2>
                                    <p className="text-[15px] text-[#171717CC] mt-1">
                                        {returnStep === 1 && 'Select items to start with your request'}
                                        {returnStep === 2 && 'Enter details for your request'}
                                        {returnStep === 3 && 'Return by Mon, Apr 6, 2026'}
                                    </p>
                                    {returnStep === 3 && stepThreeView === 'review' && (
                                        <p className="text-[11px] text-[#17171799] mt-1">From 9:00 AM-5:00 PM</p>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsReturnDrawerOpen(false)}
                                    className="size-7 rounded-full text-[#171717] hover:bg-[#17171714]"
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            {(returnStep === 1 || returnStep === 2 || (returnStep === 3 && stepThreeView === 'method')) && (
                                <p className="text-[11px] text-[#17171799]">Eligible until 13 Jan</p>
                            )}

                            {returnStep === 1 && (
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <Checkbox
                                                checked={Boolean(selectedItemMap[item.id])}
                                                onCheckedChange={(checked) => toggleItemSelection(item.id, checked === true)}
                                                className="size-4"
                                            />
                                            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-sm bg-white border border-[#E6E6E6]">
                                                <Image
                                                    src={item.image || '/placeholder.svg'}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="72px"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13px] font-semibold leading-5 text-[#171717] line-clamp-2">
                                                    {item.title}
                                                </p>
                                                <p className="text-[20px] leading-6 font-medium text-[#171717] mt-1">
                                                    {formatCurrency(item.price)}
                                                </p>
                                                <p className="text-[13px] text-[#17171799] mt-1">Qty {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {returnStep === 2 && activeReturnItem && (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-sm bg-white border border-[#E6E6E6]">
                                            <Image
                                                src={activeReturnItem.image || '/placeholder.svg'}
                                                alt={activeReturnItem.title}
                                                fill
                                                className="object-cover"
                                                sizes="72px"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-semibold leading-5 text-[#171717] line-clamp-2">
                                                {activeReturnItem.title}
                                            </p>
                                            <p className="text-[20px] leading-6 font-medium text-[#171717] mt-1">
                                                {formatCurrency(activeReturnItem.price)}
                                            </p>
                                            <p className="text-[13px] text-[#17171799] mt-1">Qty {activeReturnItem.quantity}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[14px] font-semibold text-[#171717] mb-2">Returning quantity</p>
                                        <div className="inline-flex items-center rounded-md border border-[#17171780] bg-white overflow-hidden">
                                            <button
                                                type="button"
                                                aria-label="Decrease quantity"
                                                className="h-8 w-8 inline-flex items-center justify-center text-[#171717] disabled:opacity-40"
                                                disabled={(returnQtyMap[activeReturnItem.id] ?? 1) <= 1}
                                                onClick={() =>
                                                    updateReturnQuantity(activeReturnItem.id, activeReturnItem.quantity, 'decrease')
                                                }
                                            >
                                                <Minus className="size-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-[13px] font-medium text-[#171717]">
                                                {returnQtyMap[activeReturnItem.id] ?? 1}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Increase quantity"
                                                className="h-8 w-8 inline-flex items-center justify-center text-[#171717] disabled:opacity-40"
                                                disabled={(returnQtyMap[activeReturnItem.id] ?? 1) >= activeReturnItem.quantity}
                                                onClick={() =>
                                                    updateReturnQuantity(activeReturnItem.id, activeReturnItem.quantity, 'increase')
                                                }
                                            >
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#171717] mb-1.5">
                                            What is the issue with the item? (Required)
                                        </p>
                                        <Select value={issueReason} onValueChange={setIssueReason}>
                                            <SelectTrigger className="w-full h-9 text-[13px] bg-white border-[#17171780]">
                                                <SelectValue placeholder="Select a reason..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ISSUE_REASON_OPTIONS.map((reason) => (
                                                    <SelectItem key={reason} value={reason}>
                                                        {reason}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {issueReason && (
                                        <div className="space-y-4">
                                            <div className="rounded-md border border-[#17171766] bg-white p-3">
                                                <p className="text-[13px] text-[#171717] mb-2">I want</p>
                                                <RadioGroup
                                                    value={resolutionType}
                                                    onValueChange={(value) =>
                                                        setResolutionType(value as 'refund' | 'replacement')
                                                    }
                                                    className="gap-3"
                                                >
                                                    <label className="flex items-start gap-2 cursor-pointer">
                                                        <RadioGroupItem value="refund" className="mt-1 size-4" />
                                                        <span>
                                                            <p className="text-[14px] font-semibold text-[#171717]">Refund</p>
                                                            <p className="text-[11px] text-[#17171780]">
                                                                We&apos;ll refund your original payment method.
                                                            </p>
                                                        </span>
                                                    </label>
                                                    <label className="flex items-start gap-2 cursor-pointer">
                                                        <RadioGroupItem value="replacement" className="mt-1 size-4" />
                                                        <span>
                                                            <p className="text-[14px] font-semibold text-[#171717]">Replacement</p>
                                                            <p className="text-[11px] text-[#17171780]">
                                                                We&apos;ll send your replacement at no extra charge.
                                                            </p>
                                                        </span>
                                                    </label>
                                                </RadioGroup>
                                            </div>

                                            <div>
                                                <p className="text-[13px] font-semibold text-[#171717] mb-1.5">
                                                    What is the item condition? (Optional)
                                                </p>
                                                <Select value={itemCondition} onValueChange={setItemCondition}>
                                                    <SelectTrigger className="w-full h-9 text-[13px] bg-white border-[#17171780]">
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CONDITION_OPTIONS.map((condition) => (
                                                            <SelectItem key={condition} value={condition}>
                                                                {condition}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <p className="text-[13px] font-semibold text-[#171717] mb-1.5">Comment</p>
                                                <Textarea
                                                    maxLength={220}
                                                    value={comment}
                                                    onChange={(event) => setComment(event.target.value)}
                                                    placeholder="Would you like to make a comment (Optional)"
                                                    className="min-h-[82px] resize-none text-[13px] bg-white border-[#17171780]"
                                                />
                                                <p className="text-[12px] text-[#17171780] text-right mt-1">{comment.length}/220</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {returnStep === 3 && stepThreeView === 'method' && (
                                <div className="space-y-4">
                                    <p className="text-[13px] text-[#171717B2]">{selectedReturnItems.length} Item</p>
                                    {selectedReturnItems.map((item) => (
                                        <div key={'method-' + item.id} className="flex gap-3">
                                            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-sm bg-white border border-[#E6E6E6]">
                                                <Image
                                                    src={item.image || '/placeholder.svg'}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="72px"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13px] font-semibold leading-5 text-[#171717] line-clamp-2">
                                                    {item.title}
                                                </p>
                                                <p className="text-[20px] leading-6 font-medium text-[#171717] mt-1">
                                                    {formatCurrency(item.price)}
                                                </p>
                                                <p className="text-[13px] text-[#17171799] mt-1">Qty {returnQtyMap[item.id] ?? 1}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="rounded-md border border-[#17171766] bg-white p-3">
                                        <p className="text-[13px] font-semibold text-[#171717] mb-3">Return to seller</p>
                                        <label className="flex items-center justify-between gap-2 cursor-pointer">
                                            <span className="flex items-center gap-2">
                                                <RadioGroup
                                                    value={returnMethod}
                                                    onValueChange={() => setReturnMethod('seller')}
                                                    className="gap-0"
                                                >
                                                    <RadioGroupItem value="seller" className="size-4" />
                                                </RadioGroup>
                                                <span>
                                                    <p className="text-[14px] font-semibold text-[#171717]">Start Tech Electronics</p>
                                                    <p className="text-[11px] text-[#17171780]">
                                                        IDB Bhaban, Level-3, Agargaon, Dhaka-1209
                                                    </p>
                                                </span>
                                            </span>
                                            <span className="rounded-sm bg-[#1877F2] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                FREE
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {returnStep === 3 && stepThreeView === 'review' && activeReturnItem && (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[16px] font-semibold text-[#171717]">Start Tech Electronics</p>
                                        <p className="text-[11px] text-[#17171780]">IDB Bhaban, Level-3, Agargaon, Dhaka-1209</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="relative h-[72px] w-[72px] overflow-hidden rounded-sm bg-white border border-[#E6E6E6]">
                                            <Image
                                                src={activeReturnItem.image || '/placeholder.svg'}
                                                alt={activeReturnItem.title}
                                                fill
                                                className="object-cover"
                                                sizes="72px"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-semibold leading-5 text-[#171717] line-clamp-2">
                                                {activeReturnItem.title}
                                            </p>
                                            <p className="text-[20px] leading-6 font-medium text-[#171717] mt-1">
                                                {formatCurrency(activeReturnItem.price)}
                                            </p>
                                            <p className="text-[13px] text-[#17171799] mt-1">
                                                Qty {returnQtyMap[activeReturnItem.id] ?? 1}
                                            </p>
                                            <p className="text-[11px] text-[#17171799] mt-1">
                                                {resolutionType === 'refund' ? 'Refund' : 'Replacement'} |{' '}
                                                {issueReason || 'Issue not selected'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#171717] mb-1.5">
                                            Select return carrier (Required)
                                        </p>
                                        <Select value={carrier} onValueChange={setCarrier}>
                                            <SelectTrigger className="w-full h-9 text-[13px] bg-white border-[#17171780]">
                                                <SelectValue placeholder="Select carrier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CARRIER_OPTIONS.map((carrierItem) => (
                                                    <SelectItem key={carrierItem} value={carrierItem}>
                                                        {carrierItem}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#171717] mb-1.5">Enter tracking number</p>
                                        <div className="relative">
                                            <Input
                                                value={trackingNumber}
                                                onChange={(event) => setTrackingNumber(event.target.value)}
                                                className="h-9 bg-white border-[#17171780] pr-9"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCopyTrackingNumber}
                                                aria-label="Copy tracking number"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-5 items-center justify-center text-[#17171780] hover:text-[#171717]"
                                            >
                                                <Copy className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#E7E7E7] px-5 py-4 mt-auto bg-[#F8F8F8]">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="h-10 flex-1 border-[#17171799] text-[#171717] hover:bg-[#1717170F]"
                                >
                                    {returnStep === 3 && stepThreeView === 'review' ? 'Cancel' : 'Back'}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleContinue}
                                    disabled={
                                        isSubmittingReturn ||
                                        (returnStep === 1 && !canContinueStepOne) ||
                                        (returnStep === 2 && !canContinueStepTwo) ||
                                        (returnStep === 3 && stepThreeView === 'review' && !canSubmitReview)
                                    }
                                    className="h-10 flex-1 bg-[#2E8B57] text-white hover:bg-[#26784A] disabled:bg-[#A8CDBB] disabled:text-white"
                                >
                                    {isSubmittingReturn
                                        ? 'Submitting...'
                                        : returnStep === 3 && stepThreeView === 'review'
                                            ? 'Submit'
                                            : 'Continue'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}
