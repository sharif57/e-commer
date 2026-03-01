
'use client';

import * as React from 'react';
import { Search, Menu, MessageCircle } from 'lucide-react';
import MessageModal from './message-modal';
import Image from 'next/image';
// import Message from '@/icon/message';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import Message from '../icon/message';
import Menus from '../icon/menu';
import { useGetReviewCountQuery, useGetSellerAboutQuery } from '@/redux/feature/buyer/productSlice';

type Page = 'catalog' | 'about' | 'feedback';

interface HeaderProps {
  currentPage: Page;
  sellerId: string;
  onPageChange: (p: Page) => void;
  searchTerm: string;
  onSearchChange: (t: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
}

export default function Header({
  currentPage,
  sellerId,
  onPageChange,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: HeaderProps) {

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: reviewCounter } = useGetReviewCountQuery(sellerId || '');
  const { data } = useGetSellerAboutQuery(sellerId || '');
  const about = data?.data;

  // Calculate positive review percentage
  const positive = reviewCounter?.data?.positive || 0;
  const neutral = reviewCounter?.data?.neutral || 0;
  const negative = reviewCounter?.data?.negative || 0;
  const totalReviews = positive + neutral + negative;
  const positivePercentage = totalReviews > 0
    ? ((positive / totalReviews) * 100).toFixed(1)
    : '0.0';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavTabs = () => (
    <Tabs value={currentPage} onValueChange={(v) => onPageChange(v as Page)}>
      <TabsList className="grid grid-cols-3 h-10 w-full">
        <TabsTrigger value="catalog">Shop</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <>
      {/* ===== MAIN HEADER (WHEN NOT SCROLLED) ===== */}
      {!isScrolled && (
        <header className="sticky top-0 bg-white dark:bg-slate-950  py-8 dark:border-slate-800 z-40">
          <div className="container mx-auto px-4">

            {/* TOP SELLER ROW */}
            <div className="py-4 flex items-center justify-between   bg-[#00000008]">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/seller profile photo.png"
                  alt="ZESICA"
                  width={70}
                  height={70}
                  className="rounded-full"
                />
                <div>
                  <p className="text-xl font-bold">{about?.seller}</p>
                  {/* <p className="text-xs">96.7% positive feedback | 96k items sold</p> */}
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-xs text-[#000000] font-semibold dark:text-gray-400">
                        {positivePercentage}%{" "}
                        <a href="#" className="text-[#000000] text-xs font-medium underline dark:text-blue-400">
                          Positive feedback
                        </a>
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#000000] font-semibold dark:text-gray-400">
                        {totalReviews}{" "}
                        <a href="#" className="text-[#000000] text-xs font-medium hover:underline dark:text-blue-400">
                          {totalReviews === 1 ? 'review' : 'reviews'}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              {/* <Button variant="ghost" size="icon" onClick={() => setIsMessageModalOpen(true)}>
                <Message />
              </Button> */}
            </div>

            {/* NAV + SEARCH BAR LEFT */}
            <div className="py-4  max-w-5xl dark:border-slate-800 flex flex-col lg:flex-row  gap-4">

              {/* CATEGORY DROPDOWN LEFT */}
              <div className="flex items-center gap-2 ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 text-[#000000] font-medium border border-[#000000] bg-[#1717174D]">
                      <Menu className="w-4" /> Categories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => onCategoryChange("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onCategoryChange("gaming")}>Gaming</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onCategoryChange("electronics")}>Electronics</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden md:block">
                <NavTabs />
              </div>
              {/* LEFT ALIGNED BIG SEARCH BOX */}
              {/* <div className="w-full max-w-2xl  rounded-lg">
                <div className="flex">
                  <div className="relative flex-1  ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search item..."
                      className="pl-10 rounded-r-none"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[140px] rounded-l-none border-r-0  bg-gray-100">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>


                </div>
              </div> */}



            </div>
          </div>
        </header>
      )}

      {/* ================================================================
           FIXED TOP SEARCH BAR WHEN SCROLLED
      ================================================================= */}
      {isScrolled && (
        <div className="fixed top-0 left-0 w-full bg-white dark:bg-slate-950 border-b border-gray-300 dark:border-slate-800 z-50 p-3 shadow-md">

          {/* SCROLL MODE: SEARCH BAR ONLY */}
          <div className="container mx-auto flex items-center gap-3">

            {/* MENU BUTTON (MOBILE) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menus />
            </Button>
            <Image
              src="/images/seller profile photo.png"
              alt="ZESICA"
              width={70}
              height={70}
              className="rounded-full size-[32px]"
            />
            <NavTabs />

            {/* FIXED SEARCH BAR FULL WIDTH */}
            {/* <div className="flex-1 max-w-2xl mx-auto flex">
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-[120px] rounded-r-none border-r-0 bg-gray-100">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 rounded-l-none"
                />
              </div>
            </div> */}

            {/* MESSAGE BUTTON */}
            {/* <Button variant="ghost" size="icon" onClick={() => setIsMessageModalOpen(true)}>
              <MessageCircle className="w-6 h-6" />
            </Button> */}
          </div>

          {/* MOBILE NAV INSIDE DROPDOWN */}
          {isMobileMenuOpen && (
            <div className="mt-3 bg-gray-100 dark:bg-slate-900 p-3 rounded-lg">
              <NavTabs />
            </div>
          )}
        </div>
      )}

      {/* MESSAGE MODAL */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        sellerName="ZESICA"
      />
    </>
  );
}
