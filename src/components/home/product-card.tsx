"use client"

import { Heart, Star, Link2, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Product {
    _id: string
    title: string
    price: number
    originalPrice: number
    rating: number
    reviews: number
    stock: number
    image: string[]
}

interface ProductCardProps {
    product: Product
    isWishlisted: boolean
    onWishlistToggle: () => void
}

export default function ProductCard({ product, isWishlisted, onWishlistToggle }: ProductCardProps) {
    const [copied, setCopied] = useState(false)
    const productLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/best_deal/${product?._id}`

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(productLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Link href={`best_deal/${product?._id}`}>
            <div className="group flex flex-col bg-card  overflow-hidden cursor-pointer transition-shadow duration-300">
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                        src={product?.image[0] || "/placeholder.svg"}
                        alt={product?.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onWishlistToggle();
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                        aria-label="Add to wishlist"
                    >
                        <Heart
                            size={20}
                            className={`transition-colors duration-200 ${isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
                        />
                    </button>

                    {/* Project Link Code Icon - Shows on Hover */}
                    <button
                        onClick={handleCopyLink}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                        aria-label="Copy product link"
                        title={copied ? "Copied!" : "Copy link"}
                    >
                        {copied ? (
                            <Copy size={20} className="text-green-600" />
                        ) : (
                            <Link2 size={20} className="text-primary" />
                        )}
                    </button>

                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-1 pt-4">
                    {/* Title */}
                    <h3 className="text-xl font-medium text-black line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                        {product?.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">

                    </div>

                    {/* Price */}
                    <div className="flex  items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground">${product?.price.toFixed(2)}</span>
                            {product?.originalPrice > product?.price && (
                                <span className="text-sm text-muted-foreground ">7.2k sold</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1">
                                {[...Array(1)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < Math.floor(product?.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{product?.rating}</span>
                        </div>

                    </div>
                </div>
            </div>
        </Link>
    )
}
