/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductCardSkeleton from '@/components/Skeleton/ProductCardSkeleton'
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function WishList() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const wishlistProducts = JSON.parse(savedWishlist);
        setProducts(wishlistProducts);
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRemoveFromWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Remove from localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      const wishlistProducts = savedWishlist ? JSON.parse(savedWishlist) : [];
      const updatedWishlist = wishlistProducts.filter((p: any) => p._id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      // Update state
      setProducts(updatedWishlist);
      toast.success('Removed from wishlist');
      // Dispatch event to update navbar
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to remove from wishlist');
      console.error('Error removing from wishlist:', error);
    }
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My WishList</h1>
          <span className="text-sm text-gray-600">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {products.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Start adding items you love!</p>
            <Link href="/best_deal">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
              : products.map((product: any) => {
                return (
                  <Link key={product._id} href={`/best_deal/${product._id}`}>
                    <div className="group flex flex-col bg-card overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-lg rounded-lg">
                      {/* Image Container */}
                      <div className="relative w-full aspect-square bg-muted overflow-hidden">
                        <Image
                          src={product?.image?.[0] || "/placeholder.svg"}
                          alt={product?.title || "Product"}
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleRemoveFromWishlist(e, product._id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                          aria-label="Remove from wishlist"
                        >
                          <Heart
                            size={20}
                            className="fill-red-500 text-red-500 transition-colors duration-200"
                          />
                        </button>
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-col flex-1 p-4">
                        {/* Title */}
                        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                          {product?.title}
                        </h3>

                        {/* Brand */}
                        {product?.brand && (
                          <p className="text-xs text-gray-500 mb-2">{product?.brand}</p>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xl font-bold text-foreground">
                            ${product?.price?.toFixed(2)}
                          </span>
                        </div>

                        {/* Images Count */}
                        {product?.image?.length > 1 && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-muted-foreground">
                              +{product?.image?.length - 1} more {product?.image?.length - 1 === 1 ? 'image' : 'images'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  )
}
