/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Check } from "lucide-react";
import Logo from "../icon/logo";
import { useRouter } from "next/navigation";
import { useGoogleLoginMutation, useRegisterMutation } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { saveTokens } from "@/service/authService";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/feature/authApi";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    businessType: "",
    businessDescription: "",
    // agreeToTerms: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [register] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (accountType === "seller") {
      if (!formData.businessType.trim()) {
        newErrors.businessType = "Business type is required";
      }
      if (!formData.businessDescription.trim()) {
        newErrors.businessDescription = "Business description is required";
      }
    }
    // if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: accountType,
        ...(accountType === "seller"
          ? {
            businessType: formData.businessType,
            businessDescription: formData.businessDescription,
          }
          : {}),
      };

      const res = await register(payload).unwrap();

      toast.success(res?.data?.message || "Registration successful");

      // Store account type for next step
      localStorage.setItem("accountType", accountType);

      // Redirect to OTP verification
      router.push(
        `/auth/verfiy-otp?email=${encodeURIComponent(formData.email)}`
      );

      // Reset form after successful submit
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        businessType: "",
        businessDescription: "",
        // agreeToTerms: false,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const decodeGoogleToken = (token: string) => {
    const parts = token.split(".")
    if (parts.length < 2) return null

    try {
      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
      const decoded = JSON.parse(atob(padded)) as {
        email?: string
        name?: string
        given_name?: string
        picture?: string
        sub?: string
      }

      return decoded
    } catch {
      return null
    }
  }

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      const decoded = decodeGoogleToken(credentialResponse.credential)
      if (!decoded?.email) {
        throw new Error("Unable to decode Google credential")
      }

      const payload = {
        email: decoded.email,
        firstName: decoded.given_name || decoded.name || "",
        image: decoded.picture || "",
        uid: decoded.sub || "",
        token: credentialResponse.credential,
      }

      const response = await googleLogin(payload).unwrap();
      const accessToken = response?.data?.accessToken || response?.access || response?.data?.access
      const user = response?.data?.user || response?.user

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken)
        await saveTokens(accessToken)
      }
      if (user) {
        localStorage.setItem("accountType", user?.role)
        dispatch(setUser(user))
      }
      router.push("/")

      // await refetch();

    } catch (error: unknown) {
      console.error("Google login error:", error);
      toast.error(
        error &&
          typeof error === "object" &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data &&
          "message" in error.data
          ? (error.data as { message: string }).message
          : error instanceof Error
            ? error.message
            : "Google login failed. Please try again."
      );
    } finally {
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="">
      {/* Logo */}
      <Link href="/" className="mb-8 text-start">
        <Logo />
      </Link>

      <div className="flex max-w-6xl mx-auto">
        {/* Left Section (Image) */}
        <div className="hidden md:flex w-3/5 relative overflow-hidden">
          <Image
            src="/images/auth.png"
            alt="Couple outdoor lifestyle"
            height={800}
            width={800}
            className="object-cover h-full w-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Account Type Tabs */}
            <div className="flex items-center justify-center gap-4 mb-8 ">
              <Tabs
                value={accountType}
                className="bg-input px-2 py-1 rounded-lg"
                onValueChange={(value) => {
                  const selectedType = value as "buyer" | "seller";
                  setAccountType(selectedType);

                  if (selectedType === "buyer") {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.businessType;
                      delete next.businessDescription;
                      return next;
                    });
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="buyer">Personal</TabsTrigger>
                  <TabsTrigger value="seller">Business</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Create an account
              </h2>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/auth"
                  className="text-[#1877F2] hover:underline font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>

            {/* Google Sign Up */}
            {/* <Button
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full mb-6 text-sm font-bold h-11 border-2 border-[#171717] bg-secondary"
            >
              <Google />
              Continue with Google
            </Button> */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap

              shape="pill"
              theme="outline"
              size="large"
              text="continue_with"
            // width="400"
            />

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-medium text-foreground mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.firstName ? "border-destructive" : "border-border"
                      }`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-medium text-foreground mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.lastName ? "border-destructive" : "border-border"
                      }`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {accountType === "seller" && (
                <>
                  <div>
                    <label
                      htmlFor="businessType"
                      className="block text-xs font-medium text-foreground mb-2"
                    >
                      Your business type
                    </label>
                    <input
                      id="businessType"
                      type="text"
                      placeholder="e.g. Fashion, Electronics"
                      value={formData.businessType}
                      onChange={(e) =>
                        setFormData({ ...formData, businessType: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.businessType ? "border-destructive" : "border-border"
                        }`}
                    />
                    {errors.businessType && (
                      <p className="text-xs text-destructive mt-1">{errors.businessType}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="businessDescription"
                      className="block text-xs font-medium text-foreground mb-2"
                    >
                      Business description
                    </label>
                    <textarea
                      id="businessDescription"
                      placeholder="Tell us about your business"
                      value={formData.businessDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, businessDescription: e.target.value })
                      }
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none ${errors.businessDescription ? "border-destructive" : "border-border"
                        }`}
                    />
                    {errors.businessDescription && (
                      <p className="text-xs text-destructive mt-1">{errors.businessDescription}</p>
                    )}
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.email ? "border-destructive" : "border-border"
                    }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-foreground mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all pr-10 ${errors.password ? "border-destructive" : "border-border"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  // checked={formData.agreeToTerms}
                  // onChange={(e) =>
                  //   setFormData({ ...formData, agreeToTerms: e.target.checked })
                  // }
                  className="mt-1 w-4 h-4 rounded border-border bg-input cursor-pointer accent-accent"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  By continuing, you agree to etolex’s{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-destructive">{errors.agreeToTerms}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Create account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
