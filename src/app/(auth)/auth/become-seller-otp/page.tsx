/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, MapPin, Phone, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '@/components/icon/logo'
import { useVerifyEmailMutation } from '@/redux/feature/authSlice'

const RESEND_SECONDS = 60

function VerifyOtpPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''

    const [verifyEmail] = useVerifyEmailMutation()

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState(RESEND_SECONDS)
    const [canResend, setCanResend] = useState(false)

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true)
            return
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000)
        return () => clearTimeout(t)
    }, [countdown])

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        setError(null)

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1) // only last digit
        setOtp(newOtp)

        // Move to next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return
        const newOtp = Array(6).fill('')
        pasted.split('').forEach((ch, i) => { newOtp[i] = ch })
        setOtp(newOtp)
        const nextEmpty = Math.min(pasted.length, 5)
        inputRefs.current[nextEmpty]?.focus()
    }

    const otpValue = otp.join('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit OTP.')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const res = await verifyEmail({ email, oneTimeCode: Number(otpValue) }).unwrap()
            toast.success(res.data.message || 'OTP verification successful')
            // localStorage.setItem('verifyToken', res?.data?.accessToken)
            router.push('/auth/become-seller-login')
        } catch (err: any) {
            toast.error(err?.data?.message || 'OTP verification failed')
            setError(err?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        if (!canResend) return
        setCanResend(false)
        setCountdown(RESEND_SECONDS)
        setOtp(Array(6).fill(''))
        setError(null)
        inputRefs.current[0]?.focus()
        // Call your resend OTP API here
        toast.success('A new OTP has been sent to your email')
    }

    const isComplete = otpValue.length === 6

    return (
        <div className="min-h-screen bg-[#f7f6f2] font-sans">

            {/* NAV */}
            <nav className="bg-white border-b border-[#e5e3dc] px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
                <Link href="/">
                    <Logo />
                </Link>
                <Link
                    href="/auth"
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0d9e75] transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to sign in
                </Link>
            </nav>

            {/* MAIN GRID */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                {/* LEFT: HERO */}
                <div className="lg:sticky lg:top-12 order-2 lg:order-1 lg:pt-6">
                    <div className="inline-flex items-center gap-2 bg-[#e6f4ef] text-[#0a7a5a] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0d9e75]" />
                        One last step
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight text-[#111] mb-5">
                        Verify your<br />
                        <em className="text-[#0d9e75]" style={{ fontStyle: 'italic' }}>
                            email
                        </em>
                    </h1>

                    <p className="text-base text-gray-500 leading-relaxed mb-2">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-base font-semibold text-[#1a1a18] mb-9 break-all">
                        {email}
                    </p>

                    <div className="flex flex-col gap-3.5 mb-10">
                        {[
                            { icon: <ShieldCheck size={13} strokeWidth={2.5} />, text: 'Your account is protected by OTP' },
                            {
                                icon: (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                ),
                                text: 'Check your spam folder if not received',
                            },
                            {
                                icon: (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                ),
                                text: 'Code expires in 10 minutes',
                            },
                        ].map((p, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                <div className="w-7 h-7 rounded-lg bg-[#e6f4ef] flex items-center justify-center flex-shrink-0 text-[#0d9e75]">
                                    {p.icon}
                                </div>
                                {p.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: FORM CARD */}
                <div className="bg-white rounded-3xl border border-[#e5e3dc] p-6 sm:p-10 order-1 lg:order-2">

                    <div className="inline-flex items-center gap-1.5 bg-[#e6f4ef] text-[#0a7a5a] text-xs font-bold px-2.5 py-1 rounded-full mb-3 tracking-wide">
                        <ShieldCheck size={11} strokeWidth={2.5} />
                        Email verification
                    </div>

                    <div className="mb-8">
                        <h2 className="text-[22px] font-bold text-[#111] tracking-tight mb-1.5">
                            Enter your OTP
                        </h2>
                        <p className="text-sm text-gray-400">
                            We emailed a code to{' '}
                            <span className="font-semibold text-[#1a1a18]">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                        {/* OTP Boxes */}
                        <div>
                            <div className="flex gap-2 sm:gap-3 justify-between" onPaste={handlePaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => { inputRefs.current[i] = el }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleChange(i, e.target.value)}
                                        onKeyDown={e => handleKeyDown(i, e)}
                                        className={[
                                            'flex-1 min-w-0 h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold',
                                            'border-2 rounded-xl bg-[#fafaf8] text-[#1a1a18] outline-none',
                                            'transition-all duration-150 caret-transparent',
                                            error
                                                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                                                : digit
                                                    ? 'border-[#0d9e75] bg-[#e6f4ef]/50 focus:border-[#0d9e75] focus:ring-2 focus:ring-[#0d9e75]/10'
                                                    : 'border-[#e5e3dc] focus:border-[#0d9e75] focus:bg-white focus:ring-2 focus:ring-[#0d9e75]/10',
                                        ].join(' ')}
                                    />
                                ))}
                            </div>
                            {error && (
                                <p className="text-[11px] text-red-500 mt-2 text-center">{error}</p>
                            )}
                        </div>

                        {/* Progress indicator */}
                        <div className="flex gap-1">
                            {otp.map((digit, i) => (
                                <div
                                    key={i}
                                    className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${digit ? 'bg-[#0d9e75]' : 'bg-[#e5e3dc]'}`}
                                />
                            ))}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || !isComplete}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-[15px] font-bold text-white bg-primary hover:bg-primary/90 active:scale-[0.99] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                    </svg>
                                    Verifying…
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={16} strokeWidth={2.5} />
                                    Verify & continue
                                </>
                            )}
                        </button>

                        {/* Resend */}
                        <p className="text-center text-[13px] text-gray-400">
                            Didn&apos;t receive the code?{' '}
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-[#0d9e75] font-semibold hover:underline"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <span className="text-gray-400">
                                    Resend in{' '}
                                    <span className="font-semibold text-[#1a1a18]">
                                        {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                                    </span>
                                </span>
                            )}
                        </p>

                        <p className="text-center text-[13px] text-gray-400">
                            Wrong email?{' '}
                            <Link href="/auth/signup" className="text-[#0d9e75] font-semibold hover:underline">
                                Go back
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


export default function SellerOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" /></svg></div>}>
            <VerifyOtpPage />
        </Suspense>
    )
}