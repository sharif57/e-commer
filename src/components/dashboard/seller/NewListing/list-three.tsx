
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StepThreeProps {
    data: any
    onChange: (data: any) => void
    onNext: () => void
    onPrevious: () => void
}

export default function ListThree({ data, onChange, onNext, onPrevious }: StepThreeProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [colorInput, setColorInput] = useState("")
    const [returnEnabled, setReturnEnabled] = useState(!!data.return)

    const measurements = ["S", "M", "L", "XL", "XXL"]
    const selectedSizes = Array.isArray(data.size) ? data.size : []
    const colors = Array.isArray(data.color) ? data.color : []
    const isEmpty = (value: any) => value === undefined || value === null || String(value).trim() === ""

    const validateStep = () => {
        const newErrors: Record<string, string> = {}

        if (isEmpty(data.title)) newErrors.title = "Product title is required"
        if (!selectedSizes.length) newErrors.size = "At least one product size is required"
        if (!colors.length) newErrors.color = "At least one product color is required"
        if (isEmpty(data.brand)) newErrors.brand = "Brand is required"
        if (isEmpty(data.fabric)) newErrors.fabric = "Fabric type is required"
        if (isEmpty(data.care)) newErrors.care = "Care instructions are required"
        if (isEmpty(data.origin)) newErrors.origin = "Origin is required"
        if (isEmpty(data.closure)) newErrors.closure = "Closure type is required"
        if (isEmpty(data.sku)) newErrors.sku = "SKU is required"
        if (isEmpty(data.stock)) newErrors.stock = "Stock quantity is required"
        if (isEmpty(data.price)) newErrors.price = "Price is required"
        if (isEmpty(data.description)) newErrors.description = "Description is required"
        if (!returnEnabled) newErrors.return = "7 days return policy is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleContinue = () => {
        if (validateStep()) {
            onNext()
        }
    }

    const handleAddColor = () => {
        if (colorInput.trim() !== "" && !colors.includes(colorInput.trim())) {
            onChange({ color: [...colors, colorInput.trim()] })
            setColorInput("")
        }
    }

    const handleRemoveColor = (colorToRemove: string) => {
        onChange({ color: colors.filter((c: string) => c !== colorToRemove) })
    }

    const handleToggleSize = (size: string) => {
        if (selectedSizes.includes(size)) {
            onChange({ size: selectedSizes.filter((s: string) => s !== size) })
        } else {
            onChange({ size: [...selectedSizes, size] })
        }
    }

    const handleReturnToggle = (checked: boolean) => {
        setReturnEnabled(checked)
        onChange({ return: checked ? "7 days return available" : "" })
        if (checked) {
            setErrors((prev) => {
                const nextErrors = { ...prev }
                delete nextErrors.return
                return nextErrors
            })
        }
    }

    return (
        <div className="max-w-3xl mx-auto">

            {/* Header */}
            <div className="flex justify-end items-center gap-6 mb-8">
                <Button
                    variant="link"
                    onClick={onPrevious}
                    className="text-gray-600 flex items-center gap-2 hover:text-gray-900 font-medium text-sm"
                >
                    <ArrowLeft /> Back
                </Button>

                <button
                    onClick={handleContinue}
                    className="group px-6 py-2.5 flex items-center justify-center gap-2 bg-primary text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                    Continue
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>

            <div className="bg-[#0000000F] rounded-lg p-8 space-y-6">

                <h1 className="text-xl font-bold text-gray-900 mb-8">
                    Enter your product details to reach more customers
                </h1>

                {/* Product Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Title</label>
                    <input
                        type="text"
                        placeholder="Enter your product title"
                        value={data.title}
                        onChange={(e) => onChange({ title: e.target.value })}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Product Size (Multiple Selection) */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Size (Select Multiple)</label>

                    <div className="flex flex-wrap gap-2">
                        {measurements.map((size) => (
                            <Badge
                                key={size}
                                onClick={() => handleToggleSize(size)}
                                className={`cursor-pointer font-semibold text-sm px-3 py-1 
                                    ${selectedSizes.includes(size)
                                        ? "bg-[#F2C94C] text-gray-900"
                                        : "bg-[#0000000F] text-gray-900"
                                    }
                                `}
                            >
                                {size}
                            </Badge>
                        ))}
                    </div>
                    {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
                </div>

                {/* Colors */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-900">Available Product Colors</label>

                        <div className="flex items-center gap-2 text-[#29845A] font-medium cursor-pointer" onClick={handleAddColor}>
                            <Plus size={16} />
                            <p>Add Color</p>
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="E.g. Red"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddColor()}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    />

                    {/* Color Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {colors.map((c: string, i: number) => (
                            <Badge key={i} className="bg-[#F2C94C] text-gray-900 font-semibold text-sm relative group">
                                {c}
                                <button
                                    onClick={() => handleRemoveColor(c)}
                                    className="ml-2 text-gray-700 hover:text-red-600"
                                >
                                    ×
                                </button>
                            </Badge>
                        ))}
                    </div>
                    {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Brand</label>
                    <select
                        value={data.brand}
                        onChange={(e) => onChange({ brand: e.target.value })}
                        className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select…</option>
                        <option value="GUCCI">GUCCI</option>
                        <option value="NIKE">NIKE</option>
                        <option value="No Brand">No Brand</option>
                    </select>
                    {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}

                    <div className="flex justify-between items-center mt-3">
                        <h3 className="text-sm font-medium">Product has no brand</h3>
                        <Switch />
                    </div>
                </div>

                {/* Fabric Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Fabric Type</label>
                    <input
                        type="text"
                        placeholder="100% Polyester"
                        value={data.fabric}
                        onChange={(e) => onChange({ fabric: e.target.value })}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.fabric && <p className="text-red-500 text-xs mt-1">{errors.fabric}</p>}
                </div>

                {/* Care Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Care Instructions</label>
                    <select
                        value={data.care}
                        onChange={(e) => onChange({ care: e.target.value })}
                        className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select…</option>
                        <option value="Machine wash">Machine wash</option>
                        <option value="Dry clean">Dry clean</option>
                        <option value="Hand wash">Hand wash</option>
                    </select>
                    {errors.care && <p className="text-red-500 text-xs mt-1">{errors.care}</p>}
                </div>

                {/* Origin */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Origin</label>
                    <select
                        value={data.origin}
                        onChange={(e) => onChange({ origin: e.target.value })}
                        className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select…</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="China">China</option>
                        <option value="India">India</option>
                    </select>
                    {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
                </div>

                {/* Closure Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Closure Type</label>
                    <select
                        value={data.closure}
                        onChange={(e) => onChange({ closure: e.target.value })}
                        className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select…</option>
                        <option value="Zipper">Zipper</option>
                        <option value="Button">Button</option>
                        <option value="No Closure">No Closure</option>
                    </select>
                    {errors.closure && <p className="text-red-500 text-xs mt-1">{errors.closure}</p>}
                </div>

                {/* SKU */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">SKU</label>
                    <input
                        type="text"
                        placeholder="e.g. TSHIRT-2025-001"
                        value={data.sku || ""}
                        onChange={(e) => onChange({ sku: e.target.value })}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Quantity in Stock</label>
                    <input
                        type="number"
                        placeholder="Enter quantity"
                        value={data.stock}
                        onChange={(e) => onChange({ stock: e.target.value })}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    // {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Price</label>
                    <input
                        type="number"
                        placeholder="$"
                        value={data.price}
                        onChange={(e) => onChange({ price: e.target.value })}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <Textarea
                        placeholder="Write your product description"
                        value={data.description}
                        onChange={(e) => onChange({ description: e.target.value })}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Return Policy Switch */}
                <div className="bg-white p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">7 Days return policy available for this product</h3>
                        <Switch checked={returnEnabled} onCheckedChange={handleReturnToggle} />
                    </div>
                    {errors.return && <p className="text-red-500 text-xs mt-1">{errors.return}</p>}
                </div>
            </div>
        </div>
    )
}
