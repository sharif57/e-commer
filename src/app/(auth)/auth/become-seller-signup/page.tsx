/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useRegisterMutation } from '@/redux/feature/authSlice'
import BecomeSellerWrapper from '@/components/auth/become-seller-wrapper'

interface FormData {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {}

    if (!data.firstName.trim()) errors.firstName = 'First name is required'
    if (!data.lastName.trim()) errors.lastName = 'Last name is required'

    if (!data.email.trim()) {
        errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = 'Enter a valid email address'
    }

    if (!data.password) {
        errors.password = 'Password is required'
    } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
    }

    return errors
}

export default function SignupPage() {
    const router = useRouter()
    const [register] = useRegisterMutation()

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const validationErrors = validateForm(formData)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: 'seller',
            }

            const res = await register(payload).unwrap()
            toast.success(res?.data?.message || 'Registration successful')
            router.push(`/auth/become-seller-otp?email=${encodeURIComponent(formData.email)}`)
        } catch (error: any) {
            toast.error(error?.data?.message || 'Registration failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputClass = (field: keyof FormErrors) =>
        [
            'w-full px-4 py-3.5 border rounded-xl text-base bg-white text-[#1a1a18]',
            'placeholder-gray-400 outline-none transition-all',
            errors[field]
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                : 'border-gray-300 focus:border-[#2D7A54] focus:ring-2 focus:ring-[#2D7A54]/10',
        ].join(' ')

    return (
        <BecomeSellerWrapper>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#111] mb-6">Create seller account</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Name grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="e.g. John"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={inputClass('firstName')}
                            />
                            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="e.g. Doe"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={inputClass('lastName')}
                            />
                            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={inputClass('email')}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={inputClass('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Terms */}
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                        By continuing, you agree to Ebakx&apos;s{' '}
                        <Link href="/terms" className="text-[#2D7A54] hover:underline">Terms of Use</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-[#2D7A54] hover:underline">Privacy Policy</Link>.
                    </p>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl text-base font-bold text-white bg-[#2D7A54] hover:bg-[#246344] active:scale-[0.99] transition-all disabled:opacity-70"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>

                {/* Already have an account */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-bold">Already have an account?</h3>
                    </div>
                    <Link
                        href="/auth/become-seller-login"
                        className="block w-full py-4 rounded-xl text-base font-bold text-white bg-[#2D7A54] text-center hover:bg-[#246344] transition-all"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </BecomeSellerWrapper>
    )
}