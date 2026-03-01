"use client"

import Mastercard from "@/components/icon/masterCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CardItemProps {
  card: {
    id: string
    type: "mastercard" | "visa" | "amex"
    lastFour: string
    status: "connected" | "disconnected"
  }
  onDisconnect: () => void
}

export default function CardItem({ card, onDisconnect }: CardItemProps) {
  const getCardIcon = (type: string) => {
    switch (type) {
      case "mastercard":
        return (
          <div className="flex gap-1">
            <div className="w-6 h-4 rounded-sm bg-orange-500" />
            <div className="w-6 h-4 rounded-sm bg-red-500" />
          </div>
        )
      case "visa":
        return <div className="text-blue-600 font-bold text-sm">VISA</div>
      case "amex":
        return <div className="text-blue-700 font-bold text-sm">AMEX</div>
      default:
        return null
    }
  }

  return (
    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* <div className="flex-shrink-0">{getCardIcon(card.type)}</div> */}
        <div className="h-[24px] w-[38px]">
          <Mastercard />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm capitalize">{card.type}</p>
          <p className="text-xs text-slate-600">Account ending in {`••••••${card.lastFour}`}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200">Connected</Badge>
        <Button
          onClick={onDisconnect}
          variant="outline"
          size="sm"
          className="border-[#F26E50] text-[#F26E50] hover:bg-red-50 py-1 rounded-lg hover:text-red-700 bg-transparent"
        >
          Disconnect
        </Button>
      </div>
    </div>
  )
}
