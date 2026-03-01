/* eslint-disable @next/next/no-img-element */
'use client'

interface OrderItemProps {
  image: string
  title: string
  price: number
  quantity: number
}

export function OrderItem({ image, title, price, quantity }: OrderItemProps) {
  return (
    <div className="flex gap-3 sm:gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
      {/* Product Image */}
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-foreground line-clamp-2">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Qty {quantity}
          </p>
        </div>
        <p className="text-sm sm:text-base font-semibold text-foreground">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
