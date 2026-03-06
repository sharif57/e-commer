/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from "@/redux/feature/buyer/productSlice"
import { useGetUsersQuery } from "@/redux/feature/userSlice"
import { toast } from "sonner"
import MissingInfoModal, { type AddressData } from "@/components/missing-info-modal"
import { validateDeliveryAddress } from "@/lib/validationHelpers"

interface CartItem {
    id: string
    title: string
    price: number
    quantity: number
    image: string
    deliveryDate?: string
    selectedSize?: string
    selectedColor?: string
    brand?: string
    sku?: string
    deliveryChargeInDc?: string
    deliveryChargeOutOfDc?: string
    carrier?: string
    sellerId?: string
    product?: any
}

export default function ShoppingBag() {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pendingCheckoutItem, setPendingCheckoutItem] = useState<CartItem | null>(null)
    const [missingFields, setMissingFields] = useState<string[]>([])
    const { data: userData } = useGetUsersQuery(undefined);
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();
    const [createOrder] = useCreateOrderMutation()

    // Helper function to calculate order amount with tax and shipping
    const calculateOrderAmount = (productPrice: number, qty: number = 1, shippingCost: number = 0) => {
        const taxRate = 0.07; // 7% tax
        const subtotal = productPrice * qty;
        const tax = subtotal * taxRate;
        const total = subtotal + tax + shippingCost;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        };
    };

    useEffect(() => {
        // Load items from localStorage
        try {
            const storedCart = localStorage.getItem('cart')
            if (storedCart) {
                const cartItems = JSON.parse(storedCart)
                setItems(cartItems)
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateQuantity = (id: string, delta: number) => {
        const updatedItems = items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        setItems(updatedItems)
        localStorage.setItem('cart', JSON.stringify(updatedItems))
        window.dispatchEvent(new Event('cartUpdated'))
    }

    const removeItem = (id: string) => {
        const updatedItems = items.filter((item) => item.id !== id)
        setItems(updatedItems)
        localStorage.setItem('cart', JSON.stringify(updatedItems))
        window.dispatchEvent(new Event('cartUpdated'))
    }

    const handleCheckout = async (item: CartItem) => {
        try {
            const sellerId = item.sellerId || item.product?.userId

            if (!sellerId) {
                toast.error("Seller information missing")
                return
            }

            // Prepare base delivery address from user data
            const deliveryAddress: AddressData = {
                firstName: userData?.data?.firstName || "",
                lastName: userData?.data?.lastName || "",
                streetName: userData?.data?.streetName || "",
                area: userData?.data?.area || "",
                city: userData?.data?.city || "",
                zip: userData?.data?.zip ? String(userData?.data?.zip) : "",
                state: userData?.data?.state || "",
                country: userData?.data?.country || "",
                billingAddress: userData?.data?.billingAddress || userData?.data?.address || "",
            };

            // Validate address
            const validation = validateDeliveryAddress(deliveryAddress);

            // If validation fails, show modal to collect missing info
            if (!validation.isValid) {
                setMissingFields(validation.missingFields);
                setPendingCheckoutItem(item);
                setIsModalOpen(true);
                toast.info("Please complete your delivery address information");
                return;
            }

            // All info is valid, proceed with checkout
            await processCheckout(item, deliveryAddress);
        } catch (error: any) {
            console.error('Failed to process order:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to process order. Please try again.'
            toast.error(errorMessage)
        }
    }

    // Helper function to process the actual checkout
    const processCheckout = async (item: CartItem, deliveryAddress: AddressData) => {
        try {
            const sellerId = item.sellerId || item.product?.userId

            if (!sellerId) {
                toast.error("Seller information missing")
                return
            }

            // Get shipping cost from product
            const shippingCost = item.product?.shippingCost || 0;

            // Calculate amount with tax and shipping
            const amountDetails = calculateOrderAmount(item.price, item.quantity, shippingCost);

            const orderPayload = {
                items: [
                    {
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        sellerId,
                        shippingCost: shippingCost,
                        size: item.selectedSize,
                        color: item.selectedColor,
                    }
                ],
                firstName: deliveryAddress.firstName || "",
                lastName: deliveryAddress.lastName || "",
                streetName: deliveryAddress.streetName || "",
                area: deliveryAddress.area || "",
                city: deliveryAddress.city || "",
                zip: deliveryAddress.zip || "",
                state: deliveryAddress.state || "",
                country: deliveryAddress.country || "",
                billingAddress: deliveryAddress.billingAddress || "",
                // Add pricing details
                amountDetails: {
                    subtotal: amountDetails.subtotal,
                    tax: amountDetails.tax,
                    taxRate: 7, // 7% tax
                    shippingCost: amountDetails.shippingCost,
                    total: amountDetails.total
                }
            }

            const response = await createOrder(orderPayload).unwrap()
            toast.success(response?.data?.message || 'Order placed successfully!')

            const orderIdList = Array.isArray(response?.data)
                ? response.data.map((order: any) => order?._id || order?.orderId).filter(Boolean)
                : []

            if (orderIdList.length === 0) {
                throw new Error('Order ID missing from create-order response')
            }

            toast.info('Redirecting to payment...')
            const checkoutPayload = {
                orderId: orderIdList,
                amount: amountDetails.total, // Total amount with tax and shipping
                amountDetails: amountDetails // Send detailed breakdown
            }
            const checkoutResponse = await createCheckoutSession(checkoutPayload).unwrap()

            const checkoutUrl = checkoutResponse?.data?.url || checkoutResponse?.url || checkoutResponse?.data?.checkoutUrl
            if (checkoutUrl) {
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
            } else {
                throw new Error('Checkout URL not received from server')
            }
        } catch (error: any) {
            console.error('Failed to process order:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to process order. Please try again.'
            toast.error(errorMessage)
        }
    }

    // Handle modal confirmation
    const handleModalConfirm = (completeAddress: AddressData) => {
        setIsModalOpen(false);
        if (pendingCheckoutItem) {
            processCheckout(pendingCheckoutItem, completeAddress);
            setPendingCheckoutItem(null);
        }
    }


    return (
        <div className="min-h-screen bg-white">
            <MissingInfoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPendingCheckoutItem(null);
                }}
                onConfirm={handleModalConfirm}
                initialData={{
                    firstName: userData?.data?.firstName || "",
                    lastName: userData?.data?.lastName || "",
                    streetName: userData?.data?.streetName || "",
                    area: userData?.data?.area || "",
                    city: userData?.data?.city || "",
                    zip: userData?.data?.zip ? String(userData?.data?.zip) : "",
                    state: userData?.data?.state || "",
                    country: userData?.data?.country || "",
                    billingAddress: userData?.data?.billingAddress || userData?.data?.address || "",
                }}
                missingFields={missingFields}
            />
            {/* Header */}


            {/* Cart Items */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className=" ">
                    <div className=" px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My bag</h1>
                            <Link href="/checkout-page">
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                                    Buy all items
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center px-4 py-12">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className=" flex items-center justify-center px-4 py-12">
                        <div className="text-center max-w-md w-full">
                            <Image src="/images/Illustration.png" alt="Empty Cart" width={200} height={200} className="mx-auto mb-4" />

                            {/* Text */}
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                You haven&apos;t added any item to your watchlist
                            </h2>
                            <p className="text-gray-600 mb-10">
                                Save your favourite products here to buy later.
                            </p>

                            {/* Button */}
                            <Link href="/">
                                <Button variant={"outline"}>Browse items</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6  transition-colors"
                            >
                                {/* Product Image */}
                                <div className="flex-shrink-0 w-full sm:w-48">
                                    <div className="relative w-full sm:w-48 h-40 sm:h-60 bg-gray-200 rounded-lg overflow-hidden">
                                        <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover " />
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    {/* Title and Price */}
                                    <div>
                                        <h3 className="text-xl lg:text-2xl  w-2/3  font-semibold text-black  mb-2">{item.title}</h3>
                                        <p className="text-lg sm:text-xl font-semibold text-black mb-2">${item.price.toFixed(2)}</p>

                                        {/* Price Breakdown */}
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 max-w-xs">
                                            <div className="flex justify-between text-lg">
                                                <span className="text-black font-medium">Price × {item.quantity}:</span>
                                                <span className="font-medium text-black">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg">
                                                <span className="text-black font-medium">Tax (7%):</span>
                                                <span className="font-medium text-black">${((item.price * item.quantity) * 0.07).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg">
                                                <span className="text-black font-medium">Shipping:</span>
                                                <span className="font-medium text-black">${(item.product?.shippingCost || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 flex justify-between">
                                                <span className="font-semibold text-black text-xl">Total:</span>
                                                <span className="font-bold text-black text-base">
                                                    ${((item.price * item.quantity) + ((item.price * item.quantity) * 0.07) + (item.product?.shippingCost || 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity and Delivery */}
                                    <div className="space-y-3">
                                        {/* Item Quantity */}
                                        <div>
                                            <p className="text-xs sm:text-lg font-medium text-[#171717] mb-2">Item quantity</p>
                                            <div className="flex items-center gap-2 w-fit border border-[#171717] rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center  rounded-lg hover:bg-gray-100 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center   rounded-lg hover:bg-gray-100 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Delivery Date */}
                                        <p className="text-xs sm:text-sm text-[#000000] font-normal">
                                            {item.carrier && `Carrier: ${item.carrier}`}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm  font-medium transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Remove
                                            </button>
                                            <button onClick={() => handleCheckout(item)} className="text-[#000000] cursor-pointer hover:text-black text-xs sm:text-sm font-medium border-2 border-[#000000] bg-accent/90 rounded-lg px-3 py-1 transition-colors flex items-center gap-1">
                                                Proceed to checkout
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}
