/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface StepThreeProps {
    data: any
    onChange: (data: any) => void
    onNext: () => void
    onPrevious: () => void
}

export default function ListFour({ data, onChange, onNext, onPrevious }: StepThreeProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [freeDelivery, setFreeDelivery] = useState(!!data.freeDelivery)
    const isEmpty = (value: any) => value === undefined || value === null || String(value).trim() === ""
    const toNumberOrEmpty = (value: string) => value === "" ? "" : Number(value)

    const validateStep = () => {
        const newErrors: Record<string, string> = {}

        if (!freeDelivery) {
            if (isEmpty(data.deliveryInside)) newErrors.deliveryInside = "Delivery charge is required"
            if (isEmpty(data.deliveryOutside)) newErrors.deliveryOutside = "Delivery charge is required"
            if (isEmpty(data.shippingCost)) newErrors.shippingCost = "Shipping cost is required"
        }
        if (isEmpty(data.carrier)) newErrors.carrier = "Carrier is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleContinue = () => {
        if (validateStep()) {
            onNext()
        }
    }

    return (
        <div className="max-w-3xl mx-auto">

            <div className="bg-[#0000000F] rounded-lg p-8 space-y-6">

                <h1 className="text-xl font-bold text-gray-900 mb-8">
                    Set delivery options
                </h1>

                {/* Delivery Inside DC */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Delivery Charge in united states
                    </label>
                    <input
                        type="number"
                        placeholder="$"
                        value={data.deliveryInside || ""}
                        onChange={(e) => onChange({ deliveryInside: e.target.value, shippingCost: toNumberOrEmpty(e.target.value) })}
                        disabled={freeDelivery}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {errors.deliveryInside && <p className="text-red-500 text-xs mt-1">{errors.deliveryInside}</p>}
                </div>

                {/* Delivery Outside DC */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Delivery Charge out of United States
                    </label>
                    <input
                        type="number"
                        placeholder="$"
                        value={data.deliveryOutside || ""}
                        onChange={(e) => onChange({ deliveryOutside: e.target.value })}
                        disabled={freeDelivery}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {errors.deliveryOutside && <p className="text-red-500 text-xs mt-1">{errors.deliveryOutside}</p>}
                </div>

                {/* Free Delivery Switch */}
                <div className="bg-white p-2 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Free Shipping This Product </h3>
                        <Switch
                            checked={freeDelivery}
                            onCheckedChange={(checked) => {
                                setFreeDelivery(checked)
                                if (checked) {
                                    onChange({
                                        freeDelivery: checked,
                                        deliveryInside: "",
                                        deliveryOutside: "",
                                        shippingCost: ""
                                    })
                                    setErrors((prev) => {
                                        const nextErrors = { ...prev }
                                        delete nextErrors.deliveryInside
                                        delete nextErrors.deliveryOutside
                                        delete nextErrors.shippingCost
                                        return nextErrors
                                    })
                                } else {
                                    onChange({ freeDelivery: checked })
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Shipping Cost */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Shipping Cost</label>
                    <input
                        type="number"
                        placeholder="$"
                        value={data.shippingCost ?? ""}
                        onChange={(e) => onChange({ shippingCost: toNumberOrEmpty(e.target.value) })}
                        disabled={freeDelivery}
                        className="w-full px-2 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {errors.shippingCost && <p className="text-red-500 text-xs mt-1">{errors.shippingCost}</p>}
                </div>

                {/* Carrier */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Carrier</label>
                    <select
                        value={data.carrier || ""}
                        onChange={(e) => onChange({ carrier: e.target.value })}
                        className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary"
                    >
                        {/* USPS 
DHL
Fedex 
UPS
Car/Person/Delivery */}
                        <option value="">Select…</option>
                        <option value="USPS">USPS</option>
                        <option value="DHL">DHL</option>
                        <option value="FedEx">FedEx</option>
                        <option value="UPS">UPS</option>
                        <option value="Car/Person/Delivery">Car/Person/Delivery</option>
                    </select>
                    {errors.carrier && <p className="text-red-500 text-xs mt-1">{errors.carrier}</p>}

                </div>

            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex justify-end items-center gap-6 mt-8">
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
        </div>
    )
}
