/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { Country } from "country-state-city"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/feature/userSlice"
import { toast } from "sonner"
import { useChangePasswordMutation } from "@/redux/feature/authSlice"

interface FormData {
  shopName: string
  businessEmail: string
  streetName: string
  area: string
  city: string
  zip: string
  state: string
  country: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  [key: string]: string
}

export default function AccountSettingsForm() {
  const [formData, setFormData] = useState<FormData>({
    shopName: "",
    businessEmail: "",
    streetName: "",
    area: "",
    city: "",
    zip: "",
    state: "",
    country: "United State",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { data, isLoading: isFetching } = useGetUsersQuery(undefined);
  const user = data?.data;
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<any[]>([])

  // Load countries on mount
  useEffect(() => {
    try {
      const allCountries = Country.getAllCountries()
      setCountries(allCountries || [])
    } catch (error) {
      console.error("Error loading countries:", error)
    }
  }, [])

  // Load user data into form when data is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shopName: user.firstName || "",
        businessEmail: user.email || "",
        streetName: user.streetName || "",
        area: user.area || "",
        city: user.city || "",
        zip: user.zip?.toString() || "",
        state: user.state || "",
        country: user.country || "United State",
      }))
    }
  }, [user])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSaveGeneralSettings = async () => {
    const generalErrors: FormErrors = {}

    if (!formData.shopName.trim()) {
      generalErrors.shopName = "Shop name is required"
    }
    if (!formData.businessEmail.trim()) {
      generalErrors.businessEmail = "Business email is required"
    } else if (!validateEmail(formData.businessEmail)) {
      generalErrors.businessEmail = "Please enter a valid email"
    }
    if (!formData.streetName.trim()) {
      generalErrors.streetName = "Street name is required"
    }
    if (!formData.city.trim()) {
      generalErrors.city = "City is required"
    }
    if (!formData.zip.trim()) {
      generalErrors.zip = "ZIP code is required"
    }

    if (Object.keys(generalErrors).length > 0) {
      setErrors(generalErrors)
      return
    }

    setIsLoading(true)
    try {
      const updateData = {
        firstName: formData.shopName,
        email: formData.businessEmail,
        streetName: formData.streetName,
        area: formData.area,
        city: formData.city,
        zip: parseInt(formData.zip),
        state: formData.state,
        country: formData.country,
      }

      const response = await updateUser(updateData)

      if (response.data?.success) {
        toast.success(response.data?.message || "General settings saved successfully!")
        setSuccessMessage(response.data?.message || "General settings saved successfully!")
        setErrors({})
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        toast.error(response.data?.message || "Failed to save settings")
        setErrors({ general: response.data?.message || "Failed to save settings" })
      }
    } catch (error: any) {
      console.error("Error saving settings:", error)
      const errorMsg = error?.data?.message || "Failed to save settings"
      toast.error(errorMsg)
      setErrors({ general: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const securityErrors: FormErrors = {}

    if (!formData.currentPassword) {
      securityErrors.currentPassword = "Current password is required"
    }
    if (!formData.newPassword) {
      securityErrors.newPassword = "New password is required"
    }
    if (!formData.confirmPassword) {
      securityErrors.confirmPassword = "Confirm password is required"
    }
    if (formData.newPassword && formData.newPassword.length < 8) {
      securityErrors.newPassword = "Password must be at least 8 characters"
    }
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      securityErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(securityErrors).length > 0) {
      setErrors(securityErrors)
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      }

      const response = await changePassword(payload).unwrap();

        toast.success(response.data?.message || "Password updated successfully!")
        setSuccessMessage(response.data?.message || "Password updated successfully!")
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
        setErrors({})
        setTimeout(() => setSuccessMessage(""), 3000)
       
    } catch (error: any) {
      console.error("Error updating password:", error)
      const errorMsg = error?.data?.message || "Failed to update password"
      toast.error(errorMsg)
      setErrors({ password: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#000000]">Account settings</h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* General Settings Section */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">General</h2>
        </div>

        {/* Shop Name & Business Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="shopName" className="text-sm font-medium text-foreground">
              Shop Name
            </label>
            <Input
              id="shopName"
              name="shopName"
              type="text"
              value={formData.shopName}
              onChange={handleInputChange}
              placeholder="Enter shop name"
              className={errors.shopName ? "border-red-500" : "border border-[#171717]"}
            />
            {errors.shopName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.shopName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="businessEmail" className="text-sm font-medium text-foreground">
              Business Email
            </label>
            <Input
              id="businessEmail"
              name="businessEmail"
              type="email"
              disabled
              value={formData.businessEmail}
              onChange={handleInputChange}
              placeholder="Enter business email"
              className={errors.businessEmail ? "border-red-500" : "border border-[#171717]"}
            />
            {errors.businessEmail && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.businessEmail}
              </p>
            )}
          </div>
        </div>

        {/* Business Address Section */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Business Address</p>

          {/* Street Name */}
          <div className="space-y-2 mb-6">
            <label htmlFor="streetName" className="text-sm font-medium text-foreground">
              Street Name
            </label>
            <Input
              id="streetName"
              name="streetName"
              type="text"
              value={formData.streetName}
              onChange={handleInputChange}
              placeholder="Enter street name"
              className={errors.streetName ? "border-red-500" : "border border-[#171717]"}
            />
            {errors.streetName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.streetName}
              </p>
            )}
          </div>

          {/* Area */}
          <div className="space-y-2 mb-6">
            <label htmlFor="area" className="text-sm font-medium text-foreground">
              Area
            </label>
            <Input
              id="area"
              name="area"
              type="text"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Enter area name"
              className="border border-[#171717]"
            />
          </div>

          {/* City & ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-foreground">
                City
              </label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className={errors.city ? "border-red-500" : "border border-[#171717]"}
              />
              {errors.city && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.city}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="zip" className="text-sm font-medium text-foreground">
                ZIP
              </label>
              <Input
                id="zip"
                name="zip"
                type="text"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                className={errors.zip ? "border-red-500" : "border border-[#171717]"}
              />
              {errors.zip && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.zip}
                </p>
              )}
            </div>
          </div>

          {/* State */}
          <div className="space-y-2 mb-6">
            <label htmlFor="state" className="text-sm font-medium text-foreground">
              State (Optional)
            </label>
            <Input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter state"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-foreground">
              Country
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-input border border-input rounded-md text-foreground appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select a country</option>
                {countries.length > 0 ? (
                  countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading countries...</option>
                )}
              </select>
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Save General Changes Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSaveGeneralSettings}
            disabled={isLoading || isFetching}
            className="text-sm text-muted-foreground hover:text-foreground"
            variant="ghost"
          >
            {isLoading || isFetching ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </section>

      {/* Security Settings Section */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Security Settings</h2>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
              Current Password
            </label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className={`pr-10 ${errors.newPassword ? "border-red-500" : "border border-[#171717]"}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
                className={`pr-10 ${errors.confirmPassword ? "border-red-500" : "border border-[#171717]"}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Save Security Changes Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleChangePassword}
            disabled={isLoading || isFetching}
            className="text-sm text-muted-foreground hover:text-foreground"
            variant="ghost"
          >
            {isLoading || isFetching ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </section>
    </div>
  )
}
