"use client"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import Image from "next/image"

interface PlanSelectionProps {
  billingCycle: "monthly" | "annual"
  onBillingCycleChange: (cycle: "monthly" | "annual") => void
}

const monthlyPrice = 29
const annualPrice = 16

export default function PlanSelection({ billingCycle, onBillingCycleChange }: PlanSelectionProps) {
  return (
    <div className="rounded-lg bg-[#1717170F] w-full ">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900">Starter plan</h2>

        {/* Plan Options */}
        <RadioGroup
          value={billingCycle}
          onValueChange={(value) => onBillingCycleChange(value as "monthly" | "annual")}
          className="mt-6 space-y-4"
        >
          {/* Monthly Option */}
          <label
            htmlFor="monthly"
            className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition-all items-center ${
              billingCycle === "monthly"
                ? "border-gray-900 bg-[#1717170F] "
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="monthly" className="cursor-pointer text-[20px] font-medium text-[#171717]">
                  Pay monthly
                </Label>
              </div>
              <p className="mt-1 text-sm text-gray-600">${monthlyPrice} / mo</p>
            </div>
          </label>

          {/* Annual Option */}
          <label
            htmlFor="annual"
            className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition-all items-center ${
              billingCycle === "annual"
              ? "border-gray-900 bg-[#1717170F] "
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <RadioGroupItem value="annual" id="annual" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="annual" className="cursor-pointer text-[20px] font-medium text-[#171717]">
                  Pay annually
                </Label>
              </div>
              <p className="mt-1 text-sm text-gray-600">${annualPrice} / mo</p>
            </div>
            <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">Save 50%</Badge>
          </label>
        </RadioGroup>

        {/* Total Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-[#171717]">Total</span>
            <span className="text-3xl font-bold text-[#171717]">
              ${billingCycle === "monthly" ? monthlyPrice : annualPrice} / Month
            </span>
          </div>

          {/* Security Note */}
          <div className="flex gap-2 p-3 items-center bg-[#1717170F] rounded-lg">
            <svg className="h-5 w-5 flex-shrink-0 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <p className="text-[13px] text-[#171717] font-normal">
              Guaranteed to be safe & secure, ensuring that all transactions are protected with the highest level of security.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Cube Graphic */}
      <div className=" flex items-center justify-center">
        <Image
          src="/images/package.png"
          alt="3D Cube Graphic"
          width={100}
          height={100}
          className="h-full w-full "
        />
      </div>
    </div>
  )
}