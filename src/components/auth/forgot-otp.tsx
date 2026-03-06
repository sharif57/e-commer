/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Logo from "../icon/logo";
import { useVerifyEmailMutation } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import Link from "next/link";

function ForgotOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [verifyEmail] = useVerifyEmailMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate an API call delay
      const res = await verifyEmail({ email, oneTimeCode: Number(otp) }).unwrap();
      toast.success(res.data.message || "OTP verification successful");
      localStorage.setItem("verifyToken", res?.data?.accessToken);

      // After successful verification
      router.push(`/auth/create-password`);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      toast.error(err?.data?.message || "OTP verification failed");
      setError(err?.data?.message || "Something went wrong. Please try again.");
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

      {/* Card */}
      <div className="bg-card max-w-md mx-auto rounded-lg shadow-lg p-8 border border-border">
        {/* Header */}
        <div className="mb-6 text-start">
          <h2 className="text-2xl font-bold text-foreground mb-2">Submit OTP</h2>
          <p className="text-sm text-muted-foreground">
            We just sent you a 6-digit OTP code to <span className="font-medium">{email}</span>.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Enter your OTP
            </label>

            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                className="border-2"
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ForgotOtpWrapper() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ForgotOtp />
  </Suspense>;
}