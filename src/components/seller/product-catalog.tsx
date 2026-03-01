/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import CategorySidebar from "./category-sidebar"
import { useGetBuyerForProductQuery } from "@/redux/feature/buyer/productSlice"
import { toast } from "sonner"

interface Product {
  id: string
  image: string
  title: string
  price: number
  rating: number
  reviews: number
  category: string
  sold?: string
}


export default function ProductCatalog({ selectedCategory: selectedCategorys, sellerId, searchTerm }: { selectedCategory: string, searchTerm: string, sellerId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const { data } = useGetBuyerForProductQuery(sellerId || '')
  console.log(data, 'seller products');

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistProducts = JSON.parse(savedWishlist);
        const wishlistIds = new Set<string>(wishlistProducts.map((p: any) => p._id));
        setFavorites(wishlistIds);
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    try {
      // Get current wishlist from localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      const wishlistProducts = savedWishlist ? JSON.parse(savedWishlist) : [];

      const newFavorites = new Set(favorites);

      if (newFavorites.has(id)) {
        // Remove from wishlist
        newFavorites.delete(id);
        const updatedWishlist = wishlistProducts.filter((p: any) => p._id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setFavorites(newFavorites);
        toast.success("Removed from wishlist");
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        // Add to wishlist - save complete product information
        const product = data?.data?.result?.find((p: any) => p._id === id);
        if (product) {
          newFavorites.add(id);
          wishlistProducts.push(product);
          localStorage.setItem("wishlist", JSON.stringify(wishlistProducts));
          setFavorites(newFavorites);
          toast.success("Added to wishlist!");
          // Dispatch event to update navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update wishlist");
      console.error("Failed to update wishlist", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-">
        <div className="flex gap-6">
          {/* Sidebar - Hidden on mobile, visible on lg */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">


            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {data?.data?.result?.map((product: any) => (
                <ProductCard
                  sellerId={sellerId}
                  key={product._id}
                  product={product}
                  isFavorite={favorites.has(product._id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
