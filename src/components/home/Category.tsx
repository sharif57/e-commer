"use client"
import Image from "next/image"
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice"
import CategorySkeleton from "../Skeleton/CategorySkeleton"
import Link from "next/link"

interface Category {
    _id: string
    title: string
    image: string
}


export default function Category() {

    const { data, isLoading } = useGetCategoriesQuery(undefined);

    const categories = data?.data?.result || [];

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">


            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="mb-6 sm:mb-8">

                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Top categories</h1>
                        <p className="text-gray-600 text-base sm:text-lg">Customers mostly picks</p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 max-w-full">
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <CategorySkeleton key={i} />
                            ))
                            :
                            categories?.map((category: Category) => (
                                <Link
                                    href={`/category?category=${category?.title}`}
                                    key={category?._id}
                                    className="group flex flex-col items-center justify-start p-3 sm:p-4 rounded-xl border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm transition-all duration-300"
                                >
                                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                                        <Image
                                            src={category?.image || "/placeholder.svg"}
                                            alt={category?.title}
                                            fill
                                            sizes="(max-inline-size: 640px) 50vw, (max-inline-size: 1024px) 33vw, (max-inline-size: 1280px) 25vw, 16vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="w-full text-center pt-3 sm:pt-4 text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 min-h-10">
                                        {category?.title}
                                    </h3>
                                </Link>
                            ))}
                    </div>
                </div>
            </main>
        </section>
    )
}
