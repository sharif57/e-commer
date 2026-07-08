"use client"

import { Menu, Search, X, Bell, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useGetProductsByFilterQuery } from "@/redux/feature/buyer/productSlice"
import Link from "next/link"

interface DashboardHeaderProps {
  onMenuClick: () => void
  isSidebarOpen?: boolean // Optional: to show different icon when sidebar is open
  isNotificationPanelOpen?: boolean
  onNotificationToggle?: () => void
}

export default function HeaderSeller({
  onMenuClick,
  isSidebarOpen = false,
  isNotificationPanelOpen = false,
  onNotificationToggle,
}: DashboardHeaderProps) {
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      setIsSearchDropdownOpen(true)
    } else {
      setIsSearchDropdownOpen(false)
    }
  }, [debouncedSearchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue && searchValue.trim().length > 0) params.set('searchTerm', searchValue.trim());
    router.push(`/category?${params.toString()}`);
    setIsSearchDropdownOpen(false);
  };

  const { data: searchResults, isFetching: isSearching } = useGetProductsByFilterQuery(
    { searchTerm: debouncedSearchTerm, limit: 50 },
    { skip: !debouncedSearchTerm }
  );

  const searchProducts = searchResults?.data?.result || [];

  // Generate breadcrumb segments from the current path
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => decodeURIComponent(seg.replace(/-/g, " ")))

  // Build breadcrumb links
  const breadcrumbLinks = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/").replace(/ /g, "-")
    return { label: seg.charAt(0).toUpperCase() + seg.slice(1), href }
  })

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Left section - Menu icons and breadcrumb */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Back Button */}
          {segments.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}

          {/* Menu Button - Connected to Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 lg:hidden"
            onClick={onMenuClick}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="sr-only">
              {isSidebarOpen ? "Close menu" : "Open menu"}
            </span>
          </Button>

          {/* Settings Button */}
          {/* <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Settings</span>
          </Button> */}

          {/* Breadcrumb navigation - dynamic */}
          <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
            {breadcrumbLinks.map((crumb, idx) => (
              <span
                key={crumb.href}
                className={
                  idx === breadcrumbLinks.length - 1
                    ? "text-foreground font-medium whitespace-nowrap truncate"
                    : "hover:text-foreground cursor-pointer transition-colors whitespace-nowrap truncate"
                }
                onClick={idx !== breadcrumbLinks.length - 1 ? () => router.push(crumb.href) : undefined}
                style={{ maxInlineSize: 120 }}
              >
                {crumb.label}
              </span>
            )).reduce((prev, curr, idx) =>
              idx === 0 ? [curr] : [...prev, <span key={"sep-" + idx} className="text-muted-foreground/50">/</span>, curr],
              [] as React.ReactNode[]
            )}
          </nav>
        </div>

        {/* Right section - Search (Visible on desktop only) */}
        <form onSubmit={handleSearch} className="hidden md:block relative w-full max-w-sm shrink-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-9 w-full pl-9 pr-12 bg-muted/50 border-[#171717] focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>

          {isSearchDropdownOpen && debouncedSearchTerm && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-xl rounded-md z-[100] max-h-[400px] overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
              ) : searchProducts.length > 0 ? (
                <ul className="py-2">
                  {searchProducts.map((product: any) => (
                    <li key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <Link
                        href={`/best_deal/${product._id}`}
                        className="flex items-center gap-3 px-4 py-2"
                        onClick={() => { setIsSearchDropdownOpen(false); setSearchValue(''); }}
                      >
                        <img src={product?.variants?.[0]?.images?.[0] || product.image?.[0] || "/placeholder.svg"} alt={product.title} className="w-10 h-10 object-cover rounded" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</span>
                          <span className="text-xs text-primary font-bold">${product.price.toFixed(2)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <div className="px-4 py-2 mt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearch(e as unknown as React.FormEvent);
                      }}
                      className="w-full py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors flex justify-center items-center"
                    >
                      Show all results
                    </button>
                  </div>
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No products found</div>
              )}
            </div>
          )}
        </form>

        {/* Profile/Notification Section - Optional */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${isNotificationPanelOpen ? "bg-muted" : ""}`}
            onClick={onNotificationToggle}
            aria-label={isNotificationPanelOpen ? "Close notifications panel" : "Open notifications panel"}
            title={isNotificationPanelOpen ? "Close notifications panel" : "Open notifications panel"}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">
              {isNotificationPanelOpen ? "Close notifications panel" : "Open notifications panel"}
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile Search Row (Visible on mobile only) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, orders, customers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-9 w-full pl-9 pr-4 bg-muted/50 border-[#171717] focus-visible:ring-2 focus-visible:ring-primary/20"
          />

          {isSearchDropdownOpen && debouncedSearchTerm && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-xl rounded-md z-[100] max-h-[300px] overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
              ) : searchProducts.length > 0 ? (
                <ul className="py-2">
                  {searchProducts.map((product: any) => (
                    <li key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <Link
                        href={`/best_deal/${product._id}`}
                        className="flex items-center gap-3 px-4 py-2"
                        onClick={() => { setIsSearchDropdownOpen(false); setSearchValue(''); }}
                      >
                        <img src={product?.variants?.[0]?.images?.[0] || product.image?.[0] || "/placeholder.svg"} alt={product.title} className="w-10 h-10 object-cover rounded" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</span>
                          <span className="text-xs text-primary font-bold">${product.price.toFixed(2)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <div className="px-4 py-2 mt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearch(e as unknown as React.FormEvent);
                      }}
                      className="w-full py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors flex justify-center items-center"
                    >
                      Show all results
                    </button>
                  </div>
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No products found</div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Mobile breadcrumb - dynamic */}
      <div className="md:hidden border-t border-border px-4 py-2">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto">
          {breadcrumbLinks.map((crumb, idx) => (
            <span
              key={crumb.href}
              className={
                idx === breadcrumbLinks.length - 1
                  ? "text-foreground font-medium whitespace-nowrap min-w-0 truncate"
                  : "hover:text-foreground cursor-pointer transition-colors whitespace-nowrap min-w-0 truncate"
              }
              onClick={idx !== breadcrumbLinks.length - 1 ? () => router.push(crumb.href) : undefined}
              style={{ maxInlineSize: 80 }}
            >
              {crumb.label}
            </span>
          )).reduce((prev, curr, idx) =>
            idx === 0 ? [curr] : [...prev, <span key={"sep-m-" + idx} className="text-muted-foreground/50">/</span>, curr],
            [] as React.ReactNode[]
          )}
        </nav>
      </div>
    </header>
  )
}