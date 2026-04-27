"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { ChevronUp, Lock, X } from "lucide-react"

interface MissingInfoModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (data: AddressData) => void
    initialData: AddressData
    missingFields: string[]
}

export interface AddressData {
    firstName: string
    lastName: string
    streetName: string
    area: string
    city: string
    zip: string
    state: string
    country: string
    billingAddress: string
}

export default function MissingInfoModal({
    isOpen,
    onClose,
    onConfirm,
    initialData,
    missingFields = [],
}: MissingInfoModalProps) {
    const [formData, setFormData] = useState<AddressData>(initialData)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true)
    const [isBillingOpen, setIsBillingOpen] = useState(true)
    const [billingForm, setBillingForm] = useState({
        streetName: initialData.streetName || "",
        area: initialData.area || "",
        city: initialData.city || "",
        zip: initialData.zip || "",
        state: initialData.state || "",
        country: initialData.country || "United State",
    })

    useEffect(() => {
        setFormData(initialData)
        setBillingForm({
            streetName: initialData.streetName || "",
            area: initialData.area || "",
            city: initialData.city || "",
            zip: initialData.zip || "",
            state: initialData.state || "",
            country: initialData.country || "United State",
        })
        setBillingSameAsDelivery(true)
        setErrors({})
    }, [initialData, isOpen])

    const deliveryCountryValue = useMemo(() => {
        return formData.country?.trim() ? formData.country : "United State"
    }, [formData.country])

    const computedBilling = useMemo(() => {
        if (billingSameAsDelivery) {
            return {
                streetName: formData.streetName,
                area: formData.area,
                city: formData.city,
                zip: formData.zip,
                state: formData.state,
                country: deliveryCountryValue,
            }
        }
        return billingForm
    }, [billingSameAsDelivery, formData, billingForm, deliveryCountryValue])

    const buildBillingAddress = () => {
        const parts = [
            computedBilling.streetName,
            computedBilling.area,
            computedBilling.city,
            computedBilling.zip,
            computedBilling.state,
            computedBilling.country,
        ]
        return parts.filter((part) => part && part.trim()).join(", ")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBillingForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required"
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required"
        }
        if (!formData.streetName.trim()) {
            newErrors.streetName = "Street name is required"
        }
        if (!formData.city.trim()) {
            newErrors.city = "City is required"
        }
        if (!formData.zip.trim()) {
            newErrors.zip = "Zip code is required"
        }
        if (!deliveryCountryValue.trim()) {
            newErrors.country = "Country is required"
        }

        if (!computedBilling.streetName.trim()) {
            newErrors.billingStreetName = "Street name is required"
        }
        if (!computedBilling.city.trim()) {
            newErrors.billingCity = "City is required"
        }
        if (!computedBilling.zip.trim()) {
            newErrors.billingZip = "Zip code is required"
        }
        if (!computedBilling.country.trim()) {
            newErrors.billingCountry = "Country is required"
        }
        if (!buildBillingAddress().trim()) {
            newErrors.billingAddress = "Billing address is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleConfirm = () => {
        if (validateForm()) {
            onConfirm({
                ...formData,
                country: deliveryCountryValue,
                billingAddress: buildBillingAddress(),
            })
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} aria-hidden="true" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 ">
                <div className="bg-[#f3f3f3] rounded-2xl shadow-xl w-full max-w-[390px] max-h-[95vh] overflow-y-auto border border-[#dddddd]">
                    {/* Header */}
                    <div className="flex items-start justify-between px-8 pt-8 pb-4">
                        <div>
                            <h2 className="text-2xl leading-[46px] font-semibold text-[#000000]">Delivery address</h2>
                            <p className="text-[12px] font-normal text-[#000000CC] mt-1 max-w-[320px]">
                                Submit the valid information to make sure your shipping address is correct to delivery your products.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-[#1b1b1b] hover:text-black transition-colors flex-shrink-0 ml-4"
                            aria-label="Close modal"
                        >
                            <X size={20} strokeWidth={2.3} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 pb-6 space-y-7">
                        {/* Your Basic Details Section */}
                        <div>
                            <h3 className="text-[14px]  font-semibold text-[#000000] tracking-[0.02em] mb-4">YOUR BASIC DETAILS</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                        First Name {missingFields.includes("firstName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"
                                            }`}
                                        placeholder="First Name"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                        Last Name {missingFields.includes("lastName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"
                                            }`}
                                        placeholder="Last Name"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-[#d8d8d8]" />

                        {/* Address Section */}
                        <div>
                            <h3 className="text-[14px]  font-semibold text-[#000000] tracking-[0.02em] mb-4">ADDRESS</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="streetName" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                        Street Name {missingFields.includes("streetName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="streetName"
                                        type="text"
                                        name="streetName"
                                        value={formData.streetName}
                                        onChange={handleChange}
                                        className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${errors.streetName ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"
                                            }`}
                                        placeholder="Street Name"
                                    />
                                    {errors.streetName && <p className="text-red-500 text-xs mt-1">{errors.streetName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="area" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                        Apt (Optional)
                                    </label>
                                    <input
                                        id="area"
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${errors.area ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"
                                            }`}
                                        placeholder="Apt"
                                    />
                                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                            City {missingFields.includes("city") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${errors.city ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"
                                                }`}
                                            placeholder="City"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                            ZIP {missingFields.includes("zip") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="zip"
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent ${errors.zip ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"
                                                }`}
                                            placeholder="ZIP"
                                        />
                                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                        State
                                    </label>
                                    <input
                                        id="state"
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full h-[32px] px-3 text-sm rounded-[10px] border border-[#565656] bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
                                        placeholder="State"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                        Country {missingFields.includes("country") && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className={`w-full h-[32px] px-3 rounded-[10px] border flex items-center justify-between bg-[#e8e8e8] ${errors.country ? "border-red-500" : "border-transparent"}`}>
                                        <input
                                            id="country"
                                            type="text"
                                            name="country"
                                            value={deliveryCountryValue}
                                            readOnly
                                            className="w-full text-sm leading-none text-[#666666] bg-transparent focus:outline-none"
                                        />
                                        <Lock size={16} className="text-[#777777] flex-shrink-0" />
                                    </div>
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-[#d8d8d8]" />

                        {/* Billing Address */}
                        <div>
                            <div
                                className="flex items-center justify-between mb-4 cursor-pointer select-none"
                                onClick={() => setIsBillingOpen(!isBillingOpen)}
                            >
                                <h3 className="text-2xl leading-[46px] font-semibold text-[#000000] capitalize">Billing address</h3>
                                <ChevronUp size={20} className={`text-[#555555] transition-transform duration-200 ${isBillingOpen ? "" : "rotate-180"}`} />
                            </div>

                            {isBillingOpen && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="billingStreetName" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                            Street Name
                                        </label>
                                        <input
                                            id="billingStreetName"
                                            type="text"
                                            name="streetName"
                                            value={computedBilling.streetName}
                                            onChange={handleBillingChange}
                                            disabled={billingSameAsDelivery}
                                            className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-[#efefef] disabled:text-[#6d6d6d] ${errors.billingStreetName ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"}`}
                                            placeholder="Street Name"
                                        />
                                        {errors.billingStreetName && <p className="text-red-500 text-xs mt-1">{errors.billingStreetName}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="billingArea" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                            Apt (Optional)
                                        </label>
                                        <input
                                            id="billingArea"
                                            type="text"
                                            name="area"
                                            value={computedBilling.area}
                                            onChange={handleBillingChange}
                                            disabled={billingSameAsDelivery}
                                            className="w-full h-[32px] px-3 text-sm rounded-[10px] border border-[#565656] bg-white focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-[#efefef] disabled:text-[#6d6d6d]"
                                            placeholder="Apt"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="billingCity" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                                City
                                            </label>
                                            <input
                                                id="billingCity"
                                                type="text"
                                                name="city"
                                                value={computedBilling.city}
                                                onChange={handleBillingChange}
                                                disabled={billingSameAsDelivery}
                                                className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-[#efefef] disabled:text-[#6d6d6d] ${errors.billingCity ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"}`}
                                                placeholder="City"
                                            />
                                            {errors.billingCity && <p className="text-red-500 text-xs mt-1">{errors.billingCity}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="billingZip" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                                ZIP
                                            </label>
                                            <input
                                                id="billingZip"
                                                type="text"
                                                name="zip"
                                                value={computedBilling.zip}
                                                onChange={handleBillingChange}
                                                disabled={billingSameAsDelivery}
                                                className={`w-full h-[32px] px-3 text-sm rounded-[10px] border bg-white focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-[#efefef] disabled:text-[#6d6d6d] ${errors.billingZip ? "border-red-500 focus:ring-red-500" : "border-[#565656] focus:ring-green-700"}`}
                                                placeholder="ZIP"
                                            />
                                            {errors.billingZip && <p className="text-red-500 text-xs mt-1">{errors.billingZip}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="billingState" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                            State
                                        </label>
                                        <input
                                            id="billingState"
                                            type="text"
                                            name="state"
                                            value={computedBilling.state}
                                            onChange={handleBillingChange}
                                            disabled={billingSameAsDelivery}
                                            className="w-full h-[32px] px-3 text-sm rounded-[10px] border border-[#565656] bg-white focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-[#efefef] disabled:text-[#6d6d6d]"
                                            placeholder="State"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="billingCountry" className="block text-[13px] leading-none font-medium text-[#000000] mb-2">
                                            Country
                                        </label>
                                        <div className={`w-full h-[32px] px-3 rounded-[10px] border flex items-center justify-between bg-[#e8e8e8] ${errors.billingCountry ? "border-red-500" : "border-transparent"}`}>
                                            <input
                                                id="billingCountry"
                                                type="text"
                                                name="country"
                                                value={computedBilling.country?.trim() ? computedBilling.country : "United State"}
                                                readOnly
                                                className="w-full text-sm leading-none text-[#666666] bg-transparent focus:outline-none"
                                            />
                                            <Lock size={16} className="text-[#777777] flex-shrink-0" />
                                        </div>
                                        {errors.billingCountry && <p className="text-red-500 text-xs mt-1">{errors.billingCountry}</p>}
                                        {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                                    </div>

                                    <label className="flex items-center gap-3 pt-1 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={billingSameAsDelivery}
                                            onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
                                            className="h-4 w-4 rounded border-[#8a8a8a] text-green-700 focus:ring-green-700"
                                        />
                                        <span className="text-sm leading-none font-medium text-[#1d1d1d]">Billing address same as delivery address</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={handleConfirm}
                            className="w-full h-[32px] bg-[#2f8c59] hover:bg-[#267349] text-white text-[14px] leading-[24px] font-medium rounded-[10px] transition-colors"
                        >
                            Confirm changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
