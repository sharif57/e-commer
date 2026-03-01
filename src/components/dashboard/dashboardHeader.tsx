/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Search, Menu, ChevronDown, Handbag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import Link from "next/link";
import { useGetUsersQuery } from "@/redux/feature/userSlice";
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {data} = useGetUsersQuery(undefined);

  const {data: categories} = useGetCategoriesQuery(undefined);  

  const categoriesList = categories?.data
  const onCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };



  return (
    <header className="sticky top-0 z-30 ">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

       
        {/* Search - Desktop */}
        <div className="hidden md:flex items-center flex-1 mx-8">

          <div className="flex flex-1">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search item..."
                className="
          pl-10 
          bg-[#f1f1f1] 
          border border-[#171717]
          rounded-r-none
          focus-visible:ring-0
          focus-visible:border-[#171717]
        "
              />
            </div>

            {/* Category Dropdown */}
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger
                className="
          w-[140px] 
          bg-[#f1f1f1] 
          border border-l-0 border-[#171717]
          rounded-l-none
          focus-visible:ring-0
          focus-visible:border-[#171717]
        "
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>

          </div>

        </div>


        {/* Right */}
        <div className="flex items-center gap-3">
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button> */}
          <Link href="/wise-list"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={20} className="text-gray-700" />
          </Link>

          {/* Notifications */}
          <Link href="/my-cart"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Notifications"
          >
            <Handbag size={20} className="text-gray-700" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-bold">
                  {data?.data?.firstName?.[0] || 'R'}{data?.data?.lastName?.[0] || 'M'}
                </div>
                <span className="hidden md:block">{data?.data?.firstName} {data?.data?.lastName}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <nav className="w-full ">
        <div className=" px-4 ">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 scrollbar-hide">
            <Link href="/category" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Shop by Categories
            </Link>
            <div className="w-px h-5 bg-gray-300 flex-shrink-0" />
            {categoriesList?.result?.map((category: any) => (
              <Link
                href={`/category?category=${category?.title}`}
                key={category?._id}
                className="text-sm text-gray-700 hover:text-primary transition-colors whitespace-nowrap font-medium px-2 py-1 hover:bg-gray-100 rounded-md"
                onClick={() => setSelectedCategory(category?._id)}
              >
                {category?.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input placeholder="Search..." className="pl-10 bg-gray-50" />
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}