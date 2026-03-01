/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/home/product-card";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import { useGetProductsQuery } from "@/redux/feature/buyer/productSlice";
import { toast } from "sonner";

export default function ProductGrid() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());

  const { data, isLoading, isFetching } = useGetProductsQuery(page);

  /* -------------------- Handle Product Append -------------------- */
  useEffect(() => {
    if (data?.data?.result) {
      setProducts((prev) => [...prev, ...data.data.result]);
    }
  }, [data]);

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

  /* -------------------- Wishlist Toggle -------------------- */
  const toggleWishlist = async (productId: string) => {
    if (pending.has(productId)) {
      return;
    }

    const nextPending = new Set(pending);
    nextPending.add(productId);
    setPending(nextPending);

    try {
      // Get current wishlist from localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      const wishlistProducts = savedWishlist ? JSON.parse(savedWishlist) : [];

      const newWishlist = new Set(wishlist);

      if (newWishlist.has(productId)) {
        // Remove from wishlist
        newWishlist.delete(productId);
        const updatedWishlist = wishlistProducts.filter((p: any) => p._id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setWishlist(newWishlist);
        toast.success("Removed from wishlist");
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        // Add to wishlist - save complete product information
        const product = products.find((p: any) => p._id === productId);
        if (product) {
          newWishlist.add(productId);
          wishlistProducts.push(product);
          localStorage.setItem("wishlist", JSON.stringify(wishlistProducts));
          setWishlist(newWishlist);
          toast.success("Added to wishlist!");
          // Dispatch event to update navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update wishlist");
    } finally {
      setPending((prev) => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[20px] font-semibold text-black">
          Best selling products
        </h1>
        <p className="text-xs text-black/60 font-medium">
          Check each product page for buying options
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading && page === 1
          ? Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
          : products.map((product) => (
            <Link href={`/best_deal/${product._id}`} key={product._id}>
              <ProductCard
                product={product}
                isWishlisted={wishlist.has(product._id)}
                onWishlistToggle={() => toggleWishlist(product._id)}
              />
            </Link>
          ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-10">
        <button
          disabled={isFetching}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition disabled:opacity-60"
        >
          {isFetching ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
