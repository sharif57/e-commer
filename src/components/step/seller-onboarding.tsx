/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"

import { useState } from "react"
import StepIndicator from "./step-indicator"
import StepOne from "./step-one"
import StepTwo from "./step-two"
import StepThree from "./step-three"
import Logo from "../icon/logo"
import StepFour from "./step-four"
import StepFive from "./step-five"
import Link from "next/link"

const steps = [
  { number: 1, title: "Business Information" },
  { number: 2, title: "Seller Information" },
  { number: 3, title: "Shop Details" },
  { number: 4, title: "Payment Method" },
  { number: 5, title: "Submit for Review" },
]

export default function SellerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Business Details
    businessType: "",
    legalBusinessName: "",
    businessRegistrationNo: "",
    businessAddress: "",
    country: "Bangladesh",
    businessPhone: "",
    businessEmail: "",
    businessLicense: null,
    bankStatement: null,
    einTinNumber: "",
    document: null,
    businessEntity: [],

    // Step 2: Seller Information
    fullName: "",
    yourRole: "",
    contactEmail: "",
    contactNumber: "",
    address: "",
    residency: "",
    nationalIdFront: null,
    nationalIdBack: null,

    // Step 3: Shop Details
    shopName: "",
    shopLogo: null,
    shopDescription: "",
    returnPolicy: "",
    categories: [],
    fashion: false,
    homeLiving: false,

    // Step 4: Payment Method
    businessAccHolderName: "",
    bankName: "",
    accountNumber: "",
    swiftCode: "",
    accountType: "",
    stripeId: "",
    tin: "",
    street: "",
    city: "",
    zip: "",
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
        return <StepOne data={formData} onChange={handleFormDataChange} onNext={handleNext} />
      case 2:
        return <StepTwo data={formData} onChange={handleFormDataChange} onNext={handleNext} onPrevious={handlePrevious} />
      case 3:
        return <StepThree data={formData} onChange={handleFormDataChange} onNext={handleNext} onPrevious={handlePrevious} />
      case 4:
        return <StepFour data={formData} onChange={handleFormDataChange} onNext={handleNext} onPrevious={handlePrevious} />
      case 5:
        return <StepFive data={formData} onChange={handleFormDataChange} onNext={handleNext} onPrevious={handlePrevious} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen ">
      {/* ✅ Fixed Header */}
      <header className="fixed top-0 left-0 w-full  z-50 p-4 flex items-center justify-start">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <div className="flex">
        {/* ✅ Fixed Sidebar */}
        <aside
          className="hidden lg:block fixed top-[50px] left-0 h-[calc(100vh-72px)] w-1/3  p-8 overflow-y-auto"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-[#000000] text-black mb-2">
              Your journey to becoming a seller starts here.
            </h2>
            <p className="text-sm text-gray-600">
              Tell us a bit about your business to get started.
            </p>
          </div>
          <StepIndicator steps={steps} currentStep={currentStep} />
        </aside>

        {/* ✅ Main Content */}
        <main className="w-full lg:ml-[25%] pt-[88px] p-6 md:p-8 lg:p-16 overflow-y-auto">
          {renderStep()}
        </main>
      </div>
    </div>
  )
}
