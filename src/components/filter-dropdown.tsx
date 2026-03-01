'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

type FilterOption = {
  id: string
  label: string
  checked: boolean
}

type FilterDropdownProps = {
  title: string
  options: FilterOption[]
  onApply: (selected: FilterOption[]) => void
}

export function FilterDropdown({ title, options: initialOptions, onApply }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState(initialOptions)

  const handleToggle = (id: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, checked: !opt.checked } : opt
    ))
  }

  const handleApply = () => {
    onApply(options)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-300 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-3">
            {options.map(option => (
              <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleToggle(option.id)}
                    className="w-5 h-5 accent-yellow-400 cursor-pointer"
                  />
                  {option.checked && (
                    <Check className="w-3 h-3 text-yellow-400 absolute left-1 top-1" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-1 px-4 rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
