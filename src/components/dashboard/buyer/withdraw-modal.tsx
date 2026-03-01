/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { useRequestSellerWithdrawMutation } from "@/redux/feature/seller/walletSlice"

interface WithdrawModalProps {
    isOpen: boolean
    onClose: () => void
    walletBalance: number
}

export default function WithdrawModal({
    isOpen,
    onClose,
    walletBalance,
}: WithdrawModalProps) {
    const [step, setStep] = useState<"amount" | "card" | "confirm" | "success">("amount")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Form data
    const [formData, setFormData] = useState({
        amount: "",
        nameOfCard: "",
        cardNumber: "",
        date: "",
        cvc: "",
        country: "",
        zipCode: "",
    })

    const [requestSellerWithdraw] = useRequestSellerWithdrawMutation()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setError("")
    }

    const validateAmount = () => {
        const amount = parseFloat(formData.amount)
        if (!formData.amount) {
            setError("Please enter withdrawal amount")
            return false
        }
        if (amount <= 0) {
            setError("Amount must be greater than 0")
            return false
        }
        if (amount > walletBalance) {
            setError(`Amount cannot exceed wallet balance of $${walletBalance}`)
            return false
        }
        if (amount < 10) {
            setError("Minimum withdrawal amount is $10")
            return false
        }
        return true
    }

    const validateCardDetails = () => {
        if (!formData.nameOfCard.trim()) {
            setError("Please enter cardholder name")
            return false
        }
        if (!formData.cardNumber.replace(/\s/g, "")) {
            setError("Please enter card number")
            return false
        }
        const cardNum = formData.cardNumber.replace(/\s/g, "")
        if (cardNum.length < 13 || cardNum.length > 19) {
            setError("Invalid card number")
            return false
        }
        if (!formData.date) {
            setError("Please enter expiration date (MM/YY)")
            return false
        }
        if (!formData.cvc) {
            setError("Please enter CVC")
            return false
        }
        if (!/^\d{3,4}$/.test(formData.cvc)) {
            setError("CVC must be 3-4 digits")
            return false
        }
        if (!formData.country) {
            setError("Please select country")
            return false
        }
        if (!formData.zipCode.trim()) {
            setError("Please enter zip code")
            return false
        }
        return true
    }

    const handleNextStep = () => {
        if (step === "amount" && validateAmount()) {
            setStep("card")
        } else if (step === "card" && validateCardDetails()) {
            setStep("confirm")
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await requestSellerWithdraw({
                amount: parseFloat(formData.amount),
                nameOfCard: formData.nameOfCard,
                cardNumber: formData.cardNumber,
                date: formData.date,
                cvc: formData.cvc,
                country: formData.country,
                zipCode: formData.zipCode,
            }).unwrap()

            if (response.success) {
                setStep("success")
            } else {
                setError(response.message || "Failed to process withdrawal")
            }
        } catch (err: any) {
            setError(err?.data?.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setStep("amount")
        setFormData({
            amount: "",
            nameOfCard: "",
            cardNumber: "",
            date: "",
            cvc: "",
            country: "",
            zipCode: "",
        })
        setError("")
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Progress Bar */}
                {step !== "success" && (
                    <div className="px-6 pt-6">
                        <div className="flex items-center gap-2 mb-6">
                            {["amount", "card", "confirm"].map((s, i) => (
                                <div key={s} className="flex items-center flex-1">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${s === step
                                                ? "bg-blue-600 text-white"
                                                : ["amount", "card", "confirm"].indexOf(step) >
                                                    ["amount", "card", "confirm"].indexOf(s)
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {["amount", "card", "confirm"].indexOf(step) >
                                            ["amount", "card", "confirm"].indexOf(s)
                                            ? "✓"
                                            : i + 1}
                                    </div>
                                    {i < 2 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 rounded-full transition-colors ${["amount", "card", "confirm"].indexOf(step) >
                                                    ["amount", "card", "confirm"].indexOf(s)
                                                    ? "bg-green-600"
                                                    : "bg-gray-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Amount Step */}
                    {step === "amount" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Withdrawal Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-600">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                                    <span>Available balance: ${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                                    <button
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                amount: Math.max(0, walletBalance - 0.01).toString(),
                                            }))
                                        }
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-300 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleNextStep}
                                className="w-full py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Card Details Step */}
                    {step === "card" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    name="nameOfCard"
                                    value={formData.nameOfCard}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\s/g, "")
                                        const formatted = value.replace(/(\d{4})/g, "$1 ").trim()
                                        handleInputChange({
                                            ...e,
                                            target: { ...e.target, name: "cardNumber", value: formatted },
                                        })
                                    }}
                                    placeholder="4242 4242 4242 4242"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, "")
                                            if (value.length >= 2) {
                                                value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                            }
                                            handleInputChange({
                                                ...e,
                                                target: { ...e.target, name: "date", value },
                                            })
                                        }}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        CVC
                                    </label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={formData.cvc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                                            handleInputChange({
                                                ...e,
                                                target: { ...e.target, name: "cvc", value },
                                            })
                                        }}
                                        placeholder="123"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Country
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select country</option>
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="United States">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="India">India</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Australia">Australia</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="12345"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-300 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("amount")}
                                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    className="flex-1 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Step */}
                    {step === "confirm" && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Amount</span>
                                    <span className="font-semibold text-gray-900">
                                        ${parseFloat(formData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Card</span>
                                    <span className="font-semibold text-gray-900">
                                        •••• {formData.cardNumber.slice(-4)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Cardholder</span>
                                    <span className="font-semibold text-gray-900">{formData.nameOfCard}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Country</span>
                                    <span className="font-semibold text-gray-900">{formData.country}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    Your withdrawal request will be processed within 3-5 business days. You&lsquo;ll receive a confirmation email shortly.
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-300 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("card")}
                                    disabled={loading}
                                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : "Confirm Withdrawal"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Step */}
                    {step === "success" && (
                        <div className="text-center space-y-4 py-6">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-green-100 p-4">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Withdrawal Successful</h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Your withdrawal request has been submitted successfully
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Amount</span>
                                    <span className="font-semibold text-gray-900">
                                        ${parseFloat(formData.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Status</span>
                                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                        Pending
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 pt-4">
                                Check your email for withdrawal confirmation details
                            </p>

                            <button
                                onClick={handleClose}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
