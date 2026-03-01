"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "../icon/logo"

interface UpgradeFormProps {
  paymentMethod: "card" | "bank"
  onPaymentMethodChange: (method: "card" | "bank") => void
}

export default function UpgradeForm({ paymentMethod, onPaymentMethodChange }: UpgradeFormProps) {
  const [formData, setFormData] = useState({
    accountName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    nameOnCard: "",
    bankAccount: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required"
    }

    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required"
      } else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Invalid card number"
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required"
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Use MM/YY format"
      }

      if (!formData.cvc.trim()) {
        newErrors.cvc = "CVC is required"
      } else if (!/^\d{3,4}$/.test(formData.cvc)) {
        newErrors.cvc = "Invalid CVC"
      }

      if (!formData.nameOnCard.trim()) {
        newErrors.nameOnCard = "Name on card is required"
      }
    } else if (paymentMethod === "bank") {
      if (!formData.bankAccount.trim()) {
        newErrors.bankAccount = "Bank account is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let finalValue = value

    if (name === "cardNumber") {
      finalValue = value.replace(/\s/g, "").slice(0, 19)
    } else if (name === "expiryDate") {
      finalValue = value.replace(/\D/g, "").slice(0, 4)
      if (finalValue.length >= 2) {
        finalValue = finalValue.slice(0, 2) + "/" + finalValue.slice(2)
      }
    } else if (name === "cvc") {
      finalValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Subscription upgraded successfully!")
      setFormData({
        accountName: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        nameOnCard: "",
        bankAccount: "",
      })
    } catch (error) {
      alert("Error processing subscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <Logo />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Upgrade to Plus</h2>
        <p className="mt-1 text-sm text-gray-600">Do more with unlimited blocks, files, automations & integrations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Billed To Section */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Billed To</h3>
          <div>
            <Label htmlFor="accountName" className="text-xs font-medium text-gray-600">
              Account Name
            </Label>
            <Input
              id="accountName"
              name="accountName"
              placeholder="e.g. John Doe"
              value={formData.accountName}
              onChange={handleChange}
              className={`mt-2 ${errors.accountName ? "border-red-500" : ""}`}
            />
            {errors.accountName && <p className="mt-1 text-xs text-red-500">{errors.accountName}</p>}
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Payment Details</h3>
          <div className="mb-6 flex gap-3">
            <button
              type="button"
              onClick={() => onPaymentMethodChange("card")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 px-4 transition-all ${paymentMethod === "card" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a2 2 0 012-2h14a2 2 0 012 2v2H3V4zm0 4v10a2 2 0 002 2h14a2 2 0 002-2V8H3zm3 6h2v2H6v-2zm6 0h2v2h-2v-2z" />
              </svg>
              <span className="text-sm font-medium">Credit Card</span>
            </button>
            <button
              type="button"
              onClick={() => onPaymentMethodChange("bank")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 px-4 transition-all ${paymentMethod === "bank" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 6v2h3v15H2V8h3V6H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z" />
              </svg>
              <span className="text-sm font-medium">Bank Transfer</span>
            </button>
          </div>

          {/* Card Details */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="text-xs font-medium text-gray-600">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 1234 1234 1234"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  className={`mt-2 font-mono ${errors.cardNumber ? "border-red-500" : ""}`}
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-xs font-medium text-gray-600">
                    Date of Expiry
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    maxLength={5}
                    className={`mt-2 ${errors.expiryDate ? "border-red-500" : ""}`}
                  />
                  {errors.expiryDate && <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>}
                </div>

                <div>
                  <Label htmlFor="cvc" className="text-xs font-medium text-gray-600">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={handleChange}
                    maxLength={4}
                    className={`mt-2 ${errors.cvc ? "border-red-500" : ""}`}
                  />
                  {errors.cvc && <p className="mt-1 text-xs text-red-500">{errors.cvc}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="nameOnCard" className="text-xs font-medium text-gray-600">
                  Name on Card
                </Label>
                <Input
                  id="nameOnCard"
                  name="nameOnCard"
                  placeholder="Enter full name"
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  className={`mt-2 ${errors.nameOnCard ? "border-red-500" : ""}`}
                />
                {errors.nameOnCard && <p className="mt-1 text-xs text-red-500">{errors.nameOnCard}</p>}
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {paymentMethod === "bank" && (
            <div>
              <Label htmlFor="bankAccount" className="text-xs font-medium text-gray-600">
                Bank Account
              </Label>
              <Input
                id="bankAccount"
                name="bankAccount"
                placeholder="Enter your bank account details"
                value={formData.bankAccount}
                onChange={handleChange}
                className={`mt-2 ${errors.bankAccount ? "border-red-500" : ""}`}
              />
              {errors.bankAccount && <p className="mt-1 text-xs text-red-500">{errors.bankAccount}</p>}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() =>
              setFormData({
                accountName: "",
                cardNumber: "",
                expiryDate: "",
                cvc: "",
                nameOnCard: "",
                bankAccount: "",
              })
            }
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-[#29845A] hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Subscribe"}
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500">
          By providing your card information, you allow us to charge your card for future payment in accordance with
          their terms.
        </p>
      </form>
    </div>
  )
}
