/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import FileUpload from "../ui/file-upload"
import { ArrowRight } from "lucide-react"
// import FileUpload from "@/components/ui/file-upload"

interface StepOneProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
}

export default function StepOne({ data, onChange, onNext }: StepOneProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    if (!data.businessType) newErrors.businessType = "Business type is required"
    if (!data.legalBusinessName) newErrors.legalBusinessName = "Legal business name is required"
    if (!data.businessRegistrationNo) newErrors.businessRegistrationNo = "Registration number is required"
    if (!data.businessAddress) newErrors.businessAddress = "Business address is required"
    if (!data.businessPhone) newErrors.businessPhone = "Business phone is required"
    if (!data.businessEmail) newErrors.businessEmail = "Business email is required"
    if (!data.businessLicense) newErrors.businessLicense = "Business license is required"
    if (!data.einTinNumber) newErrors.einTinNumber = "EIN/TIN number is required"

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
      <div className="flex justify-end items-center mb-8">
        <button
          onClick={handleContinue}
          className="group px-6 py-2.5 md:px-6 md:py-2 flex items-center justify-center gap-2 bg-primary text-white rounded-full font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          Continue
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <div className="bg-[#0000000F] rounded-xl p-8 space-y-6">
        <h1 className="text-xl font-bold text-gray-900">Business Details</h1>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Business Type</label>
          <select
            value={data.businessType}
            onChange={(e) => onChange({ businessType: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">Select Business Type</option>
            <option value="sole-proprietor">Sole Proprietor</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
          </select>
          {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
        </div>

        {/* Legal Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Legal Business Name</label>
          <input
            type="text"
            placeholder="Enter your business name"
            value={data.legalBusinessName}
            onChange={(e) => onChange({ legalBusinessName: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.legalBusinessName && <p className="text-red-500 text-xs mt-1">{errors.legalBusinessName}</p>}
        </div>

        {/* Business Registration No */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Business Registration No.</label>
          <input
            type="text"
            placeholder="Enter registration number"
            value={data.businessRegistrationNo}
            onChange={(e) => onChange({ businessRegistrationNo: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.businessRegistrationNo && (
            <p className="text-red-500 text-xs mt-1">{errors.businessRegistrationNo}</p>
          )}
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Business Address</label>
          <input
            type="text"
            placeholder="Enter your business address"
            value={data.businessAddress}
            onChange={(e) => onChange({ businessAddress: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
          <select
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
          </select>
        </div>

        {/* Business Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Business Phone</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={data.businessPhone}
            onChange={(e) => onChange({ businessPhone: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.businessPhone && <p className="text-red-500 text-xs mt-1">{errors.businessPhone}</p>}
        </div>

        {/* Business Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Business Email</label>
          <input
            type="email"
            placeholder="Enter your business email"
            value={data.businessEmail}
            onChange={(e) => onChange({ businessEmail: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.businessEmail && <p className="text-red-500 text-xs mt-1">{errors.businessEmail}</p>}
        </div>

        {/* Verification Section */}
        <div className=" pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification</h2>

          {/* Business License */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload Business License</label>
            <FileUpload
              onFileSelect={(file) => onChange({ businessLicense: file })}
              fileName={data.businessLicense?.name}
            />
            {errors.businessLicense && <p className="text-red-500 text-xs mt-1">{errors.businessLicense}</p>}
          </div>

          {/* Bank Statement */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload Bank Statement/Utility Bill/Internet Bill
            </label>
            <FileUpload
              onFileSelect={(file) => onChange({ bankStatement: file })}
              fileName={data.bankStatement?.name}
            />
          </div>

          {/* EIN/TIN Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">EIN/TIN Number</label>
            <input
              type="text"
              placeholder="e.g., 28-7880541"
              value={data.einTinNumber}
              onChange={(e) => onChange({ einTinNumber: e.target.value })}
              className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            {errors.einTinNumber && <p className="text-red-500 text-xs mt-1">{errors.einTinNumber}</p>}
          </div>

          {/* Upload Document */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload the Document</label>
            <FileUpload onFileSelect={(file) => onChange({ document: file })} fileName={data.document?.name} />
          </div>
        </div>

        {/* Others Section */}
        <div className="border-t border-[#171717] pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Others</h2>
          <p className="text-sm text-gray-600 mb-4">What type of business entity do you have? (US resident status)</p>
          <div className="space-y-3">
            {["U.S Citizen", "Permanent Resident", "Work Permit Holder", "Non US Entity"].map((entity) => (
              <label key={entity} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data?.businessEntity?.includes(entity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({ businessEntity: [...data.businessEntity, entity] })
                    } else {
                      onChange({ businessEntity: data.businessEntity.filter((e: string) => e !== entity) })
                    }
                  }}
                  className="w-4 h-4 text-primary rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700">{entity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
