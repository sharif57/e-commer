// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */

// "use client";

// import { useState, useEffect } from "react";
// import { Search, Heart, Handbag, ChevronDown } from "lucide-react";
// import Logo from "../icon/logo";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice";
// import { useGetUsersQuery } from "@/redux/feature/userSlice";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Input } from "../ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "../ui/button";
// import { logout } from "@/service/authService";
// import { toast } from "sonner";

// export default function Navbar() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [items, setItems] = useState<Array<any>>([]);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const pathname = usePathname();
//   const router = useRouter();

//   const { data } = useGetCategoriesQuery(undefined);
//   const categories = data?.data?.result || [];


//   const { data: profile } = useGetUsersQuery(undefined);

//   const cartTotal = items.reduce((total, item) => {
//     const quantityValue = Number(item?.quantity ?? item?.qty ?? 1);
//     const quantity = Number.isFinite(quantityValue) && quantityValue > 0 ? quantityValue : 1;
//     const rawPrice = item?.discountPrice ?? item?.salePrice ?? item?.price ?? item?.amount ?? 0;
//     const price = Number.parseFloat(String(rawPrice).replace(/[^\d.]/g, "")) || 0;
//     return total + price * quantity;
//   }, 0);

//   const formattedCartTotal = `$${cartTotal.toFixed(2)}`;


//   if (pathname === "/upgrade") {
//     return null;
//   }

//   useEffect(() => {
//     const updateCartFromStorage = () => {
//       const product = localStorage.getItem("cart");
//       setItems(product ? JSON.parse(product) : []);
//     };

//     const updateWishlistFromStorage = () => {
//       const wishlist = localStorage.getItem("wishlist");
//       const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
//       setWishlistCount(wishlistItems.length);
//     };

//     // Initial load
//     updateCartFromStorage();
//     updateWishlistFromStorage();

//     // Listen for custom cart update event
//     const handleCartUpdate = () => {
//       updateCartFromStorage();
//     };

//     // Listen for wishlist update event
//     const handleWishlistUpdate = () => {
//       updateWishlistFromStorage();
//     };

//     // Listen for storage changes (other tabs)
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'cart') {
//         updateCartFromStorage();
//       }
//       if (e.key === 'wishlist') {
//         updateWishlistFromStorage();
//       }
//     };

//     window.addEventListener('cartUpdated', handleCartUpdate);
//     window.addEventListener('wishlistUpdated', handleWishlistUpdate);
//     window.addEventListener('storage', handleStorageChange);
//     window.addEventListener('focus', updateCartFromStorage);
//     window.addEventListener('focus', updateWishlistFromStorage);

//     return () => {
//       window.removeEventListener('cartUpdated', handleCartUpdate);
//       window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('focus', updateCartFromStorage);
//       window.removeEventListener('focus', updateWishlistFromStorage);
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('accountType');
//       localStorage.removeItem('refreshToken');
//       await logout();
//       toast.success('Logged out successfully');
//       window.location.href = ('/');
//     } catch {
//       toast.error('Error logging out');
//     }
//   }



//   // Handle search submission
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     const term = searchTerm || searchQuery;
//     if (term && term.trim().length > 0) params.set('searchTerm', term.trim());
//     if (selectedCategory && selectedCategory.trim().length > 0) params.set('category', selectedCategory.trim());
//     router.push(`/category${params.toString() ? `?${params.toString()}` : ''}`);
//   };
//   return (
//     <div className="w-full bg-white  relative z-50">
//       {/* Main Header */}
//       <header className="border-b border-gray-200">
//         <div className=" px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4">
//             {/* Logo */}
//             <Link href={'/'}>
//               <Logo />
//             </Link>

//             {/* Search Bar - Hidden on mobile */}
//             <form
//               onSubmit={handleSearch}
//               className="hidden sm:flex items-center w-full max-w-lg lg:max-w-2xl rounded-md border border-gray-300 overflow-hidden relative bg-white"
//             >

//               <div className="w-full max-w-2xl  rounded-lg">
//                 <div className="flex">
//                   <div className="relative flex-1  ">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <Input
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search item..."
//                       className="pl-10 rounded-r-none"
//                     />
//                   </div>
//                   <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)} >
//                     <SelectTrigger className="w-[140px] rounded-l-none border-r-0  bg-gray-100">
//                       <SelectValue placeholder="Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {
//                         categories.map((category: any) => (
//                           <SelectItem key={category._id} value={category?.title}>{category?.title}</SelectItem>
//                         ))
//                       }
//                     </SelectContent>
//                   </Select>
//                   <button
//                     type="submit"
//                     className="px-3 bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center"
//                     aria-label="Search"
//                     title="Search"
//                   >
//                     <Search size={18} />
//                   </button>

//                 </div>
//               </div>

//             </form>

//             {/* Right Section */}
//             <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
//               {/* Mobile Search Icon */}
//               <button
//                 className="sm:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
//                 aria-label="Open search"
//               >
//                 <Search size={20} className="text-black" />
//               </button>

//               {/* Become Seller */}
//               {profile?.data?.role !== "SELLER" && (
//                 <Link href="/auth/getting_start_screen">
//                   <button className="hidden xl:block text-sm text-[#171717] hover:text-primary transition-colors font-medium">
//                     Become a Seller
//                   </button>
//                 </Link>
//               )}

//               {/* Wishlist */}
//               <Link href={'/wise-list'}>
//                 <button
//                   className="relative p-2 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
//                   aria-label="Wishlist"
//                 >
//                   <Heart size={20} className="text-black" />
//                   {wishlistCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                       {wishlistCount}
//                     </span>
//                   )}
//                 </button>
//               </Link>

//               {/* Desktop End Section (Image-wise style) */}
//               <div className="hidden lg:flex items-center gap-5 text-[#171717]">
//                 {!profile?.data?.firstName ? (
//                   <Link href="/auth" className="leading-tight hover:text-primary transition-colors">
//                     <p className="text-xs">Hello, sign in</p>
//                     <p className="text-sm font-semibold flex items-center gap-1">
//                       Account &amp; Lists
//                       <ChevronDown size={14} />
//                     </p>
//                   </Link>
//                 ) : (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button className="leading-tight hover:text-primary transition-colors text-left">
//                         <p className="text-xs">Hello, {profile?.data?.firstName}</p>
//                         <p className="text-sm font-semibold flex items-center gap-1">
//                           Account &amp; Lists
//                           <ChevronDown size={14} />
//                         </p>
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-56" align="end" forceMount>
//                       <DropdownMenuLabel className="font-normal">
//                         <div className="flex items-center gap-2">
//                           <Avatar>
//                             <AvatarImage src={profile?.data?.image} />
//                             <AvatarFallback>{profile?.data?.firstName?.charAt(0)}</AvatarFallback>
//                           </Avatar>
//                           <div className="flex flex-col space-y-1">
//                             <p className="text-sm font-medium leading-none">{profile?.data?.firstName} {profile?.data?.lastName}</p>
//                             <p className="text-xs leading-none text-muted-foreground">{profile?.data?.email}</p>
//                           </div>
//                         </div>
//                       </DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuGroup>
//                         <Link href="/dashboard">
//                           <DropdownMenuItem className="cursor-pointer">
//                             Dashboard
//                             <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
//                           </DropdownMenuItem>
//                         </Link>
//                         <Link href="/dashboard/my-account">
//                           <DropdownMenuItem className="cursor-pointer">
//                             Profile
//                             <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
//                           </DropdownMenuItem>
//                         </Link>
//                         <Link href="/dashboard/security">
//                           <DropdownMenuItem className="cursor-pointer">
//                             Settings
//                             <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
//                           </DropdownMenuItem>
//                         </Link>
//                       </DropdownMenuGroup>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         className="cursor-pointer text-red-600 focus:text-red-600"
//                         onClick={handleLogout}
//                       >
//                         Log out
//                         <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 )}

//                 <Link
//                   href={profile?.data ? "/dashboard" : "/auth"}
//                   className="leading-tight hover:text-primary transition-colors"
//                 >
//                   <p className="text-xs">Returns</p>
//                   <p className="text-sm font-semibold">&amp; Orders</p>
//                 </Link>

//                 <Link
//                   href="/wise-list"
//                   className="relative flex items-center gap-2 hover:text-primary transition-colors"
//                   aria-label="Wise List"
//                 >
//                   <div className="relative">
//                     <Heart size={20} className="text-black" />
//                     {wishlistCount > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
//                         {wishlistCount}
//                       </span>
//                     )}
//                   </div>
//                   {/* <span className="text-sm font-semibold">Wise List</span> */}
//                 </Link>

//                 <Link
//                   href="/my-cart"
//                   className="relative flex items-center gap-2 hover:text-primary transition-colors"
//                   aria-label="Shopping Cart"
//                 >
//                   <div className="relative">
//                     <Handbag size={22} className="text-black" />
//                     {items.length > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
//                         {items.length}
//                       </span>
//                     )}
//                   </div>
//                   <span className="text-sm font-semibold">{formattedCartTotal}</span>
//                 </Link>
//               </div>

//               {/* Mobile Auth */}
//               {!profile?.data?.firstName ? (
//                 <Link href="/auth/register" className="lg:hidden">
//                   <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors font-medium text-sm">
//                     Register
//                   </button>
//                 </Link>
//               ) : (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer lg:hidden">
//                       <Avatar>
//                         <AvatarImage src={profile?.data?.image} />
//                         <AvatarFallback>{profile?.data?.firstName?.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56" align="end" forceMount>
//                     <DropdownMenuLabel className="font-normal">
//                       <div className="flex flex-col space-y-1">
//                         <p className="text-sm font-medium leading-none">{profile?.data?.firstName} {profile?.data?.lastName}</p>
//                         <p className="text-xs leading-none text-muted-foreground">{profile?.data?.email}</p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuGroup>
//                       <Link href="/dashboard">
//                         <DropdownMenuItem className="cursor-pointer">
//                           Dashboard
//                           <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
//                         </DropdownMenuItem>
//                       </Link>
//                       <Link href="/dashboard/my-account">
//                         <DropdownMenuItem className="cursor-pointer">
//                           Profile
//                           <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
//                         </DropdownMenuItem>
//                       </Link>
//                       <Link href="/dashboard/security">
//                         <DropdownMenuItem className="cursor-pointer">
//                           Settings
//                           <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
//                         </DropdownMenuItem>
//                       </Link>
//                     </DropdownMenuGroup>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem
//                       className="cursor-pointer text-red-600 focus:text-red-600"
//                       onClick={handleLogout}
//                     >
//                       Log out
//                       <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//             </div>
//           </div>

//           {/* Mobile Search Field */}
//           <form
//             onSubmit={handleSearch}
//             className="sm:hidden flex gap-2 pb-3 mt-1 px-4"
//           >
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
//               aria-label="Search"
//             >
//               <Search size={18} />
//             </button>
//           </form>
//         </div>
//       </header>

// {/* Category Navigation */}
// <nav className="w-full bg-[#1F2937] text-white ">
//   <div className=" px-4 sm:px-6 lg:px-8">
//     <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 scrollbar-hide">
//       <Link href="/category" className="text-sm font-medium  whitespace-nowrap">
//         Shop by Categories
//       </Link>
//       <div className="w-px h-5 bg-gray-300 flex-shrink-0" />
//       <Link
//         href={`/category`}
//         className="text-sm  hover:text-primary transition-colors whitespace-nowrap font-medium px-2 py-1 hover:bg-gray-100 rounded-md"
//       >
//         All
//       </Link>
//       {categories?.map((category: any) => (
//         <Link
//           href={`/category?category=${encodeURIComponent(category.title)}`}
//           key={category._id}
//           className="text-sm  hover:text-primary transition-colors whitespace-nowrap font-medium px-2 py-1 hover:bg-gray-100 rounded-md"
//           onClick={() => setSelectedCategory(category.title)}
//         >
//           {category?.title}
//         </Link>
//       ))}
//     </div>
//   </div>
// </nav>

//       {/* Hide scrollbar */}
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Heart, Handbag, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "../icon/logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/feature/buyer/categorySlice";
import { useGetUsersQuery } from "@/redux/feature/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { logout } from "@/service/authService";
import { toast } from "sonner";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Array<any>>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const { data } = useGetCategoriesQuery({limit: 100});
  const categories = data?.data?.result || [];


  const { data: profile } = useGetUsersQuery(undefined);

  if (pathname === "/upgrade") {
    return null;
  }

  useEffect(() => {
    const updateCartFromStorage = () => {
      const product = localStorage.getItem("cart");
      setItems(product ? JSON.parse(product) : []);
    };

    const updateWishlistFromStorage = () => {
      const wishlist = localStorage.getItem("wishlist");
      const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
      setWishlistCount(wishlistItems.length);
    };

    // Initial load
    updateCartFromStorage();
    updateWishlistFromStorage();

    // Listen for custom cart update event
    const handleCartUpdate = () => {
      updateCartFromStorage();
    };

    // Listen for wishlist update event
    const handleWishlistUpdate = () => {
      updateWishlistFromStorage();
    };

    // Listen for storage changes (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartFromStorage();
      }
      if (e.key === 'wishlist') {
        updateWishlistFromStorage();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', updateCartFromStorage);
    window.addEventListener('focus', updateWishlistFromStorage);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', updateCartFromStorage);
      window.removeEventListener('focus', updateWishlistFromStorage);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accountType');
      localStorage.removeItem('refreshToken');
      await logout();
      toast.success('Logged out successfully');
      window.location.href = ('/');
    } catch {
      toast.error('Error logging out');
    }
  }



  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const term = searchTerm || searchQuery;
    if (term && term.trim().length > 0) params.set('searchTerm', term.trim());
    if (selectedCategory && selectedCategory.trim().length > 0) params.set('category', selectedCategory.trim());
    router.push(`/category${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const scrollCategories = (distance: number) => {
    categoryScrollRef.current?.scrollBy(distance, 0);
  };

  const handleCategoryMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!categoryScrollRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = event.pageX;
    dragStartScrollRef.current = categoryScrollRef.current.scrollLeft;
  };

  const handleCategoryMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !categoryScrollRef.current) return;
    const dragDistance = event.pageX - dragStartXRef.current;
    categoryScrollRef.current.scrollLeft = dragStartScrollRef.current - dragDistance;
  };

  const stopCategoryDrag = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full bg-white  relative z-50">
      {/* Main Header */}
      <header className="border-b border-gray-200">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Logo */}
            <Link href={'/'} className="cursor-crosshair">
              <Logo />
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center w-full max-w-lg lg:max-w-2xl rounded-md border border-gray-300 overflow-hidden relative bg-white"
            >

              <div className="w-full max-w-2xl  rounded-lg">
                <div className="flex">
                  <div className="relative flex-1  ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search item..."
                      className="pl-10 rounded-r-none"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val)} >
                    <SelectTrigger className="w-[140px] rounded-l-none border-r-0  bg-gray-100">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        categories.map((category: any) => (
                          <SelectItem key={category._id} value={category?.title}>{category?.title}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <button
                    type="submit"
                    className="px-3 bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
                    aria-label="Search"
                    title="Search"
                  >
                    <Search size={18} />
                  </button>

                </div>
              </div>

            </form>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Mobile Search Icon */}
              <button
                className="sm:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Open search"
              >
                <Search size={20} className="text-black" />
              </button>

              {/* Become Seller */}
              {profile?.data?.role !== "SELLER" && (
                <Link href="/auth/getting_start_screen">
                  <button className="hidden md:block text-sm text-[#171717] hover:text-primary transition-colors font-medium">
                    Become a Seller
                  </button>
                </Link>
              )}

              {/* Wishlist */}
              <Link href={'/wise-list'}>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart size={20} className="text-black" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              {/* {
                profile?.data && ( */}
              <Link href="/my-cart"
                className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Shopping Cart"
              >
                <Handbag size={20} className="text-black" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              {/* //   )
              // } */}

              {/* Sign In */}
              {
                !profile?.data?.firstName ? (
                  <>
                    <Link href="/auth">
                      <button className="hidden sm:block text-sm text-black hover:text-primary transition-colors font-medium">
                        Sign In
                      </button>
                    </Link>

                    {/* Register */}
                    <Link href="/auth/register">
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors font-medium text-sm">
                        Register
                      </button>
                    </Link>


                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                        <Avatar>
                          <AvatarImage src={profile?.data?.image} />
                          <AvatarFallback>{profile?.data?.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{profile?.data?.firstName} {profile?.data?.lastName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{profile?.data?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <Link href="/dashboard">
                          <DropdownMenuItem className="cursor-pointer">
                            Dashboard
                            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/my-account">
                          <DropdownMenuItem className="cursor-pointer">
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/dashboard/security">
                          <DropdownMenuItem className="cursor-pointer">
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={handleLogout}
                      >
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
            </div>
          </div>

          {/* Mobile Search Field */}
          <form
            onSubmit={handleSearch}
            className="sm:hidden flex gap-2 pb-3 mt-1 px-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="w-full bg-[#1F2937] text-white ">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 py-3">
            <Link href="/category" className="text-sm font-semibold whitespace-nowrap">
              Shop by Categories
            </Link>
            <div className="w-px h-5 bg-gray-300 flex-shrink-0" />

            <button
              type="button"
              onClick={() => scrollCategories(-220)}
              className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={16} />
            </button>

            <div
              ref={categoryScrollRef}
              className="flex-1 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleCategoryMouseDown}
              onMouseMove={handleCategoryMouseMove}
              onMouseUp={stopCategoryDrag}
              onMouseLeave={stopCategoryDrag}
            >
              <div className="flex items-center gap-2 min-w-max pr-2">
                <Link
                  href={`/category`}
                  className="text-sm whitespace-nowrap font-medium px-3 py-1.5 rounded-full border border-white/20 hover:border-primary hover:text-primary hover:bg-white transition-colors"
                >
                  All
                </Link>
                {categories?.map((category: any) => (
                  <Link
                    href={`/category?category=${encodeURIComponent(category.title)}`}
                    key={category._id}
                    className="text-sm whitespace-nowrap font-medium px-3 py-1.5 rounded-full border border-white/20 hover:border-primary hover:text-primary hover:bg-white transition-colors"
                    onClick={() => setSelectedCategory(category.title)}
                  >
                    {category?.title}
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollCategories(220)}
              className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              aria-label="Scroll categories right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}