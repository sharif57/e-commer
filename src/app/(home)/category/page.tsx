
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Heart, Star, Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGetProductsByFilterQuery } from "@/redux/feature/buyer/productSlice"
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice"
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton"
import { toast } from "sonner"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Category {
    _id: string
    title: string
    image: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface Product {
    _id: string
    title: string
    price: number
    brand: string
    size: string[]
    des: string
    return: string
    deliveryChargeInDc: string
    deliveryChargeOutOfDc: string
    carrier: string
    sku: string
    categoryId: {
        title: string
    }
    subCategoryId: {
        title: string
    }
    userId: string
    image: string[]
    status: string
    inStock: boolean
    careInsturction: string
    closureType: string
    frbricType: string
    origin: string
    color: string[]
    createdAt: string
    updatedAt: string
}

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface ProductCardProps {
    product: Product
    isWishlisted: boolean
    onWishlistToggle: () => void
}

function ProductCard({ product, isWishlisted, onWishlistToggle }: ProductCardProps) {
    return (
        <Link href={`/best_deal/${product._id}`} className="group bg-white rounded-lg  overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                <Image
                    src={product.image?.[0] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onWishlistToggle()
                    }}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        size={20}
                        className={`transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                            }`}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="pb-4 pt-2 space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
                <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary cursor-pointer">
                    {product.title}
                </h3>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-foreground">${product.price.toFixed(2)}</span>
                        {product.inStock ? (
                            <span className="text-xs text-green-600">In Stock</span>
                        ) : (
                            <span className="text-xs text-red-600">Out of Stock</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={`${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-[#171717B2]"}`}
                                />
                            ))}
                        </div>
                        <span className="text-base text-muted-foreground ml-1">4.0</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

// ============================================================================
// PRICE RANGE SLIDER COMPONENT
// ============================================================================

interface PriceRangeSliderProps {
    min: number
    max: number
    onChange: (range: [number, number]) => void
}

function PriceRangeSlider({ min, max, onChange }: PriceRangeSliderProps) {
    const [minVal, setMinVal] = useState(min)
    const [maxVal, setMaxVal] = useState(max)
    const maxPrice = 10000 // Maximum price limit

    // Update slider values when props change
    useEffect(() => {
        setMinVal(min)
        setMaxVal(max)
    }, [min, max])

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxVal - 100)
        setMinVal(value)
        onChange([value, maxVal])
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minVal + 100)
        setMaxVal(value)
        onChange([minVal, value])
    }

    return (
        <div className="relative w-full py-2">
            <div className="relative h-1 bg-gray-300 rounded-full">
                <div
                    className="absolute h-1 bg-[#303030] rounded-full"
                    style={{
                        left: `${(minVal / maxPrice) * 100}%`,
                        right: `${100 - (maxVal / maxPrice) * 100}%`
                    }}
                />
                <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="100"
                    value={minVal}
                    onChange={handleMinChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                    style={{ pointerEvents: 'all' }}
                />
                <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="100"
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                    style={{ pointerEvents: 'all' }}
                />
                <div
                    className="absolute w-5 h-5 bg-[#303030] rounded-full border-2 border-white shadow -translate-x-1/2 top-0"
                    style={{ left: `${(minVal / maxPrice) * 100}%`, top: '-8px', pointerEvents: 'none' }}
                />
                <div
                    className="absolute w-5 h-5 bg-[#303030] rounded-full border-2 border-white shadow -translate-x-1/2 top-0"
                    style={{ left: `${(maxVal / maxPrice) * 100}%`, top: '-8px', pointerEvents: 'none' }}
                />
            </div>
        </div>
    )
}

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

interface SidebarProps {
    categories: Category[]
    selectedCategories: string[]
    onCategoryChange: (categories: string[]) => void
    priceRange: [number, number]
    onPriceChange: (range: [number, number]) => void
}

function Sidebar({ categories, selectedCategories, onCategoryChange, priceRange, onPriceChange }: SidebarProps) {
    const [showAllCategories, setShowAllCategories] = useState(false)
    const [minInput, setMinInput] = useState(priceRange[0].toString())
    const [maxInput, setMaxInput] = useState(priceRange[1].toString())

    // Update input fields when priceRange changes
    useEffect(() => {
        setMinInput(priceRange[0].toString())
        setMaxInput(priceRange[1].toString())
    }, [priceRange])

    const displayedCategories = showAllCategories ? categories : categories.slice(0, 5)

    const handleCategoryToggle = (categoryTitle: string) => {
        const updated = selectedCategories.includes(categoryTitle)
            ? selectedCategories.filter((c) => c !== categoryTitle)
            : [...selectedCategories, categoryTitle]
        onCategoryChange(updated)
    }

    const handlePriceApply = () => {
        const min = Math.max(0, Number.parseInt(minInput) || 0)
        const max = Math.max(min + 100, Number.parseInt(maxInput) || 10000)
        setMinInput(min.toString())
        setMaxInput(max.toString())
        onPriceChange([min, max])
    }

    return (
        <div className="space-y-6 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {/* Categories Section */}
            <div className="bg-[#00000008] rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Category</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {displayedCategories.length > 0 ? (
                        displayedCategories.map((category) => (
                            <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.title)}
                                    onChange={() => handleCategoryToggle(category.title)}
                                    className="w-4 h-4 rounded border-border accent-[#1877F2] flex-shrink-0"
                                />
                                <span className="text-sm text-[#1877F2] hover:text-[#0d6efd]">{category.title}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No categories available</p>
                    )}
                </div>
                {categories.length > 5 && (
                    <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="text-sm text-[#1877F2] hover:underline mt-3 block"
                    >
                        {showAllCategories ? "Show less" : "Show more..."}
                    </button>
                )}
            </div>

            {/* Price Range Section */}
            <div className="bg-[#00000008] rounded-lg border border-border p-4">
                <h3 className="font-semibold text-foreground mb-4">Price range</h3>
                <p className="text-sm text-muted-foreground mb-4">Customize</p>
                <PriceRangeSlider min={priceRange[0]} max={priceRange[1]} onChange={onPriceChange} />
                <div className="flex items-end gap-3 mt-4">
                    {/* Min Input */}
                    <div className="flex flex-col w-1/2">
                        <label className="text-sm font-medium mb-1">Min</label>
                        <input
                            type="number"
                            value={minInput}
                            onChange={(e) => setMinInput(e.target.value)}
                            placeholder="Min"
                            className="w-full px-3 py-2 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                        />
                    </div>

                    {/* Dash separator */}
                    <span className="text-gray-500 mb-2">-</span>

                    {/* Max Input */}
                    <div className="flex flex-col w-1/2">
                        <label className="text-sm font-medium mb-1">Max</label>
                        <input
                            type="number"
                            value={maxInput}
                            onChange={(e) => setMaxInput(e.target.value)}
                            placeholder="Max"
                            className="w-full px-3 py-2 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                        />
                    </div>
                </div>

                <Button onClick={handlePriceApply} className="w-full mt-3 bg-primary hover:bg-primary/90 text-white">
                    Apply
                </Button>
            </div>
        </div>
    )
}

// ============================================================================
// MOBILE PRICE RANGE COMPONENT
// ============================================================================

interface MobilePriceRangeProps {
    priceRange: [number, number]
    appliedPriceRange: [number, number]
    onPriceChange: (range: [number, number]) => void
}

function MobilePriceRange({ priceRange, appliedPriceRange, onPriceChange }: MobilePriceRangeProps) {
    const [minInput, setMinInput] = useState(appliedPriceRange[0].toString())
    const [maxInput, setMaxInput] = useState(appliedPriceRange[1].toString())

    const handlePriceApply = () => {
        const min = Math.max(0, Number.parseInt(minInput) || 0)
        const max = Math.max(min + 100, Number.parseInt(maxInput) || 10000)
        setMinInput(min.toString())
        setMaxInput(max.toString())
        onPriceChange([min, max])
    }

    return (
        <div>
            <h3 className="font-semibold text-foreground mb-4">Price range</h3>
            <p className="text-sm text-muted-foreground mb-3">Customize</p>
            <div className="flex items-end gap-3 mb-3">
                <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium mb-1">Min</label>
                    <input
                        type="number"
                        value={minInput}
                        onChange={(e) => setMinInput(e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                </div>
                <span className="text-gray-500 mb-2">-</span>
                <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium mb-1">Max</label>
                    <input
                        type="number"
                        value={maxInput}
                        onChange={(e) => setMaxInput(e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-[#171717] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                </div>
            </div>
            <Button onClick={handlePriceApply} className="w-full bg-primary hover:bg-primary/90 text-white text-sm">
                Apply Price
            </Button>
        </div>
    )
}


function Home() {
    const searchParams = useSearchParams()
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
    const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 10000])
    const [searchTerm, setSearchTerm] = useState("")
    const [wishlist, setWishlist] = useState<Set<string>>(new Set())
    const [currentPage, setCurrentPage] = useState(1)
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
    const [initialized, setInitialized] = useState(false)

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

    // Pagination constants
    const itemsPerPage = 10 // Based on your API response showing 10 items per page

    // Initialize filters from URL query params
    useEffect(() => {
        if (!initialized) {
            const categoryParam = searchParams.get('category')
            const minPriceParam = searchParams.get('minPrice')
            const maxPriceParam = searchParams.get('maxPrice')
            const pageParam = searchParams.get('page')
            const urlSearchTerm = searchParams.get('searchTerm') || searchParams.get('seachTerm')

            if (categoryParam) {
                // Handle multiple categories separated by comma
                const categories = categoryParam.split(',').map(cat => cat.trim())
                setSelectedCategories(categories)
            }

            if (minPriceParam || maxPriceParam) {
                const minPrice = minPriceParam ? Math.max(0, Number.parseInt(minPriceParam)) : 0
                const maxPrice = maxPriceParam ? Math.max(minPrice + 100, Number.parseInt(maxPriceParam)) : 10000
                setPriceRange([minPrice, maxPrice])
                setAppliedPriceRange([minPrice, maxPrice])
            }

            if (pageParam) {
                const page = Math.max(1, Number.parseInt(pageParam))
                setCurrentPage(page)
            }

            if (urlSearchTerm && urlSearchTerm.trim().length > 0) {
                setSearchTerm(urlSearchTerm.trim())
            }

            setInitialized(true)
        }
    }, [searchParams, initialized])

    // Build filter params
    const filterParams = useMemo(() => {
        const params: any = {
            page: currentPage,
        }

        if (selectedCategories.length > 0) {
            params.categoryName = selectedCategories.join(',')
        }

        if (appliedPriceRange[0] > 0) {
            params.minPrice = appliedPriceRange[0]
        }

        if (appliedPriceRange[1] < 10000) {
            params.maxPrice = appliedPriceRange[1]
        }

        if (searchTerm && searchTerm.trim().length > 0) {
            params.searchTerm = searchTerm.trim()
        }

        return params
    }, [selectedCategories, appliedPriceRange, currentPage, searchTerm])

    // Fetch products with filters
    const { data: productsData, isLoading, isFetching, error } = useGetProductsByFilterQuery(filterParams)
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery(undefined)

    // Extract products and pagination info
    const products: Product[] = productsData?.data?.result || []
    const paginationMeta = productsData?.data?.meta
    const totalProducts = paginationMeta?.total || 0
    const totalPages = Math.ceil(totalProducts / itemsPerPage)

    // Sync current page with API response
    useEffect(() => {
        if (paginationMeta?.page && paginationMeta.page !== currentPage) {
            setCurrentPage(paginationMeta.page)
        }
    }, [paginationMeta, currentPage])

    // Extract categories
    const categories: Category[] = categoriesData?.data?.result || []

    // Handle category change
    const handleCategoryChange = (categories: string[]) => {
        setSelectedCategories(categories)
        setCurrentPage(1) // Reset to first page when filter changes
        // Update URL with new category filter
        updateUrlParams({ category: categories.length > 0 ? categories.join(',') : null, page: '1' })
    }

    // Handle price range apply
    const handlePriceChange = (range: [number, number]) => {
        setPriceRange(range)
        setAppliedPriceRange(range)
        setCurrentPage(1) // Reset to first page when filter changes
        // Update URL with new price filter
        updateUrlParams({
            minPrice: range[0] > 0 ? range[0].toString() : null,
            maxPrice: range[1] < 10000 ? range[1].toString() : null,
            page: '1'
        })
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        updateUrlParams({ page: page.toString() })
    }

    // Update URL parameters helper function
    const updateUrlParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        window.history.pushState(null, '', `?${params.toString()}`)
    }

    // ========================================================================
    // WISHLIST LOGIC
    // ========================================================================

    const toggleWishlist = (productId: string) => {
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
            console.error("Failed to update wishlist", error);
        }
    }

    // Generate pagination range
    const getPaginationRange = () => {
        const delta = 2 // Number of pages to show before and after current page
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...')
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages)
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    // Loading state
    if (isLoading && currentPage === 1) {
        return (
            <main className="min-h-screen gap-6 px-4 sm:px-6 lg:px-8 py-6 container mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-muted-foreground">Loading products...</p>
                </div>
            </main>
        )
    }

    // Error state
    if (error) {
        return (
            <main className="min-h-screen gap-6 px-4 sm:px-6 lg:px-8 py-6 container mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-red-600">Error loading products. Please try again.</p>
                </div>
            </main>
        )
    }

    return (
        <>
            <title>Category Page</title>
            <main className="min-h-screen gap-6 px-4 sm:px-6 lg:px-8 py-6 container mx-auto">
                {/* Header */}
                <header>
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-foreground">Results</h2>
                            <p className="text-sm text-muted-foreground">
                                {products.length > 0 ? (
                                    <>
                                        {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
                                        {totalProducts.toLocaleString()} results
                                        {selectedCategories.length > 0 && (
                                            <span className="font-semibold text-foreground">
                                                {" "}for {selectedCategories.join(", ")}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    "No products found"
                                )}
                            </p>
                        </div>
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="lg:hidden ml-4 p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                            aria-label="Toggle filters"
                        >
                            {mobileFilterOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6 pt-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
                        {categoriesLoading ? (
                            <div className="bg-[#00000008] rounded-lg border border-border p-4">
                                <p className="text-sm text-muted-foreground">Loading categories...</p>
                            </div>
                        ) : (
                            <Sidebar
                                categories={categories}
                                selectedCategories={selectedCategories}
                                onCategoryChange={handleCategoryChange}
                                priceRange={priceRange}
                                onPriceChange={handlePriceChange}
                            />
                        )}
                    </aside>

                    {/* Sidebar - Mobile */}
                    {mobileFilterOpen && (
                        <div className="fixed inset-0 z-40 lg:hidden">
                            {/* Backdrop */}
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setMobileFilterOpen(false)}
                            />
                            {/* Drawer */}
                            <div className="absolute left-0 top-0 h-full w-80 max-w-full bg-white overflow-y-auto shadow-lg">
                                <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
                                    <h2 className="text-lg font-semibold">Filters</h2>
                                    <button
                                        onClick={() => setMobileFilterOpen(false)}
                                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    {categoriesLoading ? (
                                        <p className="text-sm text-muted-foreground">Loading categories...</p>
                                    ) : (
                                        <>
                                            {/* Mobile Sidebar Content */}
                                            <div className="space-y-6">
                                                {/* Categories Section */}
                                                <div>
                                                    <h3 className="font-semibold text-foreground mb-4">Category</h3>
                                                    <div className="space-y-2">
                                                        {categories.length > 0 ? (
                                                            categories.map((category) => (
                                                                <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedCategories.includes(category.title)}
                                                                        onChange={() => {
                                                                            const updated = selectedCategories.includes(category.title)
                                                                                ? selectedCategories.filter((c) => c !== category.title)
                                                                                : [...selectedCategories, category.title]
                                                                            handleCategoryChange(updated)
                                                                        }}
                                                                        className="w-4 h-4 rounded border-border accent-[#1877F2] flex-shrink-0"
                                                                    />
                                                                    <span className="text-sm text-[#1877F2]">{category.title}</span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground">No categories available</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price Range Section */}
                                                <MobilePriceRange
                                                    priceRange={priceRange}
                                                    appliedPriceRange={appliedPriceRange}
                                                    onPriceChange={handlePriceChange}
                                                />

                                                {/* Apply Button */}
                                                <Button
                                                    onClick={() => setMobileFilterOpen(false)}
                                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                                >
                                                    Apply Filters
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Grid */}
                        {isLoading && currentPage === 1 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {Array.from({ length: itemsPerPage }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                {isFetching && (
                                    <div className="text-center py-2">
                                        <p className="text-sm text-muted-foreground">Updating products...</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            isWishlisted={wishlist.has(product._id)}
                                            onWishlistToggle={() => toggleWishlist(product._id)}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
                                <Button
                                    onClick={() => {
                                        setSelectedCategories([])
                                        setAppliedPriceRange([0, 10000])
                                        setPriceRange([0, 10000])
                                        setCurrentPage(1)
                                        updateUrlParams({
                                            category: null,
                                            minPrice: null,
                                            maxPrice: null,
                                            page: null
                                        })
                                    }}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {/* Dynamic Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || isFetching}
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center gap-1">
                                    {getPaginationRange().map((item, index) => {
                                        if (item === '...') {
                                            return (
                                                <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                                                    ...
                                                </span>
                                            )
                                        }

                                        const page = item as number
                                        return (
                                            <Button
                                                key={`page-${page}`}
                                                variant={currentPage === page ? "default" : "outline"}
                                                onClick={() => handlePageChange(page)}
                                                disabled={isFetching}
                                                className="min-w-10 h-10 px-3"
                                            >
                                                {page}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || isFetching}
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {/* Page Info */}
                        {totalProducts > 0 && (
                            <div className="text-center text-sm text-muted-foreground mt-2">
                                Page {currentPage} of {totalPages}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default function Page() {
    return <Suspense fallback={<div>Loading...</div>}><Home /></Suspense>;
}