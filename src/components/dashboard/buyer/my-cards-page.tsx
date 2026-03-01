/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import AddCardModal from "./add-card-modal"
import CardItem from "./card-item"
import Stripe from "@/components/icon/stripe"
import Breadcrumb from "@/components/Breadcrumb"

interface PaymentCard {
    id: string
    type: "mastercard" | "visa" | "amex"
    lastFour: string
    status: "connected" | "disconnected"
}

export default function MyCardsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cards, setCards] = useState<PaymentCard[]>([
        {
            id: "1",
            type: "mastercard",
            lastFour: "25645",
            status: "connected",
        },
    ])

    const handleAddCard = (cardData: any) => {
        const newCard: PaymentCard = {
            id: Math.random().toString(),
            type: cardData.cardType || "visa",
            lastFour: cardData.cardNumber.slice(-4),
            status: "connected",
        }
        setCards([...cards, newCard])
        setIsModalOpen(false)
    }

    const handleDisconnect = (id: string) => {
        setCards(cards.filter((card) => card.id !== id))
    }

    return (
        <div className="">
            <div className=" ">
                <div className='mb-6 space-y-6'>
                    <Breadcrumb items={[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Payment Methods",  },
                    ]} />
                </div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-lg sm:text-xl font-bold text-[#171717] mb-2">My cards</h1>
                </div>

                {/* Stripe Payout Details Card */}
                <Card className=" rounded-lg  border border-border mb-6 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className=" rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                            <Stripe />

                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-2xl font-bold text-[#171717]">Stripe payout details</h2>
                            <p className="text-sm text-[#171717B2]">Manage your payout preferences & connected accounts.</p>
                        </div>
                    </div>

                    {/* Cards List */}
                    <div className="space-y-3">
                        {cards.map((card) => (
                            <CardItem key={card.id} card={card} onDisconnect={() => handleDisconnect(card.id)} />
                        ))}
                    </div>

                    {/* Add New Card Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-4 py-3 px-4 border-2 border-dashed border-blue-400 rounded-lg text-[#171717] font-medium hover:bg-blue-50 transition-colors"
                    >
                        <span className="text-xl">+</span> Add a new card
                    </button>
                </Card>
            </div>

            {/* Add Card Modal */}
            <AddCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddCard={handleAddCard} />
        </div>
    )
}
