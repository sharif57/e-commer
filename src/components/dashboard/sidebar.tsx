/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"
import { useState } from "react"
import {
  LayoutDashboard,
  Heart,
  ShoppingBag,
  Inbox,
  CreditCard,
  User,
  Lock,
  Mail,
  LogOut,
  ChevronDown,
  Crown,
  LibraryBig,
  Plus,
  Trash2,
  FileBox,
  Store,
  WalletMinimal,
  MessagesSquare,
  Bell,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Logo from "../icon/logo"
import { useOrderHistoryQuery } from "@/redux/feature/buyer/orderProductSlice"
import { useGetWishListQuery } from "@/redux/feature/buyer/wishlistSlice"
import { useGetUsersQuery } from "@/redux/feature/userSlice"
import Image from "next/image"
import { useMySubscriptionsQuery } from "@/redux/feature/seller/packageSlice"
import { logout } from "@/service/authService"
import { toast } from "sonner"

interface DashboardSidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(["account", "support"])
  const { data } = useOrderHistoryQuery({ page: 1 });
  const { data: user } = useGetUsersQuery(undefined);

  const total = data?.data?.meta?.total || 0;

  const { data: wishListData } = useGetWishListQuery(undefined);

  const { data: mySubscriptions } = useMySubscriptionsQuery(undefined);
  console.log(mySubscriptions?.data[0]?.packageId, '=================')
  const subscriptionType = mySubscriptions?.data[0];

  const totalWishList = wishListData?.data?.meta?.total || 0;
  const userRole = user?.data?.role?.toLowerCase?.()
  const userType = userRole === "seller" ? "seller" : "buyer"
  const hasActiveSubscription = user?.data?.subscription === true

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const isActive = (link: string) => pathname === link

  // BUYER MENU ITEMS (Your exact structure)
  const buyerMenuItems = [
    { icon: Heart, label: "Favorite(s)", badge: totalWishList, link: "/wise-list" },
    { icon: ShoppingBag, label: "Order(s)", badge: total, link: "/dashboard" },
  ]

  const buyerDashboardItems = [
    { icon: LayoutDashboard, label: "Purchase History", link: "/dashboard" },
    { icon: Inbox, label: "Message", badge: "9+", link: "/dashboard/message" },
    { icon: CreditCard, label: "My Card", link: "/dashboard/my-card" },
  ]

  const buyerAccountItems = [
    { icon: User, label: "My Account", link: "/dashboard/my-account" },
    { icon: Lock, label: "Security Settings", link: "/dashboard/security" },
    { icon: Bell, label: "Reminders", link: "/dashboard/reminder" },
  ]

  // SELLER MENU ITEMS
  const sellerMenuItems = [
    { icon: Heart, label: "Tracking status", badge: "6", link: "/dashboard/#" },
    { icon: ShoppingBag, label: "Order(s)", badge: "15", link: "/dashboard/order-history" },
  ]

  const sellerDashboardItems = [
    { icon: LayoutDashboard, label: "Overview", link: "/dashboard" },
    { icon: LibraryBig, label: "Order History", link: "/dashboard/order-history" },
    // { icon: Heart, label: "Listings", link: "/dashboard/listings" },
    { icon: Plus, label: "New Listing", link: "/dashboard/new-listing" },
    { icon: Trash2, label: "Draft", link: "/dashboard/draft" },
  ]

  const sellerInventoryItems = [
    { icon: FileBox, label: "Manage Inventory", link: "/dashboard/inventory" },
    { icon: Inbox, label: "Messages", badge: "8+", link: "/dashboard/message" },
  ]

  const sellerAccountItems = [
    { icon: Store, label: "My Shop", link: "/dashboard/my-shop" },
    { icon: WalletMinimal, label: "My Wallet", link: "/dashboard/my-card" },
  ]

  // COMMON SUPPORT ITEMS (Your exact structure)
  const supportItems = [
    // { icon: LifeBuoy, label: "Get Support", link: "/dashboard/support" },
    { icon: MessagesSquare, label: "Live Chat", link: "/dashboard/support/live-chat" },
    { icon: Mail, label: "Email Us", link: "/dashboard/support/email-send" },
  ]

  // Render Badge Component
  const renderBadge = (badge: string | number | null | undefined) => {
    if (!badge) return null

    const badgeString = String(badge)
    const isHighPriority = badgeString.includes('+')
    return (
      <span
        className={cn(
          "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
          isHighPriority
            ? "bg-orange-100 text-orange-700"
            : "bg-red-100 text-red-700"
        )}
      >
        {badge}
      </span>
    )
  }

  // Render Navigation Item
  const renderNavItem = (item: any) => {
    const Icon = item.icon
    return (
      <Link key={item.label} href={item.link} onClick={handleClose}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-black hover:bg-gray-100 h-auto py-3",
            isActive(item.link) && "bg-[#1717170F] text-black  "
          )}
        >
          <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
          <span className="text-sm flex-1 text-left">{item.label}</span>
          {renderBadge(item?.badge)}
        </Button>
      </Link>
    )
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken")
      await logout()
      toast.success("Logged out successfully")
      window.location.href = "/"
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  // Get current user type items
  const currentMenuItems = userType === "buyer" ? buyerMenuItems : sellerMenuItems
  const currentDashboardItems = userType === "buyer" ? buyerDashboardItems : sellerDashboardItems
  const currentAccountItems = userType === "buyer" ? buyerAccountItems : sellerAccountItems

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <Link href="/" className="p-6 border-b">
            {
              user?.data?.role === "SELLER" ? (
                <Image src={user?.data?.image} alt="EQ1 Seller Logo" width={400} height={400} className="object-contain mx-auto w-full size-[60px]" />
              ) : (
                <Logo />
              )
            }
          </Link>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Seller Subscription Required Message */}
            {userType === "seller" && !hasActiveSubscription && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">
                  ⚠️ Active subscription required to access seller features
                </p>
              </div>
            )}
            {/* Pinned Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Pinned
              </h3>
              <div className="space-y-1">
                {currentMenuItems?.map((item) => (
                  <Link key={item.label} href={item.link} onClick={handleClose}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-black hover:bg-gray-100 h-auto py-3",
                        isActive(item.link) && "bg-gray-100 text-black border-r-2 border-blue-600"
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {renderBadge(item?.badge)}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dashboard Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Dashboard
              </h3>
              <div className="space-y-1">
                {currentDashboardItems.filter(item =>
                  userType !== "seller" || hasActiveSubscription || item.label === "Purchase History"
                ).map(renderNavItem)}
              </div>
            </div>

            {/* Manage Inventory Section (Seller only) */}
            {userType === "seller" && hasActiveSubscription && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Manage Inventory
                </h3>
                <div className="space-y-1">
                  {sellerInventoryItems.map(renderNavItem)}
                </div>
              </div>
            )}

            {/* Account Management Section */}
            <Collapsible
              open={openSections.includes("account")}
              onOpenChange={() => toggleSection("account")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50">
                Account Management
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    openSections.includes("account") && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-1 px-2">
                {currentAccountItems.map(renderNavItem)}
              </CollapsibleContent>
            </Collapsible>

            {/* Admin Support Section */}
            <Collapsible
              open={openSections.includes("support")}
              onOpenChange={() => toggleSection("support")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50">
                Admin Support
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    openSections.includes("support") && "rotate-180"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-1 px-2">
                {supportItems.map(renderNavItem)}
              </CollapsibleContent>
            </Collapsible>

            {/* Premium Plan Section (Seller only) */}
            {userType === "seller" && (
              <div className={cn(
                "rounded-xl p-4 space-y-3 border",
                hasActiveSubscription
                  ? "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200"
                  : "bg-gradient-to-br from-red-50 to-orange-100 border-red-200"
              )}>
                <div className="flex justify-center">
                  <Crown className={cn(
                    "w-8 h-8 stroke-width-1.5",
                    hasActiveSubscription ? "text-amber-600" : "text-red-600"
                  )} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  {hasActiveSubscription ? (
                    <>
                      <p className="text-lg capitalize text-gray-600 font-medium">{subscriptionType?.packageId?.interval}</p>
                      <h2 className="text-gray-900 text-xl font-bold mt-1">{Math.ceil((new Date(subscriptionType?.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left</h2>
                    </>
                  ) : (
                    <>
                      <h2 className="text-gray-900 text-xl font-bold">No Active Subscription</h2>
                      <p className="text-gray-600 text-sm mt-1">Upgrade to access seller features</p>
                    </>
                  )}
                </div>
                <Link href={'/upgrade'}>
                  <button className={cn(
                    "w-full py-2.5 border-2 rounded-xl font-semibold transition-all duration-300 text-sm shadow-sm hover:shadow-md",
                    hasActiveSubscription
                      ? "border-amber-600 bg-white text-amber-600 hover:bg-amber-600 hover:text-white"
                      : "border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                  )}>
                    {hasActiveSubscription ? "Renew my plan" : "Upgrade Now"}
                  </button>
                </Link>
              </div>
            )}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-200 ">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700 h-auto py-3 group"
            >
              <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Log out</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}