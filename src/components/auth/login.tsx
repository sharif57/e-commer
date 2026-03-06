/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Logo from "../icon/logo"
import Link from "next/link"
import { useGoogleLoginMutation, useLoginMutation } from "@/redux/feature/authSlice"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/feature/authApi"
import { useRouter } from "next/navigation"
import { saveTokens } from "@/service/authService"
import { GoogleLogin } from "@react-oauth/google"

export default function SignInForm() {
    const dispatch = useDispatch();

    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [isLoading, setIsLoading] = useState(false)

    const [login] = useLoginMutation();
    const [googleLogin] = useGoogleLoginMutation();


    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {}

        if (!email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email"
        }

        if (!password) {
            newErrors.password = "Password is required"
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        try {
            // Simulate API call
            const res = await login({ email, password }).unwrap();
            toast.success(res.data.message || "Login successful")
            localStorage.setItem("accessToken", res?.data?.accessToken);
            localStorage.setItem("accountType", res?.data?.user?.role);
            dispatch(setUser(res?.data?.user))
            await saveTokens(res?.data?.accessToken);
            router.push('/');

            await new Promise((resolve) => setTimeout(resolve, 1500))
        } catch (error: any) {
            toast.error(error.data.message || "Login failed")
            console.error("Sign in error:", error)
        } finally {
            setIsLoading(false)
        }
    }
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
        <div className="w-full ">
            {/* Logo */}
            <Link href="/" className="mb-8 text-start">
                <Logo />
            </Link>

            {/* Card Container */}
            <div className="bg-card max-w-md mx-auto rounded-lg shadow-lg p-8 border border-border">
                {/* Header */}
                <div className="mb-8 text-start">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h2>
                    <p className="text-sm text-foreground">
                        Don&rsquo;t have an account?{" "}
                        <Link href="/auth/register" className="text-[#1877F2] hover:underline font-medium">
                            Create account
                        </Link>
                    </p>
                </div>

                {/* Google Sign-In Button */}
                {/* <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full mb-6 text-sm font-bold h-11 border-2 border-[#171717] bg-secondary "
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
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
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
                                className={`pl-10 h-11 border rounded-lg border-[#171717] ${errors.email ? "border-destructive" : ""}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errors.password) setErrors({ ...errors, password: undefined })
                                }}
                                className={`pl-10 pr-10 border rounded-lg border-[#171717] h-11 ${errors.password ? "border-destructive" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                className="border border-[#171717]"
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            />
                            <label htmlFor="remember" className="text-sm  text-foreground cursor-pointer font-medium">
                                Stay logged in
                            </label>
                        </div>
                        <a href="#" className="text-sm text-accent hover:underline font-medium">
                            Forgot password
                        </a>
                    </div>

                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-white  font-medium "
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                    <div className="flex justify-center ">
                        <Link href="/auth/forgot-password" className="text-sm text-center text-foreground hover:underline font-medium">Forgot Password</Link>
                    </div>
                </form>
            </div>


        </div>
    )
}
