// "use client"

// import type React from "react"

// import { useState } from "react"
// import { X } from "lucide-react"

// interface DeliveryAddressModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onConfirm: (data: AddressData) => void
//   initialData?: AddressData
// }

// export interface AddressData {
//   firstName: string
//   lastName: string
//   streetName: string
//   area: string
//   city: string
//   zip: string
//   state: string
//   country: string
// }

// export default function DeliveryAddressModal({
//   isOpen,
//   onClose,
//   onConfirm,
//   initialData = {
//     firstName: "Alex",
//     lastName: "Morgan",
//     streetName: "200 N Spring St",
//     area: "Los Angeles City Hall",
//     city: "Los Angeles",
//     zip: "90012",
//     state: "",
//     country: "United State",
//   },
// }: DeliveryAddressModalProps) {
//   const [formData, setFormData] = useState<AddressData>(initialData)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleConfirm = () => {
//     onConfirm(formData)
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} aria-hidden="true" />

//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">Delivery address</h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 Submit the valid information to make sure your shipping address is correct to delivery your products.
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4"
//               aria-label="Close modal"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Form Content */}
//           <div className="p-6 space-y-6">
//             {/* Your Basic Details Section */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 mb-4">YOUR BASIC DETAILS</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name
//                   </label>
//                   <input
//                     id="firstName"
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                     placeholder="Alex"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name
//                   </label>
//                   <input
//                     id="lastName"
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                     placeholder="Morgan"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Address Section */}
//             <div>
//               <h3 className="text-sm font-semibold text-gray-900 mb-4">ADDRESS</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-2">
//                     Street Name
//                   </label>
//                   <input
//                     id="streetName"
//                     type="text"
//                     name="streetName"
//                     value={formData.streetName}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                     placeholder="200 N Spring St"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
//                     Area
//                   </label>
//                   <input
//                     id="area"
//                     type="text"
//                     name="area"
//                     value={formData.area}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                     placeholder="Los Angeles City Hall"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
//                       City
//                     </label>
//                     <input
//                       id="city"
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                       placeholder="Los Angeles"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
//                       ZIP
//                     </label>
//                     <input
//                       id="zip"
//                       type="text"
//                       name="zip"
//                       value={formData.zip}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                       placeholder="90012"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
//                     State(Optional)
//                   </label>
//                   <input
//                     id="state"
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//                     placeholder="CA"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
//                     Country
//                   </label>
//                   <div className="relative">
//                     <select
//                       id="country"
//                       name="country"
//                       value={formData.country}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none bg-white"
//                     >
//                       <option>United State</option>
//                       <option>Canada</option>
//                       <option>Mexico</option>
//                       <option>United Kingdom</option>
//                     </select>
//                     <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t border-gray-200">
//             <button
//               onClick={handleConfirm}
//               className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
//             >
//               Confirm changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
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
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
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