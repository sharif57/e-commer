/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useState } from "react"
// import { ArrowRight } from "lucide-react"
// import { useGetCategoriesQuery, useGetSubCategoriesQuery } from "@/redux/feature/buyer/categorySlice"

// interface StepOneProps {
//     data: any
//     onChange: (data: any) => void
//     onNext: () => void
// }

// export default function ListOne({ data, onChange, onNext }: StepOneProps) {
//     const [errors, setErrors] = useState<Record<string, string>>({})

//     const selectedCategoryId = data.categoryId || data.businessType || ""

//     const { data: categoryResponse, isLoading: categoryLoading } = useGetCategoriesQuery(undefined)
//     const categories = categoryResponse?.data?.result || []

//     const { data: subCategoryResponse, isLoading: subCategoryLoading } = useGetSubCategoriesQuery(selectedCategoryId || undefined)
//     const subCategories = subCategoryResponse?.data?.result?.filter((sub: any) => sub.categoryId === selectedCategoryId) || []
//     console.log(subCategories)

//     const validateStep = () => {
//         const newErrors: Record<string, string> = {}
//         if (!selectedCategoryId) newErrors.businessType = "Category is required"
//         if (!data.subCategoryId) newErrors.subCategoryId = "Subcategory is required"

//         setErrors(newErrors)
//         return Object.keys(newErrors).length === 0
//     }

//     const handleContinue = () => {
//         if (validateStep()) {
//             onNext()
//         }
//     }

//     return (
//         <div className="max-w-3xl mx-auto">
//             <div className="flex justify-end items-center mb-8">
//                 <button
//                     onClick={handleContinue}
//                     className="group px-6 py-2.5 md:px-6 md:py-2 flex items-center justify-center gap-2 bg-primary text-white rounded-full font-semibold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
//                 >
//                     Continue
//                     <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
//                 </button>
//             </div>

//             <div className="bg-[#0000000F] rounded-xl p-8 space-y-6">
//                 <h1 className="text-xl font-bold text-gray-900">Pick the category that best fits your product</h1>

//                 {/* Category */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
//                     <select
//                         value={selectedCategoryId}
//                         onChange={(e) => onChange({ categoryId: e.target.value, businessType: e.target.value, subCategoryId: "" })}
//                         disabled={categoryLoading}
//                         className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                         <option value="">{categoryLoading ? "Loading categories..." : "Select a category"}</option>
//                         {categories.map((category: any) => (
//                             <option key={category._id} value={category._id}>
//                                 {category.title}
//                             </option>
//                         ))}
//                     </select>
//                     {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
//                 </div>

//                 {/* Subcategory */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-900 mb-2">Subcategory</label>
//                     <select
//                         value={data.subCategoryId || ""}
//                         onChange={(e) => onChange({ subCategoryId: e.target.value })}
//                         disabled={!selectedCategoryId || subCategoryLoading}
//                         className="w-full px-4 py-2 border border-[#171717] rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                         <option value="">{subCategoryLoading ? "Loading subcategories..." : !selectedCategoryId ? "Select a category first" : "Select a subcategory"}</option>
//                         {subCategories.map((subCategory: any) => (
//                             <option key={subCategory._id} value={subCategory._id}>
//                                 {subCategory.title}
//                             </option>
//                         ))}
//                     </select>
//                     <p className="text-[11px] text-[#666666] font-medium mt-1">Choose a subcategory to help customers find your products easily.</p>
//                     {errors.subCategoryId && <p className="text-red-500 text-xs mt-1">{errors.subCategoryId}</p>}
//                 </div>
//             </div>
//         </div>
//     )
// }
"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/redux/feature/buyer/categorySlice"

interface StepOneProps {
  data: any
  onChange: (data: any) => void
  onNext: () => void
}

export default function ListOne({ data, onChange, onNext }: StepOneProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedCategoryId = data.categoryId || data.businessType || ""

  // ✅ Categories
  const { data: categoryResponse, isLoading: categoryLoading } =
    useGetCategoriesQuery({ limit: 100 })

  const categories = categoryResponse?.data?.result || []

  // ✅ Subcategories (already filtered by API)
  const {
    data: subCategoryResponse,
    isLoading: subCategoryLoading,
  } = useGetSubCategoriesQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  })

  const subCategories = subCategoryResponse?.data?.result || []

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedCategoryId)
      newErrors.businessType = "Category is required"

    if (!data.subCategoryId)
      newErrors.subCategoryId = "Subcategory is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateStep()) {
      onNext()
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-end items-center mb-8">
        <button
          onClick={handleContinue}
          className="group px-6 py-2.5 flex items-center gap-2 bg-primary text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Continue
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="bg-[#0000000F] rounded-xl p-8 space-y-6">
        <h1 className="text-xl font-bold text-gray-900">
          Pick the category that best fits your product
        </h1>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) =>
              onChange({
                categoryId: e.target.value,
                businessType: e.target.value,
                subCategoryId: "",
              })
            }
            disabled={categoryLoading}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
          >
            <option value="">
              {categoryLoading ? "Loading..." : "Select a category"}
            </option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.businessType}
            </p>
          )}
        </div>

        {/* Subcategory */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Subcategory
          </label>
          <select
            value={data.subCategoryId || ""}
            onChange={(e) =>
              onChange({ subCategoryId: e.target.value })
            }
            disabled={!selectedCategoryId || subCategoryLoading}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
          >
            <option value="">
              {subCategoryLoading
                ? "Loading..."
                : "Select a subcategory"}
            </option>

            {subCategories.map((sub: any) => (
              <option key={sub._id} value={sub._id}>
                {sub.title}
              </option>
            ))}
          </select>

          {errors.subCategoryId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subCategoryId}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
