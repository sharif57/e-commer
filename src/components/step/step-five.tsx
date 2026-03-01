/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ChevronDown, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import SellerService from "@/service/sellerService"
import { useRouter } from "next/navigation"
import { useApplySellerMutation } from "@/redux/feature/buyer/becomeAseller"
import { toast } from "sonner"

interface StepFiveProps {
  data: any
  onChange: (data: any) => void
  onPrevious: () => void
  onNext: () => void
}

export default function StepFive({ data, onPrevious }: StepFiveProps) {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true,
    seller: true,
    shop: true,
    payment: true,
  })

  const [ApplySeller] = useApplySellerMutation()

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate form
      const validation = SellerService.validateForm(data)
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(", ")
        setError(`Validation failed: ${errorMessages}`)
        return
      }

      // Prepare payload and images
      const { payload, images } = SellerService.prepareSubmissionData(data)

      // Submit using Redux mutation
      const result = await ApplySeller({ data: payload, image: images }).unwrap()
      toast.success("Application submitted successfully!")
      setSubmitted(true)
      console.log("Application submitted successfully:", result)
      router.push(`/upgrade?id=${result?.data?._id}`)
      // Redirect after 3 seconds
      // setTimeout(() => {
      //   // router.push("/")
      // }, 3000)
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to submit application"
      setError(errorMessage)
      toast.error(errorMessage || "Failed to submit application")
      console.error("Error submitting application:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for submitting your application. We will review your information and get back to you within 2-3 business days.
          </p>
          <p className="text-sm text-gray-500 mb-8">Redirecting to home page...</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-900">Review your details before submitting</h1>
        <Button
          variant="link"
          onClick={onPrevious}
          className="text-gray-600 flex items-center gap-2 hover:text-gray-900 font-medium text-sm"
        >
          <ArrowLeft /> Back
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Monthly Subscription Fee</h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Here&rsquo;s how the subscription works: you&rsquo;ll start with a $29.99 USD Professional selling fee for your first month. As long as you keep your subscription active, each month you&rsquo;ll be charged this amount. If you take a break and have no active listings, you won&rsquo;t pay a subscription fee that month.
          </p>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay $29.99 and Submit for Review"
            )}
          </button>
          <p className="text-xs text-amber-700 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>
              Don&rsquo;t worry, you won&rsquo;t be charged until we review your account and approve your submission.
            </span>
          </p>
        </div>

        {/* Business Information Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("business")}
          >
            <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.business ? "rotate-180" : ""}`}
            />
          </div>

          {expandedSections.business && (
            <div className="px-6 pb-6 space-y-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Type:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Legal Business Name:</span>
                <span className="text-sm font-medium text-gray-900">{data.legalBusinessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registration No:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessRegistrationNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Address:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm font-medium text-gray-900">{data.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Phone:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Email:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">EIN/TIN:</span>
                <span className="text-sm font-medium text-gray-900">{data.einTinNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business License:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessLicense?.name || "Uploaded"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Seller Information Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("seller")}
          >
            <h2 className="text-lg font-semibold text-gray-900">Seller Information</h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.seller ? "rotate-180" : ""}`}
            />
          </div>

          {expandedSections.seller && (
            <div className="px-6 pb-6 space-y-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Full Name:</span>
                <span className="text-sm font-medium text-gray-900">{data.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <span className="text-sm font-medium text-gray-900">{data.yourRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contact Email:</span>
                <span className="text-sm font-medium text-gray-900">{data.contactEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contact Number:</span>
                <span className="text-sm font-medium text-gray-900">{data.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Address:</span>
                <span className="text-sm font-medium text-gray-900">{data.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">National ID:</span>
                <span className="text-sm font-medium text-gray-900">{data.nationalIdFront?.name || "Uploaded"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Shop Details Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("shop")}
          >
            <h2 className="text-lg font-semibold text-gray-900">Shop Details</h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.shop ? "rotate-180" : ""}`}
            />
          </div>

          {expandedSections.shop && (
            <div className="px-6 pb-6 space-y-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shop Name:</span>
                <span className="text-sm font-medium text-gray-900">{data.shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shop Logo:</span>
                <span className="text-sm font-medium text-gray-900">{data.shopLogo?.name || "Uploaded"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Description:</span>
                <span className="text-sm font-medium text-gray-900">{data.shopDescription || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Return Policy:</span>
                <span className="text-sm font-medium text-gray-900">{data.returnPolicy || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Categories:</span>
                <span className="text-sm font-medium text-gray-900">{data.categories?.join(", ") || "N/A"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("payment")}
          >
            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.payment ? "rotate-180" : ""}`}
            />
          </div>

          {expandedSections.payment && (
            <div className="px-6 pb-6 space-y-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Holder Name:</span>
                <span className="text-sm font-medium text-gray-900">{data.businessAccHolderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bank Name:</span>
                <span className="text-sm font-medium text-gray-900">{data.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Number:</span>
                <span className="text-sm font-medium text-gray-900">****{data.accountNumber?.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SWIFT Code:</span>
                <span className="text-sm font-medium text-gray-900">{data.swiftCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Type:</span>
                <span className="text-sm font-medium text-gray-900">{data.accountType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Billing Address:</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.street}, {data.city}, {data.zip}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Certification Alert */}
        <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            I declare that the required information I provided is valid and authentic.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-primary text-white py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:bg-gray-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Pay $29.99 and Submit for Review"
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Don&rsquo;t worry, you won&rsquo;t be charged until you submit. If you decide to sell in multiple stores, you&rsquo;ll only pay a subscription fee for that month.
        </p>
      </div>
    </div>
  )
}
