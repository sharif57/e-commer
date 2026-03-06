/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import FileUpload from "../ui/file-upload"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

interface StepThreeProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export default function StepThree({ data, onChange, onNext, onPrevious }: StepThreeProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    if (!data.shopName) newErrors.shopName = "Shop name is required"
    if (!data.shopLogo) newErrors.shopLogo = "Shop logo is required"
    if (!data.shopDescription) newErrors.shopDescription = "Shop description is required"
    if (!data.returnPolicy) newErrors.returnPolicy = "Return policy is required"
    if (!data.categories || data.categories.length === 0) newErrors.categories = "Please select at least one category"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = data.categories || []
    if (currentCategories.includes(category)) {
      onChange({ categories: currentCategories.filter((c: string) => c !== category) })
    } else {
      onChange({ categories: [...currentCategories, category] })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">


      <h1 className="text-xl font-bold text-black mb-8">Let&apos;s create your Online shop</h1>

      <div className="bg-[#0000000F] rounded-lg p-8 space-y-6">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Shop Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter your shop name"
            value={data.shopName}
            onChange={(e) => onChange({ shopName: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
        </div>

        {/* Shop Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">Shop Logo <span className="text-red-500">*</span></label>
          <FileUpload
            onFileSelect={(file) => onChange({ shopLogo: file })}
            fileName={data.shopLogo?.name}
            label="Upload Shop Logo"
          />
          {errors.shopLogo && <p className="text-red-500 text-xs mt-1">{errors.shopLogo}</p>}
        </div>

        {/* Shop Description */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Shop Description <span className="text-red-500">*</span></label>
          <Textarea
            placeholder="Write a brief description about your shop..."
            value={data.shopDescription}
            onChange={(e) => onChange({ shopDescription: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.shopDescription && <p className="text-red-500 text-xs mt-1">{errors.shopDescription}</p>}
        </div>

        {/* Return Policy */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Return Policy <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g., 7-day return policy"
            value={data.returnPolicy}
            onChange={(e) => onChange({ returnPolicy: e.target.value })}
            className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            required
          />
          {errors.returnPolicy && <p className="text-red-500 text-xs mt-1">{errors.returnPolicy}</p>}
        </div>

        {/* Categories to Sell In */}
        <div className="border-t border-[#171717] pt-6 mt-6">
          <h2 className="text-lg font-semibold text-black mb-6">Categories to Sell In <span className="text-red-500">*</span></h2>

          {/* Electronics */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-black">Electronics</h3>
              <Switch
                className="border border-primary"
                checked={data.fashion || false}
                onCheckedChange={(checked) => onChange({ fashion: checked })}
              />
            </div>
            {data.fashion && (
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="mobile"
                    checked={data.categories?.includes("Mobile Phones & Accessories") || false}
                    onCheckedChange={() => handleCategoryToggle("Mobile Phones & Accessories")}
                  />
                  <Label htmlFor="mobile" className="cursor-pointer">
                    Mobile Phones & Accessories
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="laptop"
                    checked={data.categories?.includes("Laptop & Computers") || false}
                    onCheckedChange={() => handleCategoryToggle("Laptop & Computers")}
                  />
                  <Label htmlFor="laptop" className="cursor-pointer">
                    Laptop & Computers
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="smart"
                    checked={data.categories?.includes("Smart Home Devices") || false}
                    onCheckedChange={() => handleCategoryToggle("Smart Home Devices")}
                  />
                  <Label htmlFor="smart" className="cursor-pointer">
                    Smart Home Devices
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Fashion */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-black">Fashion</h3>
              <Switch
                className="border border-primary"
                checked={data.fashion || false}
                onCheckedChange={(checked) => onChange({ fashion: checked })}
              />
            </div>
            {data.fashion && (
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="menswear"
                    checked={data.categories?.includes("Menswear") || false}
                    onCheckedChange={() => handleCategoryToggle("Menswear")}
                  />
                  <Label htmlFor="menswear" className="cursor-pointer">
                    Menswear
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="womenswear"
                    checked={data.categories?.includes("Womenswear") || false}
                    onCheckedChange={() => handleCategoryToggle("Womenswear")}
                  />
                  <Label htmlFor="womenswear" className="cursor-pointer">
                    Womenswear
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Home & Living */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-black">Home & Living</h3>
              <Switch
                className="border border-primary"
                checked={data.homeLiving || false}
                onCheckedChange={(checked) => onChange({ homeLiving: checked })}
              />
            </div>
            {data.homeLiving && (
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="furniture"
                    checked={data.categories?.includes("Furniture") || false}
                    onCheckedChange={() => handleCategoryToggle("Furniture")}
                  />
                  <Label htmlFor="furniture" className="cursor-pointer">
                    Furniture
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="kitchen"
                    checked={data.categories?.includes("Kitchen & Dining") || false}
                    onCheckedChange={() => handleCategoryToggle("Kitchen & Dining")}
                  />
                  <Label htmlFor="kitchen" className="cursor-pointer">
                    Kitchen & Dining
                  </Label>
                </div>
              </div>
            )}
          </div>
          {errors.categories && <p className="text-red-500 text-xs mt-3">{errors.categories}</p>}
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
