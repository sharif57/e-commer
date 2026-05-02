/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, ShieldCheck, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '@/components/icon/logo'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '@/redux/feature/authSlice'
import { setUser } from '@/redux/feature/authApi'
import { saveTokens } from '@/service/authService'

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
    } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
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
            router.push('/')
        } catch (error: any) {
            toast.error(error?.data?.message || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass = (field: keyof FormErrors) =>
        [
            'w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-[#fafaf8] text-[#1a1a18]',
            'placeholder-[#c1bdb6] outline-none transition-all',
            errors[field]
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                : 'border-[#e5e3dc] focus:border-[#0d9e75] focus:bg-white focus:ring-2 focus:ring-[#0d9e75]/10',
        ].join(' ')

    return (
        <div className="min-h-screen bg-[#f7f6f2] font-sans">

            {/* NAV */}
            <nav className="bg-white border-b border-[#e5e3dc] px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
                <Link href="/">
                    <Logo />
                </Link>
                <span className="text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" className="text-[#0d9e75] font-semibold hover:underline">
                        Sign up free
                    </Link>
                </span>
            </nav>

            {/* MAIN GRID */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                {/* LEFT: HERO */}
                <div className="lg:sticky lg:top-12 order-2 lg:order-1 lg:pt-6">
                    <div className="inline-flex items-center gap-2 bg-[#e6f4ef] text-[#0a7a5a] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0d9e75]" />
                        Welcome back
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-[#111] mb-5">
                        Good to see<br />
                        you{' '}
                        <em className="text-[#0d9e75]" style={{ fontStyle: 'italic' }}>
                            again
                        </em>
                    </h1>

                    <p className="text-base text-gray-500 leading-relaxed mb-9">
                        Sign in to manage your store, track orders, and keep growing your business.
                    </p>

                    <div className="flex flex-col gap-3.5 mb-10">
                        {[
                            { icon: <ShieldCheck size={13} strokeWidth={2.5} />, text: 'Your data is always secure' },
                            {
                                icon: (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                ),
                                text: 'Real-time dashboard & analytics',
                            },
                            {
                                icon: (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                ),
                                text: '24/7 U.S. based support team',
                            },
                            { icon: <MapPin size={13} strokeWidth={2.5} />, text: 'Manage shipping from anywhere' },
                        ].map((p, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                <div className="w-7 h-7 rounded-lg bg-[#e6f4ef] flex items-center justify-center flex-shrink-0 text-[#0d9e75]">
                                    {p.icon}
                                </div>
                                {p.text}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex">
                            {[
                                { initials: 'AK', bg: '#0d9e75' },
                                { initials: 'MR', bg: '#3b82f6' },
                                { initials: 'SL', bg: '#f59e0b' },
                                { initials: 'JP', bg: '#8b5cf6' },
                            ].map((a, i) => (
                                <span
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white"
                                    style={{ background: a.bg, marginLeft: i === 0 ? 0 : '-8px' }}
                                >
                                    {a.initials}
                                </span>
                            ))}
                        </div>
                        <div className="text-sm text-gray-500 leading-snug">
                            <span className="font-semibold text-[#1a1a18]">12,000+ sellers</span> already growing<br />
                            their business with Ebakx
                        </div>
                    </div>
                </div>

                {/* RIGHT: FORM CARD */}
                <div className="bg-white rounded-3xl border border-[#e5e3dc] p-6 sm:p-10 order-1 lg:order-2">

                    <div className="inline-flex items-center gap-1.5 bg-[#e6f4ef] text-[#0a7a5a] text-xs font-bold px-2.5 py-1 rounded-full mb-3 tracking-wide">
                        <ShieldCheck size={11} strokeWidth={2.5} />
                        Secure sign in
                    </div>

                    <div className="mb-6">
                        <h2 className="text-[22px] font-bold text-[#111] tracking-tight mb-1.5">
                            Sign in to your account
                        </h2>
                        <p className="text-sm text-gray-400">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                        {/* Email */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={inputClass('email')}
                                />
                            </div>
                            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-[13px] font-semibold text-gray-700">
                                    Password
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-[12px] text-[#0d9e75] font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={[
                                        'w-full pl-10 pr-11 py-2.5 border rounded-xl text-sm bg-[#fafaf8] text-[#1a1a18]',
                                        'placeholder-[#c1bdb6] outline-none transition-all',
                                        errors.password
                                            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                                            : 'border-[#e5e3dc] focus:border-[#0d9e75] focus:bg-white focus:ring-2 focus:ring-[#0d9e75]/10',
                                    ].join(' ')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-gray-400 leading-relaxed pt-1">
                            By signing in you agree to our{' '}
                            <a href="#" className="text-[#0d9e75] font-medium hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-[#0d9e75] font-medium hover:underline">Privacy Policy</a>
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-[15px] font-bold text-white bg-primary hover:bg-primary/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} strokeWidth={2.5} />
                                    Sign in
                                </>
                            )}
                        </button>

                        <p className="text-center text-[13px] text-gray-400 pt-1">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/become-seller-signup" className="text-[#0d9e75] font-semibold hover:underline">
                                Sign up free
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* FEATURES STRIP */}
            <section className="bg-white border-t border-[#e5e3dc] py-10 px-4 sm:px-10">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#e6f4ef] flex items-center justify-center flex-shrink-0">
                            <ShieldCheck size={20} className="text-[#0d9e75]" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-[#111] mb-1">U.S. tax compliance</h3>
                            <p className="text-[13px] text-gray-400 leading-relaxed">
                                Automatic sales tax across all 50 states. Stay IRS-ready year round.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                            <MapPin size={20} className="text-[#3b82f6]" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-[#111] mb-1">Integrated shipping</h3>
                            <p className="text-[13px] text-gray-400 leading-relaxed">
                                Print labels and compare rates with FedEx, UPS, and USPS from your dashboard.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
                            <Phone size={20} className="text-[#d97706]" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold text-[#111] mb-1">24/7 U.S. support</h3>
                            <p className="text-[13px] text-gray-400 leading-relaxed">
                                Real humans, not bots. Our team is available around the clock to help you grow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}