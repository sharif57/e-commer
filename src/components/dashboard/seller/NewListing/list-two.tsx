/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import React, { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Cloud, Trash2, ArrowLeft, ArrowRight } from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  preview: string
  name: string
  size: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

interface StepTwoProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export default function ListTwo({ data, onChange, onNext, onPrevious }: StepTwoProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const MAX_FILES = 6
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]

  const isValidFile = (file: File): boolean => {
    return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
  }

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return

      const fileArray = Array.from(newFiles)
      const validFiles = fileArray.filter(isValidFile)

      if (validFiles.length + files.length > MAX_FILES) {
        alert(`You can upload a maximum of ${MAX_FILES} files`)
        return
      }

      const uploadedFiles = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: formatFileSize(file.size),
      }))

      setFiles((prev) => [...prev, ...uploadedFiles])

      if (!coverPhoto && uploadedFiles.length > 0) {
        setCoverPhoto(uploadedFiles[0].id)
      }
    },
    [files.length, coverPhoto],
  )

  const validateStep = () => {
    if (files.length === 0) {
      alert("Please upload at least one file before continuing.")
      return false
    }
    return true
  }

  const handleContinue = () => {
    if (!validateStep()) return

    onChange({
      ...data,
      files,
      coverPhoto,
    })

    onNext()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id)
      if (coverPhoto === id) {
        setCoverPhoto(updated.length > 0 ? updated[0].id : null)
      }
      return updated
    })
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      {/* Top Navigation Buttons */}
      <div className="flex justify-end items-center gap-6 mb-8">
        <Button
          variant="link"
          onClick={onPrevious}
          className="text-gray-600 flex items-center gap-2 hover:text-gray-900 font-medium text-sm"
        >
          <ArrowLeft /> Back
        </Button>

        <button
          onClick={handleContinue}
          className="group px-6 py-2.5 flex items-center gap-2 bg-primary text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          Continue
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <div className="w-full bg-[#0000000F]  rounded-lg p-4 sm:p-6">
        <div className="bg-[#FFFFFF] p-4 rounded-lg">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#000000]">Media Upload</h2>
            <p className="text-sm text-gray-600">Add your products here, max {MAX_FILES} files allowed.</p>
          </div>

          {/* Upload Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 transition cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-400 bg-white hover:bg-blue-50"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={files.length >= MAX_FILES}
            />


            <div className="flex flex-col items-center justify-center">
              <Cloud className="w-12 h-12 text-blue-500 mb-4" />
              <p className="text-gray-800 text-center mb-1">
                <span className="font-semibold">Drag files</span> or{" "}
                <button
                  onClick={openFileDialog}
                  className="text-blue-600 hover:text-blue-700 underline font-semibold"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">Max 50MB • JPG, JPEG, PNG, PDF</p>
            </div>
          </div>
          <p className="text-[13px] text-[#000000CC] pt-2">Only support JPG, JPEG, PNG and PDF format</p>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="w-14 h-14 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                    {file.file.type.startsWith("image/") ? (
                      <Image
                        src={file.preview}
                        alt={file.name}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="font-semibold text-gray-600 text-sm">PDF</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.size}</p>
                  </div>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Cover Photo Selection */}
          {/* Cover Photo Selection */}
          {files.length > 0 && (
            <div className="mt-6">
              <label className="font-semibold text-gray-900 text-sm block mb-2">
                Use Cover Photo
              </label>

              <select
                value={coverPhoto || ""}
                onChange={(e) => setCoverPhoto(e.target.value)}
                className="w-full px-4 py-2 border border-[#171717] rounded-lg bg-white focus:ring-blue-500"
              >
                <option value="">Select</option>
                {files.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
