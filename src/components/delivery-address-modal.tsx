
"use client"

import { useState, useEffect } from "react"

export interface AddressData {
  firstName: string
  lastName: string
  streetName: string
  area: string
  city: string
  zip: string
  state: string
  country: string
  phone: string
}

interface DeliveryAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (address: AddressData) => void
  initialData?: AddressData
}

export default function DeliveryAddressModal({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}: DeliveryAddressModalProps) {
  const [formData, setFormData] = useState<AddressData>({
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

  // ✅ Sync initialData into form whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        streetName: initialData.streetName || "",
        area: initialData.area || "",
        city: initialData.city || "",
        zip: initialData.zip || "",
        state: initialData.state || "",
        country: initialData.country || "",
        phone: initialData.phone || "",
      })
    }
  }, [isOpen, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleConfirm = () => {
    onConfirm(formData)
    onClose()
  }

  const handleClose = () => {
    // Reset to initialData on cancel
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        streetName: initialData.streetName || "",
        area: initialData.area || "",
        city: initialData.city || "",
        zip: initialData.zip || "",
        state: initialData.state || "",
        country: initialData.country || "",
        phone: initialData.phone || "",
      })
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Street Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="streetName"
              value={formData.streetName}
              onChange={handleChange}
              placeholder="123 Main St"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area / Apartment</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Apt 4B, Near Market"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* City & ZIP */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="10001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* State & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="New York"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!formData.firstName || !formData.lastName || !formData.streetName || !formData.city}
            className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Address
          </button>
        </div>
      </div>
    </div>
  )
}