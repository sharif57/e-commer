/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import AuthHeader from "@/components/auth/auth-hader";
import Image from "next/image";
import { Camera } from "lucide-react";

interface StepOneProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void
}

export default function ProfileOne({ data, onChange, onNext , onPrevious}: StepOneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onChange({ profilePhoto: file });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = async () => {
    setIsUploading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsUploading(false);
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div>
      <AuthHeader />

      <div className="max-w-[390px] mx-auto">
        
        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-8 text-start">
          
          <div className="flex justify-end">
            <button
              onClick={handleSkip}
              className="text-[#171717] hover:text-gray-900 font-medium text-sm transition-colors"
            >
              Skip
            </button>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-[#000000] mb-4">
            Setup your profile photo
          </h1>

          <p className="text-[#000000CC] font-normal text-start text-xs mb-12">
            You&lsquo;re almost done. Just upload your profile photo and shipping 
            address to complete. <span className="text-gray-500">(Optional)</span>
          </p>

          {/* Upload Circle */}
          <div
            onClick={handleUploadClick}
            className="w-40 h-40 md:w-[147px] md:h-[147px] mx-auto mb-12 rounded-full 
            bg-gray-100 border-2 border-dashed border-gray-300 flex items-center 
            justify-center cursor-pointer hover:bg-gray-150 transition-colors 
            relative overflow-hidden group"
          >
            {preview ? (
              <Image
                fill
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-16 h-16 text-gray-400" />
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={handleContinue}
            disabled={isUploading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-teal-300 
            text-white font-semibold py-2 px-6 rounded-lg transition-colors mb-6"
          >
            {isUploading ? "Uploading..." : "Continue"}
          </button>

        </div>
      </div>
    </div>
  );
}
