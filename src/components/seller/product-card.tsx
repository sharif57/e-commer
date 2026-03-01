"use client"

import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { useGetBuyerForProductQuery } from "@/redux/feature/buyer/productSlice"
import Image from "next/image"

interface Product {
  _id: string
  image: string
  title: string
  price: number
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
  sellerId: string
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export default function ProductCard({ product, isFavorite, sellerId, onToggleFavorite }: ProductCardProps) {
  const { data } = useGetBuyerForProductQuery(sellerId || '')
  console.log(data, '=======================')
  return (
    <Link href={`/best_deal/${product?._id}`} className="    transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative bg-gray-100 dark:bg-slate-700 aspect-square overflow-hidden group">
        <Image
          src={product.image[0] || "/placeholder.svg"}
          alt={product.title}
          fill
          className="w-full h-full rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(product?._id);
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all dark:bg-slate-700"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="py-4  ">
        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-2">{product?.title}</h3>



        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-bold text-lg text-gray-900 dark:text-white">${product?.price.toFixed(2)}</div>
            <p className="text-xs font-normal pt-2 text-[#00000099]">9.7k sold</p>
          </div>
          <div className="flex items-center gap-2 ">
            <div className="flex items-center gap-1">
              {[...Array(1)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product?.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {product?.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
