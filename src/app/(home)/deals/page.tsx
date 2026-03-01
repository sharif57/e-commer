/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDisableProductQuery } from "@/redux/feature/buyer/productSlice";
import {
    useAddToWishListMutation,
    useGetWishListQuery,
    useRemoveFromWishListMutation,
} from "@/redux/feature/buyer/wishlistSlice";
import { Copy, Heart, Link2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ApiProduct {
    _id: string;
    title: string;
    price: number;
    discount?: number;
    rating?: number;
    count?: number;
    inStock?: boolean;
    image: string[];
}

interface Product {
    _id: string;
    title: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    stock: number;
    image: string[];
}

interface ProductCardProps {
    product: Product;
    isWishlisted: boolean;
    onWishlistToggle: (e: React.MouseEvent) => void;
}

function ProductCard({
    product,
    isWishlisted,
    onWishlistToggle,
}: ProductCardProps) {
    const [copied, setCopied] = useState(false);
    const productLink = `${typeof window !== "undefined" ? window.location.origin : ""
        }/best_deal/${product?._id}`;

    const handleCopyLink = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(productLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Link href={`/best_deal/${product?._id}`}>
            <div className="group flex flex-col bg-card  overflow-hidden cursor-pointer transition-shadow duration-300">
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <Image
                        src={product?.image[0] || "/placeholder.svg"}
                        alt={product?.title}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <button
                        onClick={onWishlistToggle}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            size={20}
                            className={`transition-colors duration-200 ${isWishlisted
                                ? "fill-destructive text-destructive"
                                : "text-muted-foreground"
                                }`}
                        />
                    </button>

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

                <div className="flex flex-col flex-1 pt-4">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                        {product?.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3"></div>

                    <div className="flex  items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground">
                                ${product?.price.toFixed(2)}
                            </span>
                            {product?.originalPrice > product?.price && (
                                <span className="text-sm text-muted-foreground ">
                                    7.2k sold
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1">
                                {[...Array(1)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={`${i < Math.floor(product?.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {product?.rating}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function HotDeals() {
    const { data } = useDisableProductQuery(undefined);
    const { data: wishListData } = useGetWishListQuery(undefined);
    const [addToWishList] = useAddToWishListMutation();
    const [removeFromWishList] = useRemoveFromWishListMutation()
    const products = useMemo<ApiProduct[]>(
        () => data?.data?.result ?? [],
        [data]
    );
    const wishListItems = useMemo<any[]>(
        () => wishListData?.data?.result ?? [],
        [wishListData]
    );

    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedProducts = products.slice(startIndex, startIndex + pageSize);

    const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

    const wishlistProductIds = useMemo<Set<string>>(() => {
        const ids = new Set<string>();
        wishListItems.forEach((item) => {
            const productId = item?.productId?._id;
            if (productId) {
                ids.add(productId);
            }
        });
        return ids;
    }, [wishListItems]);

    useEffect(() => {
        const next: Record<string, boolean> = {};
        wishListItems.forEach((item) => {
            const productId = item?.productId?._id;
            if (productId) {
                next[productId] = true;
            }
        });
        setWishlist(next);
    }, [wishListItems]);

    const mappedProducts: Product[] = pagedProducts.map((product) => {
        const discount = product.discount ?? 0;
        const originalPrice = product.price ?? 0;
        const price = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

        return {
            _id: product._id,
            title: product.title,
            price,
            originalPrice,
            rating: product.rating ?? 0,
            reviews: product.count ?? 0,
            stock: product.inStock ? 1 : 0,
            image: product.image ?? [],
        };
    });

    const handleRemoveFromWishlist = async (
        e: React.MouseEvent,
        productId: string
    ) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const res = await removeFromWishList(productId).unwrap();
            setWishlist((prev) => ({ ...prev, [productId]: false }));
            toast.success(res?.data?.message || 'Removed from wishlist');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to remove from wishlist');
            console.error('Error removing from wishlist:', error);
        }
    }
    const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
    const handleNext = () =>
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));

    const handleAddToWishlist = async (productId: string) => {
        try {
            const res = await addToWishList(productId).unwrap();
            setWishlist((prev) => ({ ...prev, [productId]: true }));
            toast.success(res?.data?.message || "Added to wishlist!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add to wishlist");
        }
    };

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[20px] font-semibold text-black">
                    Top selling products
                </h1>
                <p className="text-xs text-black/60 font-medium">
                    Check each product page for buying options
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mappedProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        isWishlisted={Boolean(wishlist[product._id])}
                        onWishlistToggle={(e) => {
                            const isWishlisted = Boolean(wishlist[product._id]);
                            if (isWishlisted) {
                                if (!wishlistProductIds.has(product._id)) {
                                    toast.error("Wishlist item not found. Please refresh and try again.");
                                    return;
                                }
                                handleRemoveFromWishlist(e, product._id);
                                return;
                            }

                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToWishlist(product._id);
                        }}
                    />
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-10">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border border-border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </section>
    );
}
