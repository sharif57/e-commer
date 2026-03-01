/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import FileUpload from "@/components/ui/file-upload"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

interface StepTwoProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export default function StepTwo({ data, onChange, onNext, onPrevious }: StepTwoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    if (!data.fullName) newErrors.fullName = "Full name is required"
    if (!data.yourRole) newErrors.yourRole = "Role is required"
    if (!data.contactEmail) newErrors.contactEmail = "Contact email is required"
    if (!data.contactNumber) newErrors.contactNumber = "Contact number is required"
    if (!data.address) newErrors.address = "Address is required"
    if (!data.nationalIdFront) newErrors.nationalIdFront = "National ID front is required"

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
      {/* <div className="flex justify-between items-center mb-8">
        <button onClick={onPrevious} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors font-medium text-sm"
        >
          Continue →
        </button>
      </div> */}
      <div className="flex justify-end items-center gap-6  mb-8">
        <Button variant="link" onClick={onPrevious} className="text-gray-600 flex items-center gap-2 hover:text-gray-900 font-medium text-sm">
          <ArrowLeft /> Back
        </Button>
        <button
          onClick={handleContinue}
          className="group px-6 py-2.5 md:px-6 md:py-2 flex items-center justify-center gap-2 bg-primary text-white rounded-full font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          Continue
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-8">Now tell us about yourself or the Business owner</h1>

      <div className="bg-[#0000000F] rounded-lg p-8 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Alex Morgan"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Your Role */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Your Role</label>
          <select
            value={data.yourRole}
            onChange={(e) => onChange({ yourRole: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="">Owner</option>
            <option value="manager">Manager</option>
            <option value="authorized-representative">Authorized Representative</option>
          </select>
          {errors.yourRole && <p className="text-red-500 text-xs mt-1">{errors.yourRole}</p>}
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Contact Email</label>
          <input
            type="email"
            placeholder="john@lightstart.com"
            value={data.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Contact Number</label>
          <input
            type="tel"
            placeholder="Enter your contact number"
            value={data.contactNumber}
            onChange={(e) => onChange({ contactNumber: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
          {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
          <input
            type="text"
            placeholder="Street Address, City, State, ZIP Code"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Residency */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Residency (Optional)</label>
          <input
            type="text"
            placeholder="e.g., London, New York, etc."
            value={data.residency}
            onChange={(e) => onChange({ residency: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Identity Verification */}
        <div className="border-t border-[#171717] pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Identity verification</h2>
          <p className="text-sm text-gray-600 mb-4">Upload your ID and photo so we could recognize it&rsquo;s really you.</p>

          {/* National ID Front */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">National ID or Passport</label>
            <FileUpload
              onFileSelect={(file) => onChange({ nationalIdFront: file })}
              fileName={data.nationalIdFront?.name}
              label="Upload Front"
            />
            {errors.nationalIdFront && <p className="text-red-500 text-xs mt-1">{errors.nationalIdFront}</p>}
          </div>

          {/* National ID Back */}
          <div className="mb-6">
            <FileUpload
              onFileSelect={(file) => onChange({ nationalIdBack: file })}
              fileName={data.nationalIdBack?.name}
              label="Upload Back"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
