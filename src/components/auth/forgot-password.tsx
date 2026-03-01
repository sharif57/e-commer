/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "../icon/logo"
import { useRouter } from "next/navigation"
import { useForgotPasswordMutation } from "@/redux/feature/authSlice"
import { toast } from "sonner"

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [isLoading, setIsLoading] = useState(false)

    const [forgotPassword] = useForgotPasswordMutation();


    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {}

        if (!email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const res = await forgotPassword({ email }).unwrap();

            toast.success(res?.data?.message || "OTP sent successfully");

            router.replace(
                `/auth/forgot-otp?email=${encodeURIComponent(email)}`
            );
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error?.data?.message || "Request failed");
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <div className="w-full ">
            {/* Logo */}
            <div className="mb-8 text-start">
                <Logo />
            </div>

            {/* Card Container */}
            <div className="bg-card max-w-md mx-auto rounded-lg shadow-lg p-8 border border-border">
                {/* Header */}
                <div className="mb-6 text-start">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Forgot password?</h2>
                    <p>Submit your registered email address to get 6 digit OTP to verify your account. </p>
                </div>


                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email or username
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email or username"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email) setErrors({ ...errors, email: undefined })
                                }}
                                className={`pl-10 h-11 border border-[#171717] rounded-lg ${errors.email ? "border-destructive" : ""}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>


                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-white  font-medium "
                    >
                        {isLoading ? "Continuing..." : "Continue"}
                    </Button>
                </form>
            </div>


        </div>
    )
}
