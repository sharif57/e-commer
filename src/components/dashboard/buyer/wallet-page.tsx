/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/Breadcrumb"
import {
    Wallet,
    ArrowUpRight,
    CreditCard,
    Eye,
    EyeOff,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react"
// import WithdrawModal from "./withdraw-modal"
import { useGetSellerWalletQuery, useGetSellerWithdrawHistoryQuery } from "@/redux/feature/seller/walletSlice"
import WithdrawModal from "./withdraw-modal"

interface WalletData {
    _id: string
    userId: string
    balance: number
    createdAt: string
    updatedAt: string
}

interface WithdrawHistory {
    _id: string
    amount: number
    userId: string
    status: "request" | "approved" | "rejected" | "completed"
    walletId: WalletData
    cardNumber: string
    country: string
    cvc: string
    date: string
    nameOfCard: string
    zipCode: string
    createdAt: string
    updatedAt: string
}

export default function WalletPage() {
    const [showBalance, setShowBalance] = useState(true)
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"overview" | "history">("overview")

    const { data: walletData } = useGetSellerWalletQuery(undefined)
    const { data: withdrawHistoryData } = useGetSellerWithdrawHistoryQuery(undefined)

    const wallet = walletData?.data as WalletData | undefined
    const withdrawHistory = (withdrawHistoryData?.data?.result || []) as WithdrawHistory[]

    const balance = wallet?.balance || 0

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-300"
            case "approved":
                return "bg-blue-100 text-blue-800 border-blue-300"
            case "request":
                return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "rejected":
                return "bg-red-100 text-red-800 border-red-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4" />
            case "request":
                return <Clock className="w-4 h-4" />
            case "rejected":
                return <XCircle className="w-4 h-4" />
            default:
                return <CheckCircle className="w-4 h-4" />
        }
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="w-full">
           

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    My Wallet
                </h1>
                <p className="text-sm text-gray-600">
                    Manage your funds, check balance, and withdraw earnings
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Balance Card */}
                    <Card className="rounded-xl border border-gray-200 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Wallet className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Balance</p>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                        {showBalance ? `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                            >
                                {showBalance ? (
                                    <Eye className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        </div>

                        {wallet && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-blue-200">
                                <div>
                                    <p className="text-xs text-gray-600 font-medium mb-1">Account ID</p>
                                    <p className="text-sm font-mono text-gray-900">
                                        {wallet._id.slice(-6)}...
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium mb-1">Last Updated</p>
                                    <p className="text-sm text-gray-900">
                                        {new Date(wallet.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                                    <p className="text-sm font-semibold text-green-600">Active</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            Withdraw Funds
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 border-gray-300 text-gray-700 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" />
                            Add Card
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`pb-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === "overview"
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`pb-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === "history"
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                History ({withdrawHistory.length})
                            </button>
                        </div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-4">
                            {withdrawHistory.length > 0 ? (
                                <>
                                    <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                                    <div className="space-y-3">
                                        {withdrawHistory.slice(0, 5).map((transaction) => (
                                            <Card
                                                key={transaction._id}
                                                className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="rounded-full bg-red-100 p-2.5">
                                                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                Withdrawal Request
                                                            </p>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {transaction.nameOfCard} • {transaction.cardNumber.slice(-4)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">
                                                            -${transaction.amount.toLocaleString("en-US")}
                                                        </p>
                                                        <span
                                                            className={`inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                                transaction.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(transaction.status)}
                                                            {transaction.status.charAt(0).toUpperCase() +
                                                                transaction.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">No transactions yet</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Start by withdrawing funds to your account
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === "history" && (
                        <div>
                            {withdrawHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {withdrawHistory.map((transaction) => (
                                        <Card
                                            key={transaction._id}
                                            className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="rounded-full bg-red-100 p-2.5 flex-shrink-0">
                                                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                                            {transaction.nameOfCard}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            {transaction.cardNumber.slice(-4)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="hidden sm:block">
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        ${transaction.amount.toLocaleString("en-US")}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-0.5">
                                                        {transaction.country}
                                                    </p>
                                                </div>

                                                <div className="hidden lg:block">
                                                    <p className="text-sm text-gray-900">
                                                        {formatDate(transaction.createdAt)}
                                                    </p>
                                                </div>

                                                <div className="sm:col-span-2 lg:col-span-1 flex items-center justify-between gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                            transaction.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(transaction.status)}
                                                        {transaction.status.charAt(0).toUpperCase() +
                                                            transaction.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Mobile view additional info */}
                                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 sm:hidden">
                                                <div>
                                                    <p className="text-xs text-gray-600 font-medium">Amount</p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        ${transaction.amount.toLocaleString("en-US")}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-medium">Date</p>
                                                    <p className="text-xs text-gray-900 mt-1">
                                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">No withdrawal history</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Your withdrawal transactions will appear here
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Info Card */}
                    <Card className="rounded-xl border border-gray-200 p-6 bg-white">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-200">
                                <p className="text-xs text-gray-600 font-medium mb-2">Total Withdrawals</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${withdrawHistory
                                        .reduce((sum, tx) => sum + tx.amount, 0)
                                        .toLocaleString("en-US")}
                                </p>
                            </div>

                            <div className="pb-4 border-b border-gray-200">
                                <p className="text-xs text-gray-600 font-medium mb-2">Pending Requests</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {withdrawHistory.filter((tx) => tx.status === "request").length}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-600 font-medium mb-2">Completed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {withdrawHistory.filter((tx) => tx.status === "completed").length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Methods Card */}
                    <Card className="rounded-xl border border-gray-200 p-6 bg-white">
                        <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
                        <div className="space-y-3">
                            {withdrawHistory.length > 0 && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {withdrawHistory[0].nameOfCard}
                                        </p>
                                        <CreditCard className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        •••• •••• •••• {withdrawHistory[0].cardNumber.slice(-4)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {withdrawHistory[0].country}
                                    </p>
                                </div>
                            )}
                            {withdrawHistory.length === 0 && (
                                <p className="text-sm text-gray-600 text-center py-4">
                                    No payment methods added yet
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-primary font-semibold rounded-lg h-10 transition-colors"
                        >
                            + Add Payment Method
                        </Button>
                    </Card>

                    {/* Help Card */}
                    <Card className="rounded-xl border border-gray-200 p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Have questions about withdrawals or your wallet?
                        </p>
                        <Button
                            variant="outline"
                            className="w-full border-blue-300 text-primary hover:bg-blue-50 font-semibold rounded-lg h-10 transition-colors"
                        >
                            Contact Support
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Withdraw Modal */}
            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                walletBalance={balance}
            />
        </div>
    )
}
