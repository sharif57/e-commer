/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/redux/feature/authSlice'
import { setUser } from '@/redux/feature/authApi'
import { saveTokens } from '@/service/authService'
import BecomeSellerWrapper from '@/components/auth/become-seller-wrapper'

interface FormData {
    email: string
    password: string
}

interface FormErrors {
    email?: string
    password?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {}

    if (!data.email.trim()) {
        errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = 'Enter a valid email address'
    }

    if (!data.password) {
        errors.password = 'Password is required'
    }

    return errors
}

export default function LoginPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [login] = useLoginMutation()

    const [formData, setFormData] = useState<FormData>({ email: '', password: '' })
    const [errors, setErrors] = useState<FormErrors>({})
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationErrors = validateForm(formData)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setIsLoading(true)
        try {
            const res = await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            }).unwrap()

            toast.success(res.data.message || 'Login successful')
            localStorage.setItem('accessToken', res?.data?.accessToken)
            localStorage.setItem('accountType', res?.data?.user?.role)
            dispatch(setUser(res?.data?.user))
            await saveTokens(res?.data?.accessToken)
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(error?.data?.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass = (field: keyof FormErrors) =>
        [
            'w-full px-4 py-2 border-2 border-[#000000] rounded-xl text-base bg-white text-[#1a1a18]',
            'placeholder-gray-400 outline-none transition-all',
            errors[field]
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                : 'border-gray-300 focus:border-[#2D7A54] focus:ring-2 focus:ring-[#2D7A54]/10',
        ].join(' ')

    return (
        <BecomeSellerWrapper>
            <div className="space-y-6">
                <div>
                    <h2 className="text-[24px] font-bold text-[#000000] mb-6">Log in to your account</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#000000]">Email</label>
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
                        <label className="block text-sm font-medium text-[#000000]">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
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

                    {/* Remember me */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#2D7A54] focus:ring-[#2D7A54]"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-500 font-medium cursor-pointer">
                            Remember me
                        </label>
                    </div>

                    {/* Terms */}
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                        By continuing, you agree to Ebakx&apos;s{' '}
                        <Link href="/terms" className="text-[#2D7A54] hover:underline">Terms of Use</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-[#2D7A54] hover:underline">Privacy Policy</Link>.
                    </p>

                    {/* Actions */}
                    <div className="space-y-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 rounded-xl text-[14px] font-bold text-white bg-[#2D7A54] hover:bg-[#246344] active:scale-[0.99] transition-all disabled:opacity-70"
                        >
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>

                        <Link
                            href="/auth/forgot-password"
                            className="block w-full py-2 rounded-xl text-[14px] font-bold text-[#1a1a18] text-center border border-[#171717] hover:bg-gray-50 transition-all"
                        >
                            Forgot password
                        </Link>
                    </div>
                </form>

                {/* New to Ebakx */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="text-center mb-4">
                        <h3 className="text-[20px] font-semibold">New to ebax?</h3>
                    </div>
                    <Link
                        href="/auth/become-seller-signup"
                        className="block w-full py-2 rounded-xl text-[14px] font-bold text-white bg-[#2D7A54] text-center hover:bg-[#246344] transition-all"
                    >
                        Create free account
                    </Link>
                </div>
            </div>
        </BecomeSellerWrapper>
    )
}