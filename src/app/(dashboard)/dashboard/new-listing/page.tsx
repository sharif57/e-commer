
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import ListFive from "@/components/dashboard/seller/NewListing/list-five"
import ListFour from "@/components/dashboard/seller/NewListing/list-four"
import ListOne from "@/components/dashboard/seller/NewListing/list-one"
import ListThree from "@/components/dashboard/seller/NewListing/list-three"
import ListTwo from "@/components/dashboard/seller/NewListing/list-two"
import StepIndicator from "@/components/step/step-indicator"
import { useState } from "react"

const steps = [
  { number: 1, title: "Product Category & Subcategory" },
  { number: 2, title: "Upload Images" },
  { number: 3, title: "Product Details" },
  { number: 4, title: "Delivery Options" },
  { number: 5, title: "Review & Publish" },
]

export default function SellerDashboardNewListing() {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    businessType: "",
    legalBusinessName: "",
    businessRegistrationNo: "",
    businessAddress: "",
    country: "United States",
    businessPhone: "",
    businessEmail: "",
    businessLicense: null,
    bankStatement: null,
    einTinNumber: "",
    document: null,
    businessEntity: [],
    fullName: "",
    yourRole: "",
    contactEmail: "",
    contactNumber: "",
    address: "",
    nationalIdFront: null,
    nationalIdBack: null,
    shopLogo: null,
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleFormDataChange = (newData: any) => {
    setFormData({ ...formData, ...newData })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ListOne
            data={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
          />
        )
      case 2:
        return (
          <ListTwo
            data={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <ListThree
            data={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <ListFour
            data={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 5:
        return (
          <ListFive
            data={formData}
            onChange={handleFormDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onChangeStep={setCurrentStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="">
      <div className="flex">
        {/* ✅ FIXED SIDEBAR */}
        <aside className="w-[330px] h-screen sticky top-0 p-4  overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              List your product and reach more customers
            </h2>
            <p className="text-sm text-gray-600">
              Tell us a bit about your product to get started.
            </p>
          </div>

          <StepIndicator steps={steps} currentStep={currentStep} />
        </aside>

        {/* ✅ SCROLLABLE MAIN CONTENT */}
        <main className="flex-1 h-screen overflow-y-auto p-6">
          {renderStep()}
        </main>
      </div>
    </div>
  )
}
