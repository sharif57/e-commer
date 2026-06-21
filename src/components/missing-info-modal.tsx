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

    const inputBaseClass = "w-full h-11 px-4 text-sm rounded-xl border transition-all duration-200 outline-none bg-white placeholder:text-gray-400"
    const inputNormalClass = "border-black hover:border-black focus:border-primary focus:ring-4 focus:ring-primary/10"
    const inputErrorClass = "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
    const inputDisabledClass = "bg-gray-50 border-black text-gray-500 cursor-not-allowed"

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} aria-hidden="true" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col relative">
                    {/* Header */}
                    <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                                Please provide your valid shipping address to ensure accurate delivery.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all flex-shrink-0 ml-4"
                            aria-label="Close modal"
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="px-6 py-6 space-y-8">
                        {/* Your Basic Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Basic Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name {missingFields.includes("firstName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} ${errors.firstName ? inputErrorClass : inputNormalClass}`}
                                        placeholder="John"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name {missingFields.includes("lastName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} ${errors.lastName ? inputErrorClass : inputNormalClass}`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Address Section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="streetName" className="block text-sm font-medium text-gray-700">
                                        Street Name {missingFields.includes("streetName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="streetName"
                                        type="text"
                                        name="streetName"
                                        value={formData.streetName}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} ${errors.streetName ? inputErrorClass : inputNormalClass}`}
                                        placeholder="123 Main St"
                                    />
                                    {errors.streetName && <p className="text-red-500 text-xs mt-1">{errors.streetName}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                        Apt, Suite, Unit (Optional)
                                    </label>
                                    <input
                                        id="area"
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} ${errors.area ? inputErrorClass : inputNormalClass}`}
                                        placeholder="Apt 4B"
                                    />
                                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City {missingFields.includes("city") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`${inputBaseClass} ${errors.city ? inputErrorClass : inputNormalClass}`}
                                            placeholder="New York"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                            ZIP Code {missingFields.includes("zip") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="zip"
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className={`${inputBaseClass} ${errors.zip ? inputErrorClass : inputNormalClass}`}
                                            placeholder="10001"
                                        />
                                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <input
                                        id="state"
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} ${inputNormalClass}`}
                                        placeholder="NY"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country {missingFields.includes("country") && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className={`w-full h-11 px-4 rounded-xl border flex items-center justify-between bg-gray-50 ${errors.country ? "border-red-500" : "border-black"}`}>
                                        <input
                                            id="country"
                                            type="text"
                                            name="country"
                                            value={deliveryCountryValue}
                                            readOnly
                                            className="w-full text-sm text-gray-500 bg-transparent focus:outline-none cursor-not-allowed"
                                        />
                                        <Lock size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                                    </div>
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Billing Address */}
                        <div>
                            <div
                                className="flex items-center justify-between mb-4 cursor-pointer select-none group"
                                onClick={() => setIsBillingOpen(!isBillingOpen)}
                            >
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Billing Address</h3>
                                <div className={`p-1.5 rounded-full transition-colors ${isBillingOpen ? 'bg-gray-100' : 'bg-transparent group-hover:bg-gray-50'}`}>
                                    <ChevronUp size={20} className={`text-gray-500 transition-transform duration-300 ${isBillingOpen ? "" : "rotate-180"}`} />
                                </div>
                            </div>

                            {isBillingOpen && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <div className="space-y-1.5">
                                        <label htmlFor="billingStreetName" className="block text-sm font-medium text-gray-700">
                                            Street Name
                                        </label>
                                        <input
                                            id="billingStreetName"
                                            type="text"
                                            name="streetName"
                                            value={computedBilling.streetName}
                                            onChange={handleBillingChange}
                                            disabled={billingSameAsDelivery}
                                            className={`${inputBaseClass} ${billingSameAsDelivery ? inputDisabledClass : errors.billingStreetName ? inputErrorClass : inputNormalClass}`}
                                            placeholder="123 Main St"
                                        />
                                        {errors.billingStreetName && <p className="text-red-500 text-xs mt-1">{errors.billingStreetName}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="billingArea" className="block text-sm font-medium text-gray-700">
                                            Apt, Suite, Unit (Optional)
                                        </label>
                                        <input
                                            id="billingArea"
                                            type="text"
                                            name="area"
                                            value={computedBilling.area}
                                            onChange={handleBillingChange}
                                            disabled={billingSameAsDelivery}
                                            className={`${inputBaseClass} ${billingSameAsDelivery ? inputDisabledClass : inputNormalClass}`}
                                            placeholder="Apt 4B"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">
                                                City
                                            </label>
                                            <input
                                                id="billingCity"
                                                type="text"
                                                name="city"
                                                value={computedBilling.city}
                                                onChange={handleBillingChange}
                                                disabled={billingSameAsDelivery}
                                                className={`${inputBaseClass} ${billingSameAsDelivery ? inputDisabledClass : errors.billingCity ? inputErrorClass : inputNormalClass}`}
                                                placeholder="New York"
                                            />
                                            {errors.billingCity && <p className="text-red-500 text-xs mt-1">{errors.billingCity}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700">
                                                ZIP Code
                                            </label>
                                            <input
                                                id="billingZip"
                                                type="text"
                                                name="zip"
                                                value={computedBilling.zip}
                                                onChange={handleBillingChange}
                                                disabled={billingSameAsDelivery}
                                                className={`${inputBaseClass} ${billingSameAsDelivery ? inputDisabledClass : errors.billingZip ? inputErrorClass : inputNormalClass}`}
                                                placeholder="10001"
                                            />
                                            {errors.billingZip && <p className="text-red-500 text-xs mt-1">{errors.billingZip}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <input
                                            id="billingState"
                                            type="text"
                                            name="state"
                                            value={computedBilling.state}
                                            onChange={handleBillingChange}
                                            disabled={billingSameAsDelivery}
                                            className={`${inputBaseClass} ${billingSameAsDelivery ? inputDisabledClass : inputNormalClass}`}
                                            placeholder="NY"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <div className={`w-full h-11 px-4 rounded-xl border flex items-center justify-between bg-gray-50 ${errors.billingCountry ? "border-red-500" : "border-black"}`}>
                                            <input
                                                id="billingCountry"
                                                type="text"
                                                name="country"
                                                value={computedBilling.country?.trim() ? computedBilling.country : "United State"}
                                                readOnly
                                                className="w-full text-sm text-gray-500 bg-transparent focus:outline-none cursor-not-allowed"
                                            />
                                            <Lock size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                                        </div>
                                        {errors.billingCountry && <p className="text-red-500 text-xs mt-1">{errors.billingCountry}</p>}
                                        {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                                    </div>

                                    <label className="flex items-center gap-3 pt-2 cursor-pointer select-none group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={billingSameAsDelivery}
                                                onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white transition-all checked:border-primary checked:bg-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                                            />
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Billing address same as delivery address</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 pb-6 pt-4 sticky bottom-0 bg-white border-t border-gray-100">
                        <button
                            onClick={handleConfirm}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Confirm Address Details
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
