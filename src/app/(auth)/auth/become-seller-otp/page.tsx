/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { useVerifyEmailMutation } from '@/redux/feature/authSlice'
import { setUser } from '@/redux/feature/authApi'
import { saveTokens } from '@/service/authService'
import BecomeSellerWrapper from '@/components/auth/become-seller-wrapper'

const RESEND_SECONDS = 60

function VerifyOtpForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''
    const dispatch = useDispatch()

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
            
            localStorage.setItem('accessToken', res?.data?.accessToken)
            localStorage.setItem('accountType', res?.data?.user?.role)
            dispatch(setUser(res?.data?.user))
            await saveTokens(res?.data?.accessToken)
            
            router.push('/auth/getting_start_screen')
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
        toast.success('A new OTP has been sent to your email')
    }

    const isComplete = otpValue.length === 6

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-[24px] font-bold text-[#000000] mb-2">Verify your email</h2>
                <p className="text-[15px] text-gray-500">
                    We sent a 6-digit code to <span className="font-bold text-[#000000]">{email}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* OTP Boxes */}
                <div onPaste={handlePaste}>
                    <div className="flex gap-2 sm:gap-3 justify-between">
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
                                    'w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold',
                                    'border-2 rounded-xl bg-white text-[#1a1a18] outline-none transition-all duration-150',
                                    error
                                        ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                                        : digit
                                            ? 'border-[#2D7A54] bg-[#F4F9F6] focus:border-[#2D7A54] focus:ring-2 focus:ring-[#2D7A54]/10'
                                            : 'border-[#000000] focus:border-[#2D7A54] focus:ring-2 focus:ring-[#2D7A54]/10',
                                ].join(' ')}
                            />
                        ))}
                    </div>
                    {error && (
                        <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={isLoading || !isComplete}
                        className="w-full py-2 rounded-xl text-[14px] font-bold text-white bg-[#2D7A54] hover:bg-[#246344] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Verify & continue'}
                    </button>

                    {/* Resend */}
                    <div className="text-center text-sm font-semibold">
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-[#2D7A54] hover:underline"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <span className="text-gray-400">
                                Resend in{' '}
                                <span className="text-[#000000]">
                                    {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </form>

            {/* Back link */}
            <div className="pt-6 border-t border-gray-100 text-center">
                <Link href="/auth/become-seller-signup" className="text-sm font-bold text-[#2D7A54] hover:underline">
                    Use a different email address
                </Link>
            </div>
        </div>
    )
}

export default function SellerOtpPage() {
    return (
        <BecomeSellerWrapper
            title="One last step."
            subtitle="Verify your email address to complete your seller registration."
        >
            <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#2D7A54] border-t-transparent rounded-full animate-spin"></div></div>}>
                <VerifyOtpForm />
            </Suspense>
        </BecomeSellerWrapper>
    )
}