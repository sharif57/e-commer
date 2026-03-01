// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @next/next/no-img-element */
// "use client"

// import { useState, useEffect } from "react"
// import DeliveryAddressModal, { type AddressData } from "./delivery-address-modal"
// import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from "@/redux/feature/buyer/productSlice"
// import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/feature/userSlice"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// interface OrderItem {
//   id: string
//   image?: string
//   title?: string
//   price?: number
//   quantity: number
//   estimatedDelivery?: string
//   selectedSize?: string
//   selectedColor?: string
//   des?: string
//   sellerId?: string
//   product?: {
//     _id: string
//     title: string
//     price: number
//     brand?: string
//     image: string[]
//     carrier?: string
//     sku?: string
//     deliveryChargeInDc?: string
//     deliveryChargeOutOfDc?: string
//     count?: number
//     inStock?: boolean
//     des?: string
//     sellerId?: string
//   }
// }

// export default function CheckoutPage() {
//   const router = useRouter()
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
//     firstName: "",
//     lastName: "",
//     streetName: "",
//     area: "",
//     city: "",
//     zip: "",
//     state: "",
//     country: "",
//   })
//   const [createCheckoutSession] = useCreateCheckoutSessionMutation();
//   const [updateUser] = useUpdateUserMutation();


//   const [createOrder, { isLoading: isCreatingOrder, error: orderError }] = useCreateOrderMutation()
//   const { data: userData, isLoading: isUserLoading } = useGetUsersQuery(undefined);
//   console.log(userData)


//   const [orderItems, setOrderItems] = useState<OrderItem[]>([])

//   console.log(orderItems, 'local stoage data')
//   const [isLoading, setIsLoading] = useState(true)
//   const [orderError2, setOrderError2] = useState<string | null>(null)
//   const [isProcessing, setIsProcessing] = useState(false)

//   // Load cart from localStorage
//   useEffect(() => {
//     try {
//       const storedCart = localStorage.getItem('cart')
//       if (storedCart) {
//         const cartItems = JSON.parse(storedCart)
//         setOrderItems(cartItems)
//       }
//     } catch (error) {
//       console.error('Failed to load cart from localStorage', error)
//       setOrderError2('Failed to load cart items')
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   // Load default address from user data (root-level fields)
//   useEffect(() => {
//     if (userData?.data) {
//       setDeliveryAddress({
//         firstName: userData.data.firstName || "",
//         lastName: userData.data.lastName || "",
//         streetName: userData.data.streetName || "",
//         area: userData.data.area || "",
//         city: userData.data.city || "",
//         zip: userData.data.zip ? String(userData.data.zip) : "",
//         state: userData.data.state || "",
//         country: userData.data.country || "",
//       })
//     }
//   }, [userData])

//   const itemTotal = orderItems.reduce((sum, item) => {
//     const price = item.price ?? item.product?.price ?? 0
//     return sum + price * item.quantity
//   }, 0)
//   const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0)
//   const shippingCost = 0 // Set based on your business logic
//   const tax = 0 // 10% tax, adjust as needed
//   const orderTotal = itemTotal + shippingCost + tax


//   const handleAddressChange = (newAddress: AddressData) => {
//     setDeliveryAddress(newAddress)
//   }


//   // Prepare order payload
//   const prepareOrderPayload = () => {
//     const items = orderItems.map((item) => ({
//       productId: item.id || item.product?._id,
//       quantity: item.quantity,
//       price: item.price ?? item.product?.price ?? 0,
//       sellerId: userData?.data?._id || item.sellerId || item.product?.sellerId || '',
//       color: item.selectedColor || '',
//       size: item.selectedSize || '',
//     }))


//     return {
//       items,
//       firstName: deliveryAddress?.firstName,
//       lastName: deliveryAddress?.lastName,
//       streetName: deliveryAddress?.streetName,
//       area: deliveryAddress?.area,
//       city: deliveryAddress?.city,
//       zip: Number(deliveryAddress?.zip),
//       state: deliveryAddress?.state,
//       country: deliveryAddress?.country,
//       billingAddress: `${deliveryAddress.streetName}, ${deliveryAddress.area}, ${deliveryAddress.city}, ${deliveryAddress.zip}`,
//     }
//   }

//   // Handle order submission
//   const handleSubmitOrder = async () => {
//     // Validation
//     if (!deliveryAddress.firstName || !deliveryAddress.lastName) {
//       setOrderError2('Please provide your name')
//       return
//     }

//     if (!deliveryAddress.streetName || !deliveryAddress.city) {
//       setOrderError2('Please provide complete address')
//       return
//     }

//     if (orderItems.length === 0) {
//       setOrderError2('Your cart is empty')
//       return
//     }

//     // Validate color and size for each item
//     const missingVariants = orderItems.filter(
//       (item) => !item.selectedColor || !item.selectedSize
//     )
//     if (missingVariants.length > 0) {
//       setOrderError2('Please select color and size for all items')
//       return
//     }

//     setIsProcessing(true)
//     setOrderError2(null)

//     try {
//       const orderPayload = prepareOrderPayload()
//       console.log('Submitting order:', orderPayload)

//       const response = await createOrder(orderPayload).unwrap()
//       console.log('Order created successfully:', response)

//       // Extract order ids from response
//       const orderIdList = Array.isArray(response?.data)
//         ? response.data.map((order: any) => order?._id || order?.orderId).filter(Boolean)
//         : []

//       if (orderIdList.length === 0) {
//         throw new Error('Order ID missing from create-order response')
//       }
//       // Show success message
//       toast.success(response?.data?.message || 'Order placed successfully!')

//       // Create Stripe checkout session
//       toast.info('Redirecting to payment...')
//       const checkoutPayload = {
//         orderId: orderIdList
//       }

//       const checkoutResponse = await createCheckoutSession(checkoutPayload).unwrap()
//       console.log('Checkout session created:', checkoutResponse)

//       // Clear cart after successful payment session creation
//       localStorage.removeItem('cart')
//       setOrderItems([])

//       // Redirect to Stripe checkout
//       const checkoutUrl = checkoutResponse?.data?.url || checkoutResponse?.url || checkoutResponse?.data?.checkoutUrl

//       if (checkoutUrl) {
//         window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
//       } else {
//         throw new Error('Checkout URL not received from server')
//       }

//     } catch (error: any) {
//       console.error('Failed to process order:', error)
//       const errorMessage = error?.data?.message || error?.message || 'Failed to process order. Please try again.'
//       toast.error(errorMessage)
//       setOrderError2(errorMessage)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Container */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Error Messages */}
//         {/* {orderError2 && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-700">{orderError2}</p>
//           </div>
//         )}

//         {orderError && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-700">
//               {typeof orderError === 'string' ? orderError : 'An error occurred'}
//             </p>
//           </div>
//         )} */}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Review Order & Delivery */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Review Order Section */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Review order</h2>
//               <div className="bg-white rounded-lg p-6 space-y-6">
//                 {isLoading ? (
//                   <div className="flex items-center justify-center py-8">
//                     <p className="text-gray-600">Loading cart...</p>
//                   </div>
//                 ) : orderItems.length === 0 ? (
//                   <div className="flex items-center justify-center py-8">
//                     <p className="text-gray-600">Your bag is empty.</p>
//                   </div>
//                 ) : (
//                   orderItems.map((item) => (
//                     <div key={item.id} className="flex gap-4 border-b pb-4 last:border-b-0">
//                       <div className="flex-shrink-0">
//                         <img
//                           src={item.image || item.product?.image?.[0] || "/placeholder.svg"}
//                           alt={item.title || item.product?.title || "Product"}
//                           className="w-24 h-32 object-cover rounded-md bg-gray-100"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="text-sm font-medium text-gray-900 mb-2">
//                           {item.des || item.product?.des || item.title || item.product?.title}
//                         </h3>
//                         <p className="text-lg font-semibold text-gray-900 mb-2">
//                           ${((item.price ?? item.product?.price) || 0).toFixed(2)}
//                         </p>
//                         {item.selectedColor && (
//                           <p className="text-xs text-gray-600 mb-2">
//                             Color: <span className="font-medium">{item.selectedColor}</span>
//                           </p>
//                         )}
//                         {item.selectedSize && (
//                           <p className="text-xs text-gray-600 mb-2">
//                             Size: <span className="font-medium">{item.selectedSize}</span>
//                           </p>
//                         )}
//                         <div className="space-y-1 text-sm text-gray-600">
//                           <p>
//                             <span className="font-medium">Quantity:</span> {item.quantity}x
//                           </p>
//                           {item.product?.carrier && (
//                             <p>
//                               <span className="font-medium">Carrier:</span> {item.product.carrier}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Deliver To Section */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Deliver to</h2>
//               <div className="bg-white rounded-lg p-6">
//                 {deliveryAddress?.firstName ? (
//                   <div className="space-y-2 mb-4">
//                     <p className="font-medium text-gray-900">
//                       {deliveryAddress?.firstName} {deliveryAddress?.lastName}
//                     </p>
//                     <p className="text-gray-600">{deliveryAddress.streetName}</p>
//                     {deliveryAddress.area && <p className="text-gray-600">{deliveryAddress.area}</p>}
//                     <p className="text-gray-600">
//                       {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}
//                     </p>
//                     <p className="text-gray-600">{deliveryAddress.country}</p>
//                   </div>
//                 ) : (
//                   <p className="text-gray-600 mb-4">No address added yet</p>
//                 )}
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
//                 >
//                   {deliveryAddress.firstName ? 'Change' : 'Add address'}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg p-6 sticky top-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Order summary</h2>

//               <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Items ({totalQuantity})</span>
//                   <span className="font-medium text-gray-900">${itemTotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="font-medium text-gray-900">${shippingCost.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax</span>
//                   <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
//                 </div>
//               </div>

//               <div className="flex justify-between mb-6">
//                 <span className="font-semibold text-gray-900">Order total</span>
//                 <span className="text-xl font-bold text-gray-900">${orderTotal.toFixed(2)}</span>
//               </div>

//               <div className="mb-6 p-3 bg-blue-50 rounded-md">
//                 <p className="text-xs text-gray-600">
//                   By clicking confirm, you agree to ebakx&#39;s{" "}
//                   <a href="#" className="text-blue-600 hover:underline">
//                     Terms of Purchase
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" className="text-blue-600 hover:underline">
//                     shopping policy
//                   </a>
//                 </p>
//               </div>

//               <button
//                 onClick={handleSubmitOrder}
//                 disabled={isProcessing || isCreatingOrder || orderItems.length === 0 || !deliveryAddress.firstName}
//                 className={`w-full font-semibold py-3 px-4 rounded-md transition-colors mb-3 flex items-center justify-center gap-2 ${isProcessing || isCreatingOrder
//                   ? 'bg-gray-400 cursor-not-allowed text-white'
//                   : orderItems.length === 0 || !deliveryAddress.firstName
//                     ? 'bg-gray-300 cursor-not-allowed text-gray-600'
//                     : 'bg-primary hover:bg-primary/90 text-white'
//                   }`}
//               >
//                 {isProcessing || isCreatingOrder ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   'Place Order'
//                 )}
//               </button>

//               <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path
//                     fillRule="evenodd"
//                     d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Your payment information is secure.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Address Modal */}
//       <DeliveryAddressModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={handleAddressChange}
//         initialData={deliveryAddress}
//       />
//     </div>
//   )
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import DeliveryAddressModal, { type AddressData } from "./delivery-address-modal"
import { useCreateCheckoutSessionMutation, useCreateOrderMutation } from "@/redux/feature/buyer/productSlice"
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/feature/userSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OrderItem {
  id: string
  image?: string
  title?: string
  price?: number
  quantity: number
  estimatedDelivery?: string
  selectedSize?: string
  selectedColor?: string
  des?: string
  sellerId?: string
  product?: {
    _id: string
    title: string
    price: number
    brand?: string
    image: string[]
    carrier?: string
    sku?: string
    deliveryChargeInDc?: string
    deliveryChargeOutOfDc?: string
    count?: number
    inStock?: boolean
    des?: string
    sellerId?: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    firstName: "",
    lastName: "",
    streetName: "",
    area: "",
    city: "",
    zip: "",
    state: "",
    country: "",
    phone: "",
  })

  const [createCheckoutSession] = useCreateCheckoutSessionMutation()
  const [updateUser] = useUpdateUserMutation()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()
  const { data: userData, isLoading: isUserLoading } = useGetUsersQuery(undefined)

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [orderError2, setOrderError2] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const cartItems = JSON.parse(storedCart)
        setOrderItems(cartItems)
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error)
      setOrderError2("Failed to load cart items")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load default address from user data
  useEffect(() => {
    if (userData?.data) {
      setDeliveryAddress({
        firstName: userData.data.firstName || "",
        lastName: userData.data.lastName || "",
        streetName: userData.data.streetName || "",
        area: userData.data.area || "",
        city: userData.data.city || "",
        zip: userData.data.zip ? String(userData.data.zip) : "",
        state: userData.data.state || "",
        country: userData.data.country || "",
        phone: userData.data.phone || "",
      })
    }
  }, [userData])

  const itemTotal = orderItems.reduce((sum, item) => {
    const price = item.price ?? item.product?.price ?? 0
    return sum + price * item.quantity
  }, 0)
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const shippingCost = 0
  const tax = 0
  const orderTotal = itemTotal + shippingCost + tax

  // Handle address change from modal — also update user profile with new data
  const handleAddressChange = async (newAddress: AddressData) => {
    setDeliveryAddress(newAddress)

    // Build update payload — only send fields that have values
    const updatePayload: Record<string, any> = {}

    if (newAddress.firstName) updatePayload.firstName = newAddress.firstName
    if (newAddress.lastName) updatePayload.lastName = newAddress.lastName
    if (newAddress.streetName) updatePayload.streetName = newAddress.streetName
    if (newAddress.area) updatePayload.area = newAddress.area
    if (newAddress.city) updatePayload.city = newAddress.city
    if (newAddress.zip) updatePayload.zip = parseInt(newAddress.zip)
    if (newAddress.state) updatePayload.state = newAddress.state
    if (newAddress.country) updatePayload.country = newAddress.country
    if (newAddress.phone) updatePayload.phone = newAddress.phone

    try {
      await updateUser(updatePayload).unwrap()
      toast.success("Address updated successfully!")
    } catch (error: any) {
      console.error("Failed to update user address:", error)
      toast.error(error?.data?.message || "Failed to save address. Will still use for this order.")
    }
  }

  // Prepare order payload
  const prepareOrderPayload = () => {
    const items = orderItems.map((item) => ({
      productId: item.id || item.product?._id,
      quantity: item.quantity,
      price: item.price ?? item.product?.price ?? 0,
      sellerId: userData?.data?._id || item.sellerId || item.product?.sellerId || "",
      color: item.selectedColor || "",
      size: item.selectedSize || "",
    }))

    return {
      items,
      firstName: deliveryAddress?.firstName,
      lastName: deliveryAddress?.lastName,
      streetName: deliveryAddress?.streetName,
      area: deliveryAddress?.area,
      city: deliveryAddress?.city,
      zip: Number(deliveryAddress?.zip),
      state: deliveryAddress?.state,
      country: deliveryAddress?.country,
      phone: deliveryAddress?.phone,
      billingAddress: `${deliveryAddress.streetName}, ${deliveryAddress.area}, ${deliveryAddress.city}, ${deliveryAddress.zip}`,
    }
  }

  // Check if address is complete enough to place order
  const isAddressComplete = () => {
    return (
      deliveryAddress.firstName &&
      deliveryAddress.lastName &&
      deliveryAddress.streetName &&
      deliveryAddress.city
    )
  }

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!deliveryAddress.firstName || !deliveryAddress.lastName) {
      setOrderError2("Please provide your name")
      toast.error("Please provide your name")
      return
    }

    if (!deliveryAddress.streetName || !deliveryAddress.city) {
      setOrderError2("Please provide complete address")
      toast.error("Please provide complete address")
      return
    }

    if (orderItems.length === 0) {
      setOrderError2("Your cart is empty")
      toast.error("Your cart is empty")
      return
    }

    const missingVariants = orderItems.filter(
      (item) => !item.selectedColor || !item.selectedSize
    )
    if (missingVariants.length > 0) {
      setOrderError2("Please select color and size for all items")
      toast.error("Please select color and size for all items")
      return
    }

    setIsProcessing(true)
    setOrderError2(null)

    try {
      const orderPayload = prepareOrderPayload()
      console.log("Submitting order:", orderPayload)

      const response = await createOrder(orderPayload).unwrap()
      console.log("Order created successfully:", response)

      const orderIdList = Array.isArray(response?.data)
        ? response.data.map((order: any) => order?._id || order?.orderId).filter(Boolean)
        : []

      if (orderIdList.length === 0) {
        throw new Error("Order ID missing from create-order response")
      }

      toast.success(response?.data?.message || "Order placed successfully!")
      toast.info("Redirecting to payment...")

      const checkoutPayload = { orderId: orderIdList }
      const checkoutResponse = await createCheckoutSession(checkoutPayload).unwrap()
      console.log("Checkout session created:", checkoutResponse)

      localStorage.removeItem("cart")
      setOrderItems([])

      const checkoutUrl =
        checkoutResponse?.data?.url ||
        checkoutResponse?.url ||
        checkoutResponse?.data?.checkoutUrl

      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank", "noopener,noreferrer")
      } else {
        throw new Error("Checkout URL not received from server")
      }
    } catch (error: any) {
      console.error("Failed to process order:", error)
      const errorMessage =
        error?.data?.message || error?.message || "Failed to process order. Please try again."
      toast.error(errorMessage)
      setOrderError2(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const canPlaceOrder =
    !isProcessing &&
    !isCreatingOrder &&
    orderItems.length > 0 &&
    !!isAddressComplete()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show address warning if incomplete */}
        {!isUserLoading && !isAddressComplete() && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <p className="text-yellow-800 text-sm">
              ⚠️ Please add your delivery address to place an order.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium text-yellow-900 underline hover:no-underline"
            >
              Add Address
            </button>
          </div>
        )}

        {/* {orderError2 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{orderError2}</p>
          </div>
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Review Order Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review order</h2>
              <div className="bg-white rounded-lg p-6 space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">Loading cart...</p>
                  </div>
                ) : orderItems.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">Your bag is empty.</p>
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-b-0">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || item.product?.image?.[0] || "/placeholder.svg"}
                          alt={item.title || item.product?.title || "Product"}
                          className="w-24 h-32 object-cover rounded-md bg-gray-100"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          {item.des || item.product?.des || item.title || item.product?.title}
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                          ${((item.price ?? item.product?.price) || 0).toFixed(2)}
                        </p>
                        {item.selectedColor && (
                          <p className="text-xs text-gray-600 mb-2">
                            Color: <span className="font-medium">{item.selectedColor}</span>
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-gray-600 mb-2">
                            Size: <span className="font-medium">{item.selectedSize}</span>
                          </p>
                        )}
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Quantity:</span> {item.quantity}x
                          </p>
                          {item.product?.carrier && (
                            <p>
                              <span className="font-medium">Carrier:</span> {item.product.carrier}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Deliver To Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Deliver to</h2>
              <div className="bg-white rounded-lg p-6">
                {isUserLoading ? (
                  <p className="text-gray-500 text-sm">Loading address...</p>
                ) : isAddressComplete() ? (
                  <div className="space-y-1 mb-4">
                    <p className="font-medium text-gray-900">
                      {deliveryAddress.firstName} {deliveryAddress.lastName}
                    </p>
                    <p className="text-gray-600">{deliveryAddress.streetName}</p>
                    {deliveryAddress.area && (
                      <p className="text-gray-600">{deliveryAddress.area}</p>
                    )}
                    <p className="text-gray-600">
                      {deliveryAddress.city}
                      {deliveryAddress.state && `, ${deliveryAddress.state}`}
                      {deliveryAddress.zip && ` ${deliveryAddress.zip}`}
                    </p>
                    {deliveryAddress.country && (
                      <p className="text-gray-600">{deliveryAddress.country}</p>
                    )}
                    {deliveryAddress.phone && (
                      <p className="text-gray-600">📞 {deliveryAddress.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4 text-sm">No address added yet.</p>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  {isAddressComplete() ? "Change address" : "Add address"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({totalQuantity})</span>
                  <span className="font-medium text-gray-900">${itemTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-gray-900">Order total</span>
                <span className="text-xl font-bold text-gray-900">${orderTotal.toFixed(2)}</span>
              </div>

              <div className="mb-6 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-gray-600">
                  By clicking confirm, you agree to ebakx&#39;s{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Purchase
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    shopping policy
                  </a>
                </p>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={!canPlaceOrder}
                className={`w-full font-semibold py-3 px-4 rounded-md transition-colors mb-3 flex items-center justify-center gap-2 ${
                  isProcessing || isCreatingOrder
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : !canPlaceOrder
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                {isProcessing || isCreatingOrder ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Your payment information is secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address Modal */}
      <DeliveryAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddressChange}
        initialData={deliveryAddress}
      />
    </div>
  )
}