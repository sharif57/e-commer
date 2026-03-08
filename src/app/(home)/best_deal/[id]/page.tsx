/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Star, CreditCard, Minus, Plus, ChevronDown, ChevronUp, Check, Share2 } from "lucide-react"
import Method from "@/components/icon/method"
import Image from "next/image"
import Link from "next/link"
import { useCreateCheckoutSessionMutation, useCreateOrderMutation, useGetSingleProductQuery } from "@/redux/feature/buyer/productSlice"
import { useParams } from "next/navigation"
import ProductSkeleton from "@/components/Skeleton/ProductDetailsSkeleton"
import { toast } from "sonner"
import { useCreateReviewMutation, useGetAllReviewsQuery } from "@/redux/feature/buyer/reviewSlice"
import { useGetUsersQuery } from "@/redux/feature/userSlice"
import MissingInfoModal, { type AddressData } from "@/components/missing-info-modal"
import { validateDeliveryAddress } from "@/lib/validationHelpers"

export default function ProductPage() {
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [mainImage, setMainImage] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [wishlistPending, setWishlistPending] = useState(false)
    const [page, setPage] = useState(1)
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [isReviewSectionOpen, setIsReviewSectionOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [missingFields, setMissingFields] = useState<string[]>([])
    const [sharePending, setSharePending] = useState(false)
    const [isZoomActive, setIsZoomActive] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
    const imageContainerRef = useRef<HTMLDivElement | null>(null)

    const { data, isLoading } = useGetSingleProductQuery(id as string);
    const { data: userData } = useGetUsersQuery(undefined);
    const [createCheckoutSession] = useCreateCheckoutSessionMutation();
    const [createOrder] = useCreateOrderMutation()
    const [createReview] = useCreateReviewMutation();
    const { data: reviewData, refetch: refetchReviews } = useGetAllReviewsQuery({ id: id as string, page });
    const product = data?.data;
    const sizes = product?.size
    const images = product?.image || []
    const reviewList = reviewData?.data?.result || []
    const totalReviews = reviewData?.data?.meta?.total || reviewList.length || 0
    const averageReviewRating = reviewList.length
        ? reviewList.reduce((sum: number, review: any) => sum + Number(review?.rating || 0), 0) / reviewList.length
        : 0

    // Initialize wishlist state from localStorage
    useEffect(() => {
        if (product?._id) {
            try {
                const savedWishlist = localStorage.getItem("wishlist");
                if (savedWishlist) {
                    const wishlistProducts = JSON.parse(savedWishlist);
                    const isInWishlist = wishlistProducts.some((p: any) => p._id === product._id);
                    setIsWishlisted(isInWishlist);
                }
            } catch (error) {
                console.error("Failed to load wishlist from localStorage", error);
            }
        }
    }, [product?._id]);

    useEffect(() => {
        if (!selectedSize && sizes?.length > 0) {
            setSelectedSize(sizes[0])
        }
    }, [sizes, selectedSize])

    useEffect(() => {
        if (!selectedColor && product?.color?.length > 0) {
            setSelectedColor(product.color[0])
        }
    }, [product?.color, selectedColor])

    useEffect(() => {
        if (mainImage > images.length - 1) {
            setMainImage(0)
        }
        setIsZoomActive(false)
    }, [images.length, mainImage])

    useEffect(() => {
        if (typeof window === "undefined") return
        const coarsePointer = window.matchMedia("(pointer: coarse)").matches
        const hasTouch = navigator.maxTouchPoints > 0
        setIsTouchDevice(coarsePointer || hasTouch)
    }, [])

    const handleQuantityChange = (value: number) => {
        if (value > 0 && value <= 10) {
            setQuantity(value)
        }
    }

    const handleAddToBag = () => {
        if (!product) {
            toast.error("Product not loaded yet")
            return
        }
        const cartItem = {
            id: product._id,
            title: product.title,
            price: product.price,
            image: product.image?.[0] || "/placeholder.svg",
            quantity: quantity,
            selectedSize: selectedSize,
            selectedColor: selectedColor,
            product,
        }
        try {
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
            const existingItemIndex = existingCart.findIndex((item: any) =>
                item.id === product._id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
            )
            if (existingItemIndex > -1) {
                existingCart[existingItemIndex].quantity += quantity
            } else {
                existingCart.push(cartItem)
            }
            localStorage.setItem('cart', JSON.stringify(existingCart))
            window.dispatchEvent(new Event('cartUpdated'))
            toast.success("Product added to bag!")
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error("Failed to add product to bag")
        }
    }

    // --- BUY NOW FUNCTIONALITY ---
    // --- BUY NOW FUNCTIONALITY ---
    const handleSubmitOrder = async () => {
        try {
            if (!product) {
                toast.error("Product not loaded yet");
                return;
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
                setIsModalOpen(true);
                toast.info("Please complete your delivery address information");
                return;
            }

            // All info is valid, proceed with order
            await processOrder(deliveryAddress);
        } catch (error: any) {
            console.error('Failed to process order:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to process order. Please try again.'
            toast.error(errorMessage)
        }
    }

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

    // Helper function to process the actual order
    const processOrder = async (deliveryAddress: AddressData) => {
        try {
            if (!product) {
                toast.error("Product not loaded yet");
                return;
            }

            // Calculate amount with tax and shipping
            const amountDetails = calculateOrderAmount(product.price, quantity, product.shippingCost || 0);

            // Prepare order payload in required format
            const orderPayload = {
                items: [
                    {
                        productId: product._id,
                        quantity: quantity,
                        price: product.price,
                        sellerId: product.userId,
                        shippingCost: product.shippingCost || 0,
                        size: selectedSize,
                        color: selectedColor,
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
            };

            // Create order
            const response = await createOrder(orderPayload).unwrap();
            toast.success(response?.data?.message || 'Order placed successfully!');

            // Extract order ids from response
            const orderIdList = Array.isArray(response?.data)
                ? response.data.map((order: any) => order?._id || order?.orderId).filter(Boolean)
                : []

            if (orderIdList.length === 0) {
                throw new Error('Order ID missing from create-order response')
            }

            // Create Stripe checkout session with amount details
            toast.info('Redirecting to payment...');
            const checkoutPayload = {
                orderId: orderIdList,
                amount: amountDetails.total, // Total amount with tax and shipping
                amountDetails: amountDetails // Send detailed breakdown
            };
            const checkoutResponse = await createCheckoutSession(checkoutPayload).unwrap();

            // Clear cart after successful payment session creation
            localStorage.removeItem('cart');

            // Redirect to Stripe checkout
            const checkoutUrl = checkoutResponse?.data?.url || checkoutResponse?.url || checkoutResponse?.data?.checkoutUrl;
            if (checkoutUrl) {
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            } else {
                throw new Error('Checkout URL not received from server');
            }
        } catch (error: any) {
            console.error('Failed to process order:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to process order. Please try again.'
            toast.error(errorMessage)
        }
    }

    // Handle modal confirmation
    const handleModalConfirm = (completeAddress: AddressData) => {
        // Update user data and proceed with order
        setIsModalOpen(false);
        processOrder(completeAddress);
    }
    // --- END BUY NOW FUNCTIONALITY ---
    // --- END BUY NOW FUNCTIONALITY ---

    const handleWishlist = async () => {
        if (wishlistPending || !product?._id) {
            return;
        }

        setWishlistPending(true);

        try {
            // Get current wishlist from localStorage
            const savedWishlist = localStorage.getItem("wishlist");
            const wishlistProducts = savedWishlist ? JSON.parse(savedWishlist) : [];

            if (isWishlisted) {
                // Remove from wishlist
                const updatedWishlist = wishlistProducts.filter((p: any) => p._id !== product._id);
                localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                setIsWishlisted(false);
                toast.success("Removed from wishlist");
                // Dispatch event to update navbar
                window.dispatchEvent(new Event('wishlistUpdated'));
            } else {
                // Add to wishlist - save complete product information
                wishlistProducts.push(product);
                localStorage.setItem("wishlist", JSON.stringify(wishlistProducts));
                setIsWishlisted(true);
                toast.success("Added to wishlist!");
                // Dispatch event to update navbar
                window.dispatchEvent(new Event('wishlistUpdated'));
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to update wishlist");
        } finally {
            setWishlistPending(false);
        }
    }

    const handleShareProduct = async () => {
        if (!product) {
            toast.error("Product not loaded yet")
            return
        }

        setSharePending(true)

        try {
            const shareUrl = window.location.href
            const shareData = {
                title: product.title || "Product",
                text: `Check out this product: ${product.title || "Item"}`,
                url: shareUrl,
            }

            if (navigator.share) {
                await navigator.share(shareData)
                toast.success("Product link shared")
                return
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl)
                toast.success("Product URL copied to clipboard")
                return
            }

            const tempInput = document.createElement("textarea")
            tempInput.value = shareUrl
            document.body.appendChild(tempInput)
            tempInput.select()
            document.execCommand("copy")
            document.body.removeChild(tempInput)
            toast.success("Product URL copied to clipboard")
        } catch (error: any) {
            if (error?.name === "AbortError") {
                return
            }
            toast.error("Unable to share product URL")
        } finally {
            setSharePending(false)
        }
    }

    const updateZoomFromCoordinates = (clientX: number, clientY: number) => {
        if (!imageContainerRef.current || !images?.length) return

        const rect = imageContainerRef.current.getBoundingClientRect()
        const x = clientX - rect.left
        const y = clientY - rect.top

        const clampedX = Math.max(0, Math.min(x, rect.width))
        const clampedY = Math.max(0, Math.min(y, rect.height))

        const xPercent = (clampedX / rect.width) * 100
        const yPercent = (clampedY / rect.height) * 100
        const boundedX = Math.max(8, Math.min(xPercent, 92))
        const boundedY = Math.max(8, Math.min(yPercent, 92))

        setLensPosition({ x: clampedX, y: clampedY })
        setZoomPosition({ x: boundedX, y: boundedY })
    }

    const handleZoomMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchDevice) return
        updateZoomFromCoordinates(event.clientX, event.clientY)
    }

    const handleZoomTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!images?.length) return
        const touch = event.touches[0]
        if (!touch) return
        setIsZoomActive(true)
        updateZoomFromCoordinates(touch.clientX, touch.clientY)
    }

    const handleZoomTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!isZoomActive) return
        const touch = event.touches[0]
        if (!touch) return
        updateZoomFromCoordinates(touch.clientX, touch.clientY)
    }

    // Review submit handler
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText || !reviewRating) {
            toast.error("Please provide rating and review text.");
            return;
        }
        setReviewLoading(true);
        try {
            const res = await createReview({
                productId: id as string,
                rating: Number(reviewRating),
                review: reviewText,
            }).unwrap();
            toast.success(res?.data?.message || "Review submitted!");
            setReviewText("");
            setReviewRating(0);
            if (refetchReviews) {
                refetchReviews();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit review");
        } finally {
            setReviewLoading(false);
        }
    }

    return (
        <>
            <MissingInfoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
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
            {isLoading ? <ProductSkeleton /> :
                <div className="min-h-screen ">
                    {/* Breadcrumb */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-700 font-medium">
                        <span>Home</span>
                        <span className="mx-2">/</span>
                        <span>Category</span>
                        <span className="mx-2">/</span>
                        <span className="text-black font-medium">Sub-category</span>
                    </div>

                    {/* Main Product Section */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                            {/* Image Gallery */}
                            <div className="relative flex flex-col gap-4">
                                {/* Main Image */}
                                <div
                                    ref={imageContainerRef}
                                    onMouseEnter={() => !isTouchDevice && images.length > 0 && setIsZoomActive(true)}
                                    onMouseLeave={() => !isTouchDevice && setIsZoomActive(false)}
                                    onMouseMove={handleZoomMouseMove}
                                    onTouchStart={handleZoomTouchStart}
                                    onTouchMove={handleZoomTouchMove}
                                    className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/5] cursor-zoom-in"
                                >
                                    <Image src={images[mainImage] || "/placeholder.svg"} alt="Product" className="w-full h-full object-cover" fill />
                                    {images.length > 0 && (
                                        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md">
                                            {isTouchDevice ? "Tap image to zoom" : "Hover to zoom"}
                                        </div>
                                    )}
                                    {isZoomActive && images.length > 0 && (
                                        <div
                                            className="hidden lg:block pointer-events-none absolute h-24 w-24 rounded-full border-2 border-white/80 ring-1 ring-black/10 bg-white/15 shadow-sm"
                                            style={{
                                                insetInlineStart: `${lensPosition.x}px`,
                                                insetBlockStart: `${lensPosition.y}px`,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        />
                                    )}
                                    <button
                                        onClick={handleShareProduct}
                                        disabled={sharePending}
                                        title="Share product"
                                        aria-label="Share product"
                                        className="absolute top-4 right-16 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Share2 size={22} className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={handleWishlist}
                                        disabled={wishlistPending}
                                        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
                                    </button>
                                    <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-black">
                                        {mainImage + 1} of {images.length}
                                    </div>
                                    {isTouchDevice && images.length > 0 && (
                                        <button
                                            onClick={() => setIsZoomActive((prev) => !prev)}
                                            className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-black"
                                        >
                                            {isZoomActive ? "Close zoom" : "Zoom"}
                                        </button>
                                    )}
                                </div>

                                {isZoomActive && images.length > 0 && (
                                    <div
                                        className="hidden lg:block pointer-events-none absolute z-20 top-0 left-full ml-5 w-[360px] h-[430px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden transition-opacity duration-150"
                                        style={{
                                            backgroundImage: `url(${images[mainImage] || "/placeholder.svg"})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "240% 240%",
                                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        }}
                                    />
                                )}

                                {isZoomActive && images.length > 0 && (
                                    <div
                                        className="lg:hidden relative w-full aspect-[4/5] rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${images[mainImage] || "/placeholder.svg"})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "240% 240%",
                                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        }}
                                    />
                                )}

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 gap-3">
                                    {product?.image?.map((thumb: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setMainImage(idx)
                                                setIsZoomActive(false)
                                            }}
                                            className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${mainImage === idx ? "border-amber-500" : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <Image
                                                src={thumb || ""}
                                                alt={`View ${idx + 1}`}
                                                fill
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex flex-col gap-6">
                                {/* Title and Rating */}
                                <div>
                                    <Link href={`/seller_profile?id=${product?.userId}`} className="text-[#1877F2] font-medium hover:underline">Visit the {product?.brand} store</Link>
                                    <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">
                                        {product?.title || "Product Title"}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={i < (product?.rating || 0) ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-[#1877F2]">{product?.rating || 0} Ratings</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="">
                                    <div className="text-3xl font-bold text-black mb-2">${product?.price || 0}</div>
                                    <p className="text-gray-700 font-medium">500+ sold in the last 30 days</p>
                                </div>

                                {/* Customization */}
                                <div className="space-y-4">
                                    {/* Size Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-3">Size</label>
                                        <div className="grid grid-cols-6 gap-2">
                                            {sizes?.map((size: any) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`py-2 px-3 rounded-lg border-2 font-medium text-sm transition-all ${selectedSize === size
                                                        ? "border-[#F2C94C] text-[#000000]"
                                                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-black mb-3">Color</label>
                                        <div className="flex gap-3 flex-wrap">
                                            {product?.color?.map((color: string) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-6 py-2.5 rounded-lg border-2 font-medium text-sm capitalize transition-all ${selectedColor === color
                                                        ? "border-[#29845A] bg-[#29845A] text-white"
                                                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Specifications */}
                                <div className="">
                                    <h3 className="font-semibold text-lg text-black mb-3">Specifications</h3>
                                    <div className="grid grid-cols-1 gap-3 text-base">
                                        <div>
                                            <span className="text-sm font-semibold">Brand:</span>
                                            <span className="ml-2 font-medium text-gray-800">{product?.brand}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold">SKU:</span>
                                            <span className="ml-2 font-medium text-gray-800">{product?.sku}</span>
                                        </div>
                                        {product?.fabricType && (
                                            <div>
                                                <span className="text-sm font-semibold">Fabric type:</span>
                                                <span className="ml-2 font-medium text-gray-800">{product?.frbricType}</span>
                                            </div>
                                        )}
                                        {product?.closureType && (
                                            <div>
                                                <span className="text-sm font-semibold">Closure type:</span>
                                                <span className="ml-2 font-medium text-gray-800">{product?.closureType}</span>
                                            </div>
                                        )}
                                        {product?.origin && (
                                            <div>
                                                <span className="text-sm font-semibold">Origin:</span>
                                                <span className="ml-2 font-medium text-gray-800">{product?.origin}</span>
                                            </div>
                                        )}
                                        {product?.carrier && (
                                            <div>
                                                <span className="text-sm font-semibold">Carrier:</span>
                                                <span className="ml-2 font-medium text-gray-800">{product?.carrier}</span>
                                            </div>
                                        )}
                                        {product?.careInsturction && (
                                            <div>
                                                <span className="text-sm font-semibold">Care Instructions:</span>
                                                <span className="ml-2 font-medium text-gray-800">{product?.careInsturction}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className=" border-t border-gray-200 pt-8">
                                    <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                                    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed space-y-4">
                                        <p>
                                            {product?.des}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-white shadow-sm h-fit">
                                <div className="rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                        <h1 className="text-2xl font-bold text-black">Ebakx-Fast Pass</h1>
                                    </div>

                                    <div className="px-4 py-3 border-b border-gray-200 bg-white">
                                        <div className="text-3xl font-bold text-black mb-1">${product?.price || 0}</div>
                                        <div className="text-sm text-primary font-medium">
                                            {product?.inStock ? `In stock: ${product?.count || 0} items` : 'Out of stock'}
                                        </div>

                                        {/* Price Breakdown */}
                                        {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-700">Price × {quantity}:</span>
                                                <span className="font-medium text-black">${((product?.price || 0) * quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-700">Tax (7%):</span>
                                                <span className="font-medium text-black">${(((product?.price || 0) * quantity) * 0.07).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-700">Shipping:</span>
                                                <span className="font-medium text-black">${(product?.shippingCost || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 flex justify-between">
                                                <span className="font-semibold text-black">Total:</span>
                                                <span className="font-bold text-black text-lg">
                                                    ${(((product?.price || 0) * quantity) + (((product?.price || 0) * quantity) * 0.07) + (product?.shippingCost || 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div> */}

                                        <div className="space-y-3 mt-4">
                                            <div className="rounded-lg border border-gray-200 p-3">
                                                <div className="flex items-center justify-between gap-2 text-sm font-semibold text-black mb-2">
                                                    <span>Item Quantity</span>
                                                    <span>{quantity}</span>
                                                </div>
                                                <div className="flex items-center justify-between border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityChange(quantity - 1)}
                                                        className="p-2 text-gray-600 hover:text-black"
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                                                        className="w-12 text-center border-0 outline-none font-semibold text-black"
                                                        min="1"
                                                        max="10"
                                                    />
                                                    <button
                                                        onClick={() => handleQuantityChange(quantity + 1)}
                                                        className="p-2 text-gray-600 hover:text-black"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                <button
                                                    onClick={handleAddToBag}
                                                    className="bg-yellow-500 hover:bg-yellow/90 text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    Add to bag
                                                </button>
                                                <button
                                                    onClick={handleSubmitOrder}
                                                    className="border-2 border-gray-300 bg-yellow-500 hover:bg-yellow/90 hover:border-gray-400 text-black font-semibold py-3 px-4 rounded-lg transition-colors"
                                                >
                                                    Buy now
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-200">
                                        <div className="flex items-start gap-3 px-4 py-3">
                                            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#29845A]/15 text-[#29845A]">
                                                <Check size={14} />
                                            </span>
                                            <div>
                                                <p className="text-lg font-bold text-black leading-tight">FREE 2-Day Shipping</p>
                                                <span className="text-gray-600 text-sm">for members</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 px-4 py-3">
                                            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#29845A]/15 text-[#29845A]">
                                                <Check size={14} />
                                            </span>
                                            <div>
                                                <p className="text-lg font-bold text-black leading-tight">Sold and Shipped by</p>
                                                <span className="text-gray-600 text-sm">Ebakx Warehouse</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 px-4 py-3">
                                            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#29845A]/15 text-[#29845A]">
                                                <Check size={14} />
                                            </span>
                                            <div>
                                                <p className="text-lg font-bold text-black leading-tight">30-Day Return Policy</p>
                                                <span className="text-gray-600 text-sm">{product?.return}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                                        <Link
                                            href="/auth/register"
                                            className="block w-full rounded-lg bg-[#29845A] text-white text-2xl font-bold py-2.5 hover:bg-[#236f4c] transition-colors text-center"
                                        >
                                            Join now
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-5">
                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="text-[#FF9F13] w-6 h-6 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-black">Payment Method</p>
                                                <div className="text-gray-600 text-sm mt-1">
                                                    <Method />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>
                                    <p className="text-sm text-gray-700 font-medium mt-1">Real feedback from verified buyers</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsReviewSectionOpen((prev) => !prev)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
                                    aria-label={isReviewSectionOpen ? "Close reviews" : "Open reviews"}
                                    title={isReviewSectionOpen ? "Close reviews" : "Open reviews"}
                                >
                                    {isReviewSectionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>

                            {isReviewSectionOpen && (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                                    <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">Average Rating</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-2xl font-bold text-black">{averageReviewRating.toFixed(1)}</span>
                                                        <div className="flex gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={15}
                                                                    className={i < Math.round(averageReviewRating) ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                                    <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">Total Reviews</p>
                                                    <p className="mt-1 text-2xl font-bold text-black">{totalReviews}</p>
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-gray-200 bg-white px-4 sm:px-6 shadow-sm">
                                                <div className="divide-y divide-gray-200">
                                                    {reviewList.length > 0 ? (
                                                        reviewList.map((review: any) => (
                                                            <article key={review._id} className="py-5 flex gap-4 items-start">
                                                                <Image
                                                                    src={review.userId?.image || "/placeholder.svg"}
                                                                    alt="User"
                                                                    width={48}
                                                                    height={48}
                                                                    className="rounded-full object-cover border border-gray-200"
                                                                />
                                                                <div className="flex-1">
                                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                                        <div>
                                                                            <p className="font-semibold text-black break-all">{review.userId?.email}</p>
                                                                            <span className="inline-flex mt-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">Verified Buyer</span>
                                                                        </div>
                                                                        <span className="text-xs text-gray-600 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <div className="flex gap-1 mb-2">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                size={16}
                                                                                className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <p className="text-gray-800 font-medium leading-relaxed">{review.review}</p>
                                                                </div>
                                                            </article>
                                                        ))
                                                    ) : (
                                                        <div className="py-10 text-center">
                                                            <p className="text-gray-800 font-semibold">No reviews yet</p>
                                                            <p className="text-sm text-gray-600 mt-1">Be the first to share your experience.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {reviewData?.data?.meta && reviewData.data.meta.total > 10 && (
                                                <div className="flex justify-center items-center gap-2 mt-4">
                                                    <button
                                                        className="px-3 py-1.5 rounded-md border bg-gray-100 text-gray-800 disabled:opacity-50"
                                                        disabled={page <= 1}
                                                        onClick={() => setPage(page - 1)}
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-sm font-medium text-gray-800">Page {page} of {Math.ceil(reviewData.data.meta.total / 10)}</span>
                                                    <button
                                                        className="px-3 py-1.5 rounded-md border bg-gray-100 text-gray-800 disabled:opacity-50"
                                                        disabled={page >= Math.ceil(reviewData.data.meta.total / 10)}
                                                        onClick={() => setPage(page + 1)}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <aside className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 h-fit">
                                            <h3 className="text-lg font-semibold text-black mb-1">Write a Review</h3>
                                            <p className="text-sm text-gray-700 font-medium mb-4">Tell others what you liked or disliked about this product.</p>
                                            <form onSubmit={handleReviewSubmit}>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Rating</label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                type="button"
                                                                key={star}
                                                                onClick={() => setReviewRating(star)}
                                                                className="focus:outline-none"
                                                            >
                                                                <Star
                                                                    size={24}
                                                                    className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-semibold text-gray-800 mb-2">Review</label>
                                                    <textarea
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-black placeholder:text-gray-500"
                                                        rows={5}
                                                        value={reviewText}
                                                        onChange={e => setReviewText(e.target.value)}
                                                        placeholder="Share your experience..."
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
                                                    disabled={reviewLoading}
                                                >
                                                    {reviewLoading ? "Submitting..." : "Submit Review"}
                                                </button>
                                            </form>
                                        </aside>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}