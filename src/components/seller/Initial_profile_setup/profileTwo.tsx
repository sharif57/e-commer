/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ChevronDown, Lock } from 'lucide-react';
import AuthHeader from "@/components/auth/auth-hader";

interface StepTwoProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void
}

export default function ProfileTwo({ data, onChange, onNext , onPrevious}: StepTwoProps) {
  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    streetName: data?.streetName || "",
    area: data?.area || "",
    city: data?.city || "",
    zip: data?.zip || "",
    state: data?.state || "",
    country: data?.country || "United States",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, streetName, city, zip, state, country } =
      formData;
    if (
      !firstName ||
      !lastName ||
      !streetName ||
      !city ||
      !zip ||
      !state ||
      !country
    ) {
      alert("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onChange(formData);
    setIsSubmitting(false);
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div>
      <AuthHeader />

      <div className="max-w-[390px] mx-auto px-4 py-6 md:px-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-start">
          {/* Skip button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleSkip}
              className="text-[#171717] hover:text-[#000000] font-medium text-sm transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Header */}
          <h1 className="text-xl md:text-2xl font-bold text-[#000000] mb-4">
            Shipping address
          </h1>
          <p className="text-[#000000CC] font-normal text-start text-xs mb-12">
            Submit the valid information to make sure your shipping address is
            correct to delivery your products.
          </p>

          {/* YOUR BASIC DETAILS Section */}
          <div className="mb-8">
            <h2 className="text-[14px] font-bold text-[#000000] tracking-widest mb-4 uppercase">
              Your Basic Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#000000] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. John"
                  className="px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#000000] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Doe"
                  className="px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* ADDRESS Section */}
          <div className="mb-8">
            <h2 className="text-[14px] font-bold text-[#000000] tracking-widest mb-4 uppercase">
              Address
            </h2>

            <div className="space-y-4">
              {/* Street Name */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#000000] mb-2">
                  Street Name
                </label>
                <input
                  type="text"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  className="w-full px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                />
              </div>

              {/* Area */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#000000] mb-2">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Enter area/district"
                  className="w-full px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                />
              </div>

              {/* City and ZIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-[#000000] mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-[#000000] mb-2">
                    ZIP
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                    className="w-full px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* State */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#000000] mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state/province"
                  className="w-full px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                />
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-[#000000] mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition appearance-none bg-white cursor-pointer pr-10"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>India</option>
                    <option>Japan</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-teal-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors mb-4"
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock size={14} />
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
