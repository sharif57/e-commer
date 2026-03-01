"use client"

import MyCardsPage from "@/components/dashboard/buyer/my-cards-page"
import { useGetAllSellerWalletsQuery, useGetSellerWalletQuery, useGetSellerWithdrawHistoryQuery, useRequestSellerWithdrawMutation } from "@/redux/feature/seller/walletSlice"

import WalletPage from "@/components/dashboard/buyer/wallet-page"

export default function MyCards() {
    return (
        <div>
            <title>My Wallet</title>
            <WalletPage />
        </div>
    )
}
