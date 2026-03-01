/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import ProductCard from "./product-card"
import Link from "next/link"
import { useGetProductsQuery } from "@/redux/feature/buyer/productSlice"
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton"
import { toast } from "sonner"


export default function ProductGrid() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<Set<string>>(new Set())
  const { data, isLoading } = useGetProductsQuery(undefined);


  const products = data?.data?.result || [];

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistProducts = JSON.parse(savedWishlist);
        const wishlistIds = new Set<string>(wishlistProducts.map((p: any) => p._id));
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  const toggleWishlist = async (productId: string) => {
    if (pending.has(productId)) {
      return
    }

    const nextPending = new Set(pending)
    nextPending.add(productId)
    setPending(nextPending)

    try {
      // Get current wishlist from localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      const wishlistProducts = savedWishlist ? JSON.parse(savedWishlist) : [];
      
      const newWishlist = new Set(wishlist)
      
      if (newWishlist.has(productId)) {
        // Remove from wishlist
        newWishlist.delete(productId)
        const updatedWishlist = wishlistProducts.filter((p: any) => p._id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(newWishlist)
        toast.success("Removed from wishlist");
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        // Add to wishlist - save complete product information
        const product = products.find((p: any) => p._id === productId);
        if (product) {
          newWishlist.add(productId)
          wishlistProducts.push(product);
          localStorage.setItem("wishlist", JSON.stringify(wishlistProducts));
          setWishlist(newWishlist)
          toast.success("Added to wishlist!");
          // Dispatch event to update navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update wishlist");
    } finally {
      setPending((prev) => {
        const updated = new Set(prev)
        updated.delete(productId)
        return updated
      })
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[20px] font-semibold text-[#000000]">Best selling products</h1>
        <Link href="/best_deal" className="text-sm text-[#1877F2] font-medium hover:underline">See all</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
          : products?.slice(0, 8).map((product: any) => (
            <ProductCard
              key={product?._id}
              product={product}
              isWishlisted={wishlist.has(product?._id)}
              onWishlistToggle={() => toggleWishlist(product?._id)}
            />
          ))}
      </div>
    </div>
  )
}
