"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

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
        if (!formData.area.trim()) {
            newErrors.area = "Area is required"
        }
        if (!formData.city.trim()) {
            newErrors.city = "City is required"
        }
        if (!formData.zip.trim()) {
            newErrors.zip = "Zip code is required"
        }
        if (!formData.country.trim()) {
            newErrors.country = "Country is required"
        }
        if (!formData.billingAddress.trim()) {
            newErrors.billingAddress = "Billing address is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleConfirm = () => {
        if (validateForm()) {
            onConfirm(formData)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} aria-hidden="true" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Complete Your Information</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                We need your delivery details to process your order. Please fill in the missing information.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 space-y-6">
                        {/* Your Basic Details Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">YOUR BASIC DETAILS</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name {missingFields.includes("firstName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                            }`}
                                        placeholder="First Name"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name {missingFields.includes("lastName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                            }`}
                                        placeholder="Last Name"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">ADDRESS</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Name {missingFields.includes("streetName") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="streetName"
                                        type="text"
                                        name="streetName"
                                        value={formData.streetName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.streetName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                            }`}
                                        placeholder="Street Name"
                                    />
                                    {errors.streetName && <p className="text-red-500 text-xs mt-1">{errors.streetName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                                        Area {missingFields.includes("area") && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id="area"
                                        type="text"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.area ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                            }`}
                                        placeholder="Area/Neighborhood"
                                    />
                                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                            City {missingFields.includes("city") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                                }`}
                                            placeholder="City"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                                            Zip Code {missingFields.includes("zip") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="zip"
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.zip ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                                }`}
                                            placeholder="Zip Code"
                                        />
                                        {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                            State/Province
                                        </label>
                                        <input
                                            id="state"
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                            placeholder="State/Province"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                            Country {missingFields.includes("country") && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id="country"
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${errors.country ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                                }`}
                                            placeholder="Country"
                                        />
                                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div>
                                    <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                        Billing Address {missingFields.includes("billingAddress") && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        id="billingAddress"
                                        name="billingAddress"
                                        value={formData.billingAddress}
                                        onChange={handleChange}
                                        rows={3}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none ${errors.billingAddress ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"
                                            }`}
                                        placeholder="Enter your complete billing address"
                                    />
                                    {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-200 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-3 bg-primary hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                             Continue
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
