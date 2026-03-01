"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  fileName?: string
  label?: string
}

export default function FileUpload({ onFileSelect, fileName, label = "Upload File" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border border-dashed border-[#1877F2] rounded-md p-2 transition-all cursor-pointer ${
        isDragging ? "border-[#1877F2] bg-teal-50" : "border-[#1877F2] hover:border-gray-400 bg-white"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />

      <div className="flex gap-2 items-center justify-start text-center">
        <Upload className="size-4 text-[#1877F2] mb-" />
        {fileName ? (
          <>
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-500 mt-1">Click to change</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-900 mb-">
              <span className="text-[#1877F2]">{label} or drag and drop your file her</span>
            </p>
            {/* <p className="text- text-[#1877F2]">or drag and drop your file here</p> */}
          </>
        )}
      </div>
    </div>
  )
}
