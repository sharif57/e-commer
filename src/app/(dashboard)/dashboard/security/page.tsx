"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import { useChangePasswordMutation } from "@/redux/feature/authSlice"
import { toast } from "sonner"

export default function PasswordEditPage() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

    const [changePassword, { isLoading: isSaving }] = useChangePasswordMutation();



    const handleSaveChanges = async () => {
        // Validate inputs
        if (!currentPassword.trim()) {
            setMessage({ type: "error", text: "Current password is required" })
            return
        }
        if (!newPassword.trim()) {
            setMessage({ type: "error", text: "New password is required" })
            return
        }
        if (newPassword.length < 8) {
            setMessage({ type: "error", text: "New password must be at least 8 characters" })
            return
        }
        if (currentPassword === newPassword) {
            setMessage({ type: "error", text: "New password must be different from current password" })
            return
        }
        if (!confirmPassword.trim()) {
            setMessage({ type: "error", text: "Confirm password is required" })
            return
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New password and confirm password do not match" })
            return
        }
        try {
            setMessage(null)
            const res = await changePassword({ currentPassword, newPassword, confirmPassword }).unwrap()
            toast.success(res?.message || "Password changed successfully!")
            setMessage({ type: "success", text: "Password changed successfully!" })
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setShowCurrentPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)
        } catch (error) {
            const err = error as { data?: { message?: string }; error?: string }
            const errMsg = err?.data?.message || err?.error || "Failed to update password"
            setMessage({ type: "error", text: errMsg })
            toast.error(errMsg)
        }
    }

    const handleCancel = () => {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
        setMessage(null)
    }

    return (
        <div className="">
            <title>
                Edit Password
            </title>
            <div className="mb-6 space-y-6">
                <Breadcrumb items={[
                    { label: "Account management", href: "/dashboard" },
                    { label: "Security Settings" },
                ]} />
            </div>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <h1 className="text-xl font-bold text-foreground mb-8">Password</h1>

                {/* Edit Password Form */}
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-card-foreground mb-6">Edit password</h2>

                    {/* Success/Error Message */}
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg ${message.type === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Current Password Field */}
                    <div className="mb-6">
                        <label htmlFor="current-password" className="block text-sm font-medium text-foreground mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password Field */}
                    <div className="mb-6">
                        <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Minimum 8 characters</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Re-enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-2.5 border-2 border-foreground text-foreground font-medium rounded-lg hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="px-6  bg-primary  text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                        >
                            {isSaving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
