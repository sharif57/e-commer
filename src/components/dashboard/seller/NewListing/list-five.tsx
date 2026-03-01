/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateProductDraftMutation, useCreateProductMutation } from "@/redux/feature/seller/productSellerSlice"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ListFive({ data, onChangeStep, onChange, onNext, onPrevious }: any) {
    const router = useRouter();
    const [showMore, setShowMore] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    console.log("Review Data:", data)

    const categoryLabel = data.category || data.categoryName || data.categoryTitle || data.categoryId || "N/A"
    const subCategoryLabel = data.subcategory || data.subCategory || data.subCategoryName || data.subCategoryTitle || data.subCategoryId || "N/A"
    const deliveryInside = data.deliveryInside ?? data.deliveryChargeInDc ?? ""
    const deliveryOutside = data.deliveryOutside ?? data.deliveryChargeOutOfDc ?? ""

    const [createProductDraft] = useCreateProductDraftMutation();

    const [createProduct] = useCreateProductMutation();

    const handlePublish = async () => {
        try {
            setIsPublishing(true)

            // Validate required fields with specific error messages
            const missingFields: string[] = []

            if (!data.title || data.title.trim() === "") missingFields.push("Title")
            if (!data.price || data.price <= 0) missingFields.push("Price")
            if (!data.categoryId) missingFields.push("Category")
            if (!data.subCategoryId) missingFields.push("Subcategory")
            if (!data.closureType && !data.closure) missingFields.push("Closure Type")
            if (!data.origin) missingFields.push("Origin")

            if (missingFields.length > 0) {
                alert(`Please fill in the following required fields:\n• ${missingFields.join("\n• ")}`)
                setIsPublishing(false)
                return
            }

            // Build payload with only non-empty fields
            const payload: any = {
                title: String(data.title),
                price: Number(data.price),
                categoryId: String(data.categoryId),
                subCategoryId: String(data.subCategoryId),
                closureType: (data.closureType || data.closure || "").trim(),
                origin: (data.origin || "").trim(),
            }

            // Add optional fields only if they have values
            if (data.brand && data.brand.trim() !== "") payload.brand = data.brand
            if (data.sku && data.sku.trim() !== "") payload.sku = data.sku
            if (data.description || data.des) {
                const desc = (data.description || data.des).trim()
                if (desc) payload.des = desc
            }
            if (data.return && data.return.trim() !== "") payload.return = data.return

            const deliveryInDc = data.deliveryChargeInDc ?? data.deliveryInside
            if (deliveryInDc && deliveryInDc !== "") payload.deliveryChargeInDc = String(deliveryInDc)

            const deliveryOutDc = data.deliveryChargeOutOfDc ?? data.deliveryOutside
            if (deliveryOutDc && deliveryOutDc !== "") payload.deliveryChargeOutOfDc = String(deliveryOutDc)

            if (data.carrier && data.carrier.trim() !== "") payload.carrier = data.carrier

            const closure = data.closureType || data.closure
            if (closure && closure.trim() !== "") payload.closureType = closure

            if (data.origin && data.origin.trim() !== "") payload.origin = data.origin

            const care = data.careInsturction || data.care
            if (care && care.trim() !== "") payload.careInsturction = care

            const fabric = data.frbricType || data.fabric
            if (fabric && fabric.trim() !== "") payload.frbricType = fabric

            // Add arrays only if they have items
            const sizes = Array.isArray(data.size) && data.size.length > 0
                ? data.size
                : Array.isArray(data.measurement) && data.measurement.length > 0
                    ? data.measurement
                    : []
            if (sizes.length > 0) payload.size = sizes

            const colors = Array.isArray(data.color) && data.color.length > 0
                ? data.color
                : Array.isArray(data.colors) && data.colors.length > 0
                    ? data.colors
                    : []
            if (colors.length > 0) payload.color = colors

            // Collect images as array
            const images: File[] = []
            if (Array.isArray(data.files) && data.files.length > 0) {
                data.files.forEach((f: any) => {
                    if (f?.file instanceof File) {
                        images.push(f.file)
                    }
                })
            }

            // Create FormData
            const formData = new FormData()
            formData.append('data', JSON.stringify(payload))

            // Append all images
            if (images.length > 0) {
                images.forEach((img) => {
                    formData.append('image', img)
                })
            }

            // Trigger create product mutation
            const result: any = await createProduct(formData).unwrap()
            
            router.push('/dashboard/inventory');
            setIsPublishing(false)
            toast.success( result?.data?.message || "Product published successfully!")
            console.log("Product published successfully:", result)
            // alert("Product published successfully!")

            // Move to next step or reset
            if (onNext) onNext()
        } catch (err: any) {
            setIsPublishing(false)
            console.error("Publish error:", err)

            // Better error handling
            const errorMessage =
                err?.data?.message ||
                err?.message ||
                "Failed to publish product. Please try again."

            alert(errorMessage)
        }
    }

    const handleDraft = async () => {
        try {
            setIsPublishing(true)

            // Validate required fields with specific error messages
            const missingFields: string[] = []

            if (!data.title || data.title.trim() === "") missingFields.push("Title")
            if (!data.price || data.price <= 0) missingFields.push("Price")
            if (!data.categoryId) missingFields.push("Category")
            if (!data.subCategoryId) missingFields.push("Subcategory")
            if (!data.closureType && !data.closure) missingFields.push("Closure Type")
            if (!data.origin) missingFields.push("Origin")

            if (missingFields.length > 0) {
                toast.error(`Please fill in the following required fields:\n• ${missingFields.join("\n• ")}`)
                setIsPublishing(false)
                return
            }

            // Build payload with only non-empty fields
            const payload: any = {
                title: String(data.title),
                price: Number(data.price),
                categoryId: String(data.categoryId),
                subCategoryId: String(data.subCategoryId),
                closureType: (data.closureType || data.closure || "").trim(),
                origin: (data.origin || "").trim(),
            }

            // Add optional fields only if they have values
            if (data.brand && data.brand.trim() !== "") payload.brand = data.brand
            if (data.sku && data.sku.trim() !== "") payload.sku = data.sku
            if (data.description || data.des) {
                const desc = (data.description || data.des).trim()
                if (desc) payload.des = desc
            }
            if (data.return && data.return.trim() !== "") payload.return = data.return

            const deliveryInDc = data.deliveryChargeInDc ?? data.deliveryInside
            if (deliveryInDc && deliveryInDc !== "") payload.deliveryChargeInDc = String(deliveryInDc)

            const deliveryOutDc = data.deliveryChargeOutOfDc ?? data.deliveryOutside
            if (deliveryOutDc && deliveryOutDc !== "") payload.deliveryChargeOutOfDc = String(deliveryOutDc)

            if (data.carrier && data.carrier.trim() !== "") payload.carrier = data.carrier

            const closure = data.closureType || data.closure
            if (closure && closure.trim() !== "") payload.closureType = closure

            if (data.origin && data.origin.trim() !== "") payload.origin = data.origin

            const care = data.careInsturction || data.care
            if (care && care.trim() !== "") payload.careInsturction = care

            const fabric = data.frbricType || data.fabric
            if (fabric && fabric.trim() !== "") payload.frbricType = fabric

            // Add arrays only if they have items
            const sizes = Array.isArray(data.size) && data.size.length > 0
                ? data.size
                : Array.isArray(data.measurement) && data.measurement.length > 0
                    ? data.measurement
                    : []
            if (sizes.length > 0) payload.size = sizes

            const colors = Array.isArray(data.color) && data.color.length > 0
                ? data.color
                : Array.isArray(data.colors) && data.colors.length > 0
                    ? data.colors
                    : []
            if (colors.length > 0) payload.color = colors

            // Collect images as array
            const images: File[] = []
            if (Array.isArray(data.files) && data.files.length > 0) {
                data.files.forEach((f: any) => {
                    if (f?.file instanceof File) {
                        images.push(f.file)
                    }
                })
            }

            // Create FormData
            const formData = new FormData()
            formData.append('data', JSON.stringify(payload))

            // Append all images
            if (images.length > 0) {
                images.forEach((img) => {
                    formData.append('image', img)
                })
            }

            // Trigger create product mutation
            const result: any = await createProductDraft(formData).unwrap()
            router.push('/dashboard/draft');
            setIsPublishing(false)
            console.log("Product published successfully:", result)
            toast.success( result?.data?.message || "Product draft add!")

            // Move to next step or reset
            if (onNext) onNext()
        } catch (err: any) {
            setIsPublishing(false)
            console.error("Publish error:", err)

            // Better error handling
            const errorMessage =
                err?.data?.message ||
                err?.message ||
                "Failed to publish product. Please try again."

            toast.error(errorMessage)
        }
    }

    return (
        <div>
            <div className="flex justify-end items-center gap-6 mb-8">
                <Button
                    onClick={handleDraft}
                    disabled={isPublishing}
                    variant="link"
                    className="text-gray-600 flex items-center gap-2 hover:text-gray-900 font-medium text-sm"
                >
                    Save to Draft
                </Button>

                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="group px-6 py-2.5 flex items-center justify-center gap-2 bg-primary text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                    {isPublishing ? "Publishing..." : "Publish"}
                </button>
            </div>
            <div className="max-w-4xl mx-auto bg-[#0000000F] p-6 rounded-2xl shadow-sm">

                {/* Title */}
                <h1 className="text-xl font-semibold mb-6">
                    Review before publish your product live
                </h1>

                {/* ---------- CATEGORY SECTION ----------- */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="font-semibold text-sm mb-1">Product Category</h2>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-gray-800">{categoryLabel}</p>

                        <p className="text-sm text-gray-600 mt-2">Subcategory</p>
                        <p className="text-gray-800">{subCategoryLabel}</p>
                    </div>

                    <button
                        className="text-blue-600 font-medium text-sm"
                        onClick={() => onChangeStep(1)}
                    >
                        Change
                    </button>
                </div>

                {/* ---------- COVER IMAGE SECTION ---------- */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="font-semibold text-sm mb-3">Cover Image</h2>

                        <div className="w-28 h-32 rounded-md overflow-hidden border border-gray-300 bg-gray-100">
                            {data.files && data.files.length > 0 ? (
                                (() => {
                                    const coverFile = data.files.find((f: any) => f.id === data.coverPhoto) || data.files[0]
                                    const imageUrl = coverFile?.preview || (coverFile?.file instanceof File ? URL.createObjectURL(coverFile.file) : null)

                                    return imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Cover Photo"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                                    )
                                })()
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image selected</div>
                            )}
                        </div>
                    </div>

                    <button
                        className="text-blue-600 font-medium text-sm"
                        onClick={() => onChangeStep(2)}
                    >
                        Change
                    </button>
                </div>

                {/* ---------- PRODUCT DETAILS SECTION ---------- */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex-1">
                        <h2 className="font-semibold text-sm mb-3">Product Details</h2>

                        <div className="text-sm space-y-2">

                            <div>
                                <p className="text-gray-600">Title</p>
                                <p className="font-medium">{data.title}</p>
                            </div>

                            <div>
                                <p className="text-gray-600">Brand</p>
                                <p className="font-medium">{data.brand}</p>
                            </div>

                            <div>
                                <p className="text-gray-600">Return Policy</p>
                                <p className="font-medium">In 7 Days Return</p>
                            </div>

                            {/* Show more toggle */}
                            <button
                                className="flex items-center gap-1 text-blue-600 text-sm mt-1"
                                onClick={() => setShowMore(!showMore)}
                            >
                                {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {showMore ? "Show less" : "Show more"}
                            </button>

                            {/* Hidden Details */}
                            {showMore && (
                                <div className="space-y-2 pt-3 animate-fadeIn">
                                    <div>
                                        <p className="text-gray-600">Price</p>
                                        <p className="font-medium">${data.price}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">SKU</p>
                                        <p className="font-medium">{data.sku || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Color</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {Array.isArray(data.color) && data.color.length > 0 ? (
                                                data.color.map((c: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium capitalize">
                                                        {c}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-xs">No colors selected</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Size</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {Array.isArray(data.size) && data.size.length > 0 ? (
                                                data.size.map((s: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">
                                                        {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-xs">No sizes selected</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Fabric</p>
                                        <p className="font-medium">{data.fabric || data.frbricType || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Origin</p>
                                        <p className="font-medium">{data.origin || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Care Instructions</p>
                                        <p className="font-medium">{data.care || data.careInsturction || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Closure Type</p>
                                        <p className="font-medium">{data.closure || data.closureType || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-600">Description</p>
                                        <p className="font-medium max-w-sm">{data.description || data.des || "N/A"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="text-blue-600 font-medium text-sm"
                        onClick={() => onChangeStep(3)}
                    >
                        Change
                    </button>
                </div>

                {/* ---------- DELIVERY OPTIONS SECTION ---------- */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="font-semibold text-sm mb-3">Delivery Options</h2>

                        <div className="text-sm space-y-2">
                            <div>
                                <p className="text-gray-600">Delivery Charge</p>
                                <p className="font-medium">
                                    {deliveryInside === "0" || deliveryInside === 0 ? "Free Delivery" : deliveryInside ? `${deliveryInside} USD` : "Not set"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">Carrier</p>
                                <p className="font-medium">{data.carrier}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        className="text-blue-600 font-medium text-sm"
                        onClick={() => onChangeStep(4)}
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>
    )
}
