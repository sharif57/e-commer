"use client"
import Image from "next/image"
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice"
import Loading from "../loading"
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

    // if (isLoading) {
    //     return <div><Loading /></div>;
    // }

    return (
        <div className="container mx-auto">


            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className=" px-6 sm:px-8 lg:px-12 py-6 sm:py-8">

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Top categories</h1>
                        <p className="text-gray-600 text-base sm:text-lg">Customers mostly picks</p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="flex-1    ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap- sm:gap- max-w-full">
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <CategorySkeleton key={i} />
                            ))
                            :
                            categories?.map((category: Category) => (
                                <Link
                                    href={`/category?category=${category?.title}`}
                                    key={category?._id}
                                    className={`group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl transition-all duration-300 cursor-pointer   
                }`}
                                >
                                    <div>
                                        <Image
                                            src={category?.image || "/placeholder.svg"}
                                            alt={category?.title}
                                            width={900}
                                            height={800}
                                        />
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="text-start pt-6 text-sm sm:text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                        {category?.title}
                                    </h3>
                                </Link>
                            ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
