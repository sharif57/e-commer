/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "../icon/logo";
import { useResetPasswordMutation } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import Link from "next/link";

 function CreatePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [resetPassword] = useResetPasswordMutation(); 

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("verifyToken") : null;
    const token = tokenFromUrl || tokenFromStorage;
    if (token) {
      setResetToken(token);
      if (tokenFromUrl) {
        localStorage.setItem("verifyToken", tokenFromUrl);
      }
    }
  }, [searchParams]);

//   {
//     "newPassword": "22222222",
//     "confirmPassword": "22222222"
// }

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call (replace with actual API logic)

      const res = await resetPassword({ newPassword: password, confirmPassword, token: resetToken }).unwrap();
      toast.success(res?.data?.message || "Password created successfully");
      console.log("Password successfully created:", password);
      localStorage.removeItem("verifyToken");
      router.push("/auth"); // Redirect to login after password reset
    } catch (error : any) {
      toast.error( error?.data?.message || "Failed to create password. Please try again.");
      console.error("Error creating password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full  flex flex-col justify-center px-4">
      {/* Logo */}
            <Link href="/" className="mb-8 text-start">
                <Logo />
            </Link>
      {/* Card Container */}
      <div className="bg-card max-w-md mx-auto rounded-lg shadow-lg p-8 border border-border">
        {/* Header */}
        <div className="mb-6 text-start">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create a New Password</h2>
          <p className="text-sm text-muted-foreground">
            To keep your account safe, create a strong & unique password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`pl-10 pr-10 border h-11 rounded-lg ${
                  errors.password ? "border-destructive" : "border-input"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            <p className="pt-2 text-xs text-muted-foreground">
              Confirming your password ensures that your new password was entered correctly and matches exactly. This step is crucial for your eCommerce account to prevent login issues and secure your personal and payment information. Please re-enter your password below to confirm.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={`pl-10 pr-10 border h-11 rounded-lg ${
                  errors.confirmPassword ? "border-destructive" : "border-input"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium transition"
          >
            {isLoading ? "Creating..." : "Create Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
export default function PageCreatePassword() {
    return <Suspense fallback={<div>Loading...</div>}>
        <CreatePassword />
    </Suspense>;
}