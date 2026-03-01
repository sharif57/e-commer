/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (cardData: any) => void
}

export default function AddCardModal({ isOpen, onClose, onAddCard }: AddCardModalProps) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    cardholderName: "",
    country: "United States",
    zipCode: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{13,19}$/)) {
      newErrors.cardNumber = "Invalid card number"
    }
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = "Expiry date is required"
    }
    if (!formData.cvc.match(/^\d{3,4}$/)) {
      newErrors.cvc = "Invalid CVC"
    }
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onAddCard(formData)
      setFormData({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvc: "",
        cardholderName: "",
        country: "United States",
        zipCode: "",
      })
    }
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <button onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1" aria-label="Go back">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">Add a card</h2>
            <button onClick={onClose} className="text-slate-600 hover:text-slate-900 p-1" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 1234 1234"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setFormData((prev) => ({
                      ...prev,
                      cardNumber: formatted,
                    }))
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cardNumber ? "border-red-500" : "border-slate-300"
                  }`}
                  maxLength={23}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-6 h-4 bg-red-500 rounded text-xs flex items-center justify-center text-white font-bold">
                    V
                  </div>
                  <div className="w-6 h-4 bg-orange-500 rounded text-xs flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="w-6 h-4 bg-blue-700 rounded text-xs flex items-center justify-center text-white font-bold">
                    A
                  </div>
                </div>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Date of Expiry</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="expiryMonth"
                    placeholder="MM"
                    value={formData.expiryMonth}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2)
                      setFormData((prev) => ({ ...prev, expiryMonth: val }))
                    }}
                    maxLength={2}
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="expiryYear"
                    placeholder="YY"
                    value={formData.expiryYear}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 2)
                      setFormData((prev) => ({ ...prev, expiryYear: val }))
                    }}
                    maxLength={2}
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">CVC</label>
                <input
                  type="text"
                  name="cvc"
                  placeholder="123"
                  value={formData.cvc}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setFormData((prev) => ({ ...prev, cvc: val }))
                  }}
                  maxLength={4}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cvc ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Name on Card</label>
              <input
                type="text"
                name="cardholderName"
                placeholder="Enter the name"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardholderName ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>Other</option>
              </select>
            </div>

            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">ZIP Code</label>
              <select
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.zipCode ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select ZIP code</option>
                <option value="477987">477987</option>
                <option value="100001">100001</option>
                <option value="900210">900210</option>
                <option value="600001">600001</option>
              </select>
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded mt-6"
            >
              Add my card
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
