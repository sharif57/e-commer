"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">Payment successful</h1>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Your order is confirmed. You can track your order status from your dashboard.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
