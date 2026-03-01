/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice";

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "gaming", label: "Gaming" },
  { id: "electronics", label: "Electronics" },
  { id: "accessories", label: "Accessories" },
  { id: "fashion", label: "Fashion" },
  { id: "home", label: "Home & Garden" },
];

export default function CategorySidebar({
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const {data} = useGetCategoriesQuery(undefined)

  return (
    <div className="bg-[#00000008] dark:bg-slate-800 rounded-sm p-6 sticky top-24">
      {/* Header Row */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 w-full mb-4"
      >
        <h2 className="font-medium text-lg text-[#171717] dark:text-white">
          All categories
        </h2>

        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Collapsible Items */}
      <div
        className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="space-y-2">
          {data?.data?.result?.map((category: any) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={`flex items-center gap-2 text-xs font-normal ${selectedCategory === category._id
                  ? "text-blue-600 font-semibold"
                  : "text-[#1877F2]"
                }`}
            >
              {/* SERIAL NUMBER */}
              {/* <span className="text-gray-500 dark:text-gray-300">{index + 1}.</span> */}

              {/* CATEGORY LABEL */}
              {category?.title}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
