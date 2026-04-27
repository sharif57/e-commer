"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { useDeliveryTrackMutation, useGetSingleProductSellerQuery } from "@/redux/feature/seller/productSellerSlice"
import { toast } from "sonner"

interface OrderItem {
    id: string
    item: string
    productId: string
    orderTotal: string
    customer: string
    fulfilledBy: string
    shipMethod: string
    reqQty: number
    status: string
    qtyUpdated: string
    carrier: string
    trackingNo: string
    trackingLink: string
}

export default function OrderDetails() {

    const params = useSearchParams();
    const id = params.get("orderId");
    const { data } = useGetSingleProductSellerQuery(id as string);
    const orderData = data?.data;
    console.log(orderData);

    const [deliveryTrack] = useDeliveryTrackMutation();

    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [orderItems, setOrderItems] = useState<OrderItem[]>([])

    useEffect(() => {
        if (orderData) {
            setOrderItems([
                {
                    id: orderData._id,
                    item: orderData.productId?.title || "N/A",
                    productId: orderData.productId?._id || "N/A",
                    orderTotal: `$${(orderData.price * orderData.quantity).toFixed(2)}`,
                    customer: `${orderData.firstName} ${orderData.lastName}`,
                    fulfilledBy: "Seller",
                    shipMethod: orderData.productId?.carrier || "N/A",
                    reqQty: orderData.quantity,
                    status: orderData.deliveryStatus || "pending",
                    qtyUpdated: "",
                    carrier: "",
                    trackingNo: "",
                    trackingLink: "",
                }
            ])
        }
    }, [orderData])

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(orderItems.map((item) => item.id))
        } else {
            setSelectedItems([])
        }
    }

    const handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, id])
        } else {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
        }
    }

    const updateOrderItem = (id: string, field: keyof OrderItem, value: string) => {
        setOrderItems(
            orderItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        )
    }

    const handleConfirmShipment = async (item: OrderItem) => {
        if (!item.carrier || !item.trackingNo || !item.trackingLink) {
            toast.error("Please fill in carrier, tracking number, and tracking link before confirming shipment.")
            return
        }

        try {
            await deliveryTrack({
                id: id,
                body: {
                    carrier: item.carrier,
                    trackingNo: item.trackingNo,
                    trackingUrl: item.trackingLink,
                }
            }).unwrap()

            toast.success("Shipment confirmed successfully!")
        } catch (error) {
            console.error("Failed to confirm shipment:", error)
            toast.error("Failed to confirm shipment. Please try again.")
        }
    }

    return (
        <div className="min-h-screen ">
            <div className="">
                {/* Header */}
                <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                    Order Details
                </h1>

                {/* Order Info */}
                <div className="mb-1">
                    <p className="text-sm md:text-base font-semibold text-foreground">
                        PO# {orderData?.orderId || "N/A"}
                    </p>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mb-4">
                    Order date: {orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                </div>

                {/* Customer Info and Price Details */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    {/* Customer and Shipping Info */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-6 sm:gap-12 border-t border-border pt-4">
                        {/* Customer Name */}
                        <div className="min-w-[140px]">
                            <h3 className="text-xs md:text-sm font-semibold text-foreground mb-1">
                                Customer Name
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground">{orderData?.firstName} {orderData?.lastName}</p>
                            <a
                                href="mailto:"
                                className="text-xs md:text-sm text-blue-600 hover:underline"
                            >
                                Send Email
                            </a>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-xs md:text-sm font-semibold text-foreground mb-1">
                                Shipping Address
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {orderData?.streetName}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {orderData?.city}, {orderData?.zip} {orderData?.country}
                            </p>
                        </div>
                    </div>

                    {/* Price Details Card */}
                    <Card className="w-full lg:w-[240px] p-4 bg-[#78788029] border border-border rounded-lg shadow-none">
                        <h3 className="text-sm font-semibold text-foreground mb-3">
                            Price Details
                        </h3>
                        <div className="space-y-2 text-xs md:text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-foreground">${orderData ? (orderData.price * orderData.quantity).toFixed(2) : "0.00"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span className="text-foreground">$0.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-foreground">${orderData?.shippingCost?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border">
                                <span className="font-semibold text-foreground">Total</span>
                                <span className="font-semibold text-foreground">${orderData ? ((orderData.price * orderData.quantity) + (orderData.shippingCost || 0)).toFixed(2) : "0.00"}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Order Items Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full ">
                            <thead>
                                <tr className="border-b border-border bg-[#78788029">
                                    <th className="w-10 p-3 text-left">
                                        <Checkbox
                                            checked={selectedItems.length === orderItems.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Item
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Product ID
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Order Total
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Customer
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Fulfilled by
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Ship Method
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Req Qty
                                    </th>
                                    {/* <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Status
                                    </th> */}

                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Carrier
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Tracking No
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Tracking Link
                                    </th>
                                    <th className="p-3 text-left text-xs font-semibold text-foreground whitespace-nowrap">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr key={item.id} className="border-b border-border last:border-b-0">
                                        <td className="p-3">
                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectItem(item.id, checked as boolean)
                                                }
                                            />
                                        </td>
                                        <td className="p-3">
                                            <a
                                                href="#"
                                                className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                                            >
                                                {item.item.slice(0, 20)}....
                                            </a>
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {item.productId}
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {item.orderTotal}
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {item.customer}
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {item.fulfilledBy}
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {item.shipMethod}
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                            {item.reqQty}
                                        </td>
                                        {/* <td className="p-3">
                                            <Select
                                                value={item.status}
                                                onValueChange={(value) =>
                                                    updateOrderItem(item.id, "status", value)
                                                }
                                            >
                                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="placed">Placed</SelectItem>
                                                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td> */}
                                        <td className="p-3">
                                            <Select
                                                value={item.carrier}
                                                onValueChange={(value) =>
                                                    updateOrderItem(item.id, "carrier", value)
                                                }
                                            >
                                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                                    <SelectValue placeholder="Select carrier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fedex">FedEx</SelectItem>
                                                    <SelectItem value="ups">UPS</SelectItem>
                                                    <SelectItem value="usps">USPS</SelectItem>
                                                    <SelectItem value="dhl">DHL</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-3">
                                            <Input
                                                type="number"
                                                value={item.trackingNo}

                                                onChange={(e) =>
                                                    updateOrderItem(item.id, "trackingNo", e.target.value)
                                                }
                                                className="w-[100px] h-8 text-xs"
                                                placeholder=""
                                            />
                                        </td>
                                        <td className="p-3">
                                            <Input
                                                type="url"
                                                value={item.trackingLink}
                                                onChange={(e) =>
                                                    updateOrderItem(item.id, "trackingLink", e.target.value)
                                                }
                                                className="w-[100px] h-8 text-xs"
                                                placeholder=""
                                            />
                                        </td>
                                        <td className="p-3">
                                            <Button
                                                size="sm"
                                                className="h-8 px-3 text-xs bg-primary text-white whitespace-nowrap"
                                                onClick={() => handleConfirmShipment(item)}
                                            >
                                                Confirm shipment
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
