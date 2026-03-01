/* eslint-disable @typescript-eslint/no-explicit-any */

// /* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";

import ProfileOne from "@/components/seller/Initial_profile_setup/profileOne";
import ProfileTwo from "@/components/seller/Initial_profile_setup/profileTwo";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    profilePhoto: null,
  });

  const handleChange = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProfileOne data={formData} onChange={handleChange} onNext={handleNext} onPrevious={handlePrevious} />;

      case 2:
        return (
          <ProfileTwo
            data={formData}
            onChange={handleChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      default:
        return <div>Error: Unknown step</div>;
    }
  };

  return <div>{renderStep()}</div>;
}
