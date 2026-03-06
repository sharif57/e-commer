/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepFourProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export default function StepFour({ data, onChange, onNext, onPrevious }: StepFourProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    if (!data.businessAccHolderName) newErrors.businessAccHolderName = "Account holder name is required"
    if (!data.bankName) newErrors.bankName = "Bank name is required"
    if (!data.accountNumber) newErrors.accountNumber = "Account number is required"
    if (!data.swiftCode) newErrors.swiftCode = "SWIFT code is required"
    if (!data.accountType) newErrors.accountType = "Account type is required"
    if (!data.stripeId) newErrors.stripeId = "Stripe ID is required"
    if (!data.tin) newErrors.tin = "TIN number is required"
    if (!data.street) newErrors.street = "Street is required"
    if (!data.city) newErrors.city = "City is required"
    if (!data.zip) newErrors.zip = "ZIP code is required"
    if (!data.residency) newErrors.residency = "Residency is required"

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


      <h1 className="text-xl font-bold text-black mb-8">Setup how you will receive your Payments</h1>

      <div className="bg-[#0000000F] rounded-lg p-8 space-y-6">
        {/* Business Account Holder's Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Business Account Holder&lsquo;s Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Alex Morgan"
            value={data.businessAccHolderName}
            onChange={(e) => onChange({ businessAccHolderName: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.businessAccHolderName && (
            <p className="text-red-500 text-xs mt-1">{errors.businessAccHolderName}</p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Bank Name <span className="text-red-500">*</span></label>
          <select
            value={data.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Select Bank</option>
            <option value="paypal">PayPal</option>
            <option value="hsbc">HSBC</option>
            <option value="citibank">Citibank</option>
            <option value="standard-chartered">Standard Chartered</option>
            <option value="brac">BRAC Bank</option>
            <option value="other">Other</option>
          </select>
          {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
        </div>

        {/* Account Number/IBAN */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Account Number/IBAN <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter account number or IBAN"
            value={data.accountNumber}
            onChange={(e) => onChange({ accountNumber: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
        </div>

        {/* SWIFT CODE/BIC */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">SWIFT CODE/BIC / Routing Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter SWIFT code"
            value={data.swiftCode}
            onChange={(e) => onChange({ swiftCode: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.swiftCode && <p className="text-red-500 text-xs mt-1">{errors.swiftCode}</p>}
        </div>

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Account Type <span className="text-red-500">*</span></label>
          <select
            value={data.accountType}
            onChange={(e) => onChange({ accountType: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Select Account Type</option>
            <option value="Current">Current</option>
            <option value="Savings">Savings</option>
            <option value="Merchant">Merchant</option>
          </select>
          {errors.accountType && <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>}
        </div>

        {/* Stripe ID */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Stripe ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter Stripe ID"
            value={data.stripeId}
            onChange={(e) => onChange({ stripeId: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.stripeId && <p className="text-red-500 text-xs mt-1">{errors.stripeId}</p>}
        </div>

        {/* TIN Number */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">TIN Number <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter TIN number"
            value={data.tin}
            onChange={(e) => onChange({ tin: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.tin && <p className="text-red-500 text-xs mt-1">{errors.tin}</p>}
        </div>

        {/* Billing Address */}
        <div className="border-t border-[#171717] pt-6 mt-6">
          <h2 className="text-lg font-semibold text-black mb-6">Billing Address</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Street <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="123 Main Street"
                value={data.street}
                onChange={(e) => onChange({ street: e.target.value })}
                className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter city"
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">ZIP Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter ZIP code"
                value={data.zip}
                onChange={(e) => onChange({ zip: e.target.value })}
                className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
              {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
            </div>

            {/* Residency */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Residency <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Enter country of residency"
                value={data.residency}
                onChange={(e) => onChange({ residency: e.target.value })}
                className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              />
              {errors.residency && <p className="text-red-500 text-xs mt-1">{errors.residency}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-6 mt-8">
        <Button
          variant="link"
          onClick={onPrevious}
          className="text-gray-600 flex items-center gap-2 hover:text-black font-medium text-sm"
        >
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
    </div>
  )
}
