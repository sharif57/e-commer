/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import React, { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Cloud, Trash2, ArrowLeft, ArrowRight, Plus } from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  preview: string
  name: string
  size: string
}

interface Variant {
  color: string;
  files: UploadedFile[];
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
  const [variants, setVariants] = useState<Variant[]>(data.variants || [])
  const [coverPhoto, setCoverPhoto] = useState<string | null>(data.coverPhoto || null)
  const [newColor, setNewColor] = useState("")

  const MAX_FILES_PER_VARIANT = 6
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]

  const isValidFile = (file: File): boolean => {
    return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
  }

  const addColorVariant = () => {
    if (newColor.trim() && !variants.some(v => v.color.toLowerCase() === newColor.trim().toLowerCase())) {
      setVariants([...variants, { color: newColor.trim(), files: [] }])
      setNewColor("")
    }
  }

  const removeColorVariant = (color: string) => {
    setVariants(variants.filter(v => v.color !== color))
  }

  const addFilesToVariant = (color: string, newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter(isValidFile)

    setVariants(prev => prev.map(variant => {
      if (variant.color === color) {
        if (validFiles.length + variant.files.length > MAX_FILES_PER_VARIANT) {
          alert(`You can upload a maximum of ${MAX_FILES_PER_VARIANT} files per color`)
          return variant
        }

        const uploadedFiles = validFiles.map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: formatFileSize(file.size),
        }))

        // Auto set cover photo if none selected
        if (!coverPhoto && uploadedFiles.length > 0) {
          setCoverPhoto(uploadedFiles[0].id)
        }

        return { ...variant, files: [...variant.files, ...uploadedFiles] }
      }
      return variant
    }))
  }

  const deleteFile = (color: string, id: string) => {
    setVariants(prev => prev.map(variant => {
      if (variant.color === color) {
        const updatedFiles = variant.files.filter(f => f.id !== id)
        if (coverPhoto === id) {
          setCoverPhoto(updatedFiles.length > 0 ? updatedFiles[0].id : null)
        }
        return { ...variant, files: updatedFiles }
      }
      return variant
    }))
  }

  const validateStep = () => {
    if (variants.length === 0) {
      alert("Please add at least one color variant and upload files.")
      return false
    }
    
    // Check if any variant has 0 files
    const emptyVariant = variants.find(v => v.files.length === 0)
    if (emptyVariant) {
      alert(`Please upload at least one file for the color: ${emptyVariant.color}`)
      return false
    }
    
    return true
  }

  const handleContinue = () => {
    if (!validateStep()) return

    // Calculate generic files array for backwards compatibility with other steps that might expect it, though we rely on variants now
    const allFiles = variants.flatMap(v => v.files);
    
    onChange({
      ...data,
      variants,
      files: allFiles,
      coverPhoto,
      color: variants.map(v => v.color) // inject color array for other steps
    })

    onNext()
  }

  // Helper for Dropzone
  const FileDropzone = ({ variant }: { variant: Variant }) => {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dragCounter = useRef(0)

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
      addFilesToVariant(variant.color, e.dataTransfer.files)
    }

    return (
      <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: variant.color.toLowerCase() }}></span>
            <h3 className="font-bold text-gray-800 capitalize">{variant.color}</h3>
          </div>
          <button 
            onClick={() => removeColorVariant(variant.color)}
            className="text-red-500 hover:text-red-700 text-sm font-semibold"
          >
            Remove Color
          </button>
        </div>

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 transition cursor-pointer mb-4 ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => addFilesToVariant(variant.color, e.target.files)}
            className="hidden"
            disabled={variant.files.length >= MAX_FILES_PER_VARIANT}
          />
          <div className="flex flex-col items-center justify-center">
            <Cloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-600 text-center text-sm mb-1">
              <span className="font-semibold text-blue-600 hover:underline" onClick={() => fileInputRef.current?.click()}>Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">Max {MAX_FILES_PER_VARIANT} files, 50MB each</p>
          </div>
        </div>

        {/* Uploaded Files List for this Variant */}
        {variant.files.length > 0 && (
          <div className="space-y-2">
            {variant.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                  {file.file.type.startsWith("image/") ? (
                    <Image src={file.preview} alt={file.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <span className="font-semibold text-gray-600 text-xs">PDF</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
                <button
                  onClick={() => deleteFile(variant.color, file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const allFiles = variants.flatMap(v => v.files);

  return (
    <div>
      <div className="w-full bg-[#0000000F] rounded-lg p-4 sm:p-6">
        <div className="bg-[#FFFFFF] p-6 rounded-lg">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#000000] mb-1">Color Variants & Images</h2>
            <p className="text-sm text-gray-600">First add a color, then upload images specifically for that color.</p>
          </div>

          {/* Add Color Section */}
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input 
              type="text" 
              placeholder="E.g. Red, Blue, XL (if you want size variants instead)" 
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addColorVariant()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={addColorVariant}
              disabled={!newColor.trim()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Color
            </button>
          </div>

          {/* Variants List */}
          <div className="space-y-4">
            {variants.map(variant => (
              <FileDropzone key={variant.color} variant={variant} />
            ))}
            
            {variants.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">No color variants added yet.</p>
                <p className="text-sm text-gray-400 mt-1">Add a color above to start uploading images.</p>
              </div>
            )}
          </div>

          {/* Cover Photo Selection */}
          {allFiles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="font-semibold text-gray-900 text-sm block mb-2">
                Use Cover Photo (Main Image)
              </label>
              <select
                value={coverPhoto || ""}
                onChange={(e) => setCoverPhoto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a cover photo</option>
                {allFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex justify-end items-center gap-6 mt-8">
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
    </div>
  )
}
