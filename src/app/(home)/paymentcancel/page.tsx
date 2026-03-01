"use client"

import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-full bg-red-100 p-4">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">Payment canceled</h1>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Your payment was not completed. You can try again or return to the shop.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
