"use client"

import { Menu, Search, X, Bell, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

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
  const pathname = usePathname()
  const router = useRouter()

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

        {/* Right section - Search */}
        <div className="relative w-full max-w-sm shrink-0">
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
        </div>

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
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </div>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
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