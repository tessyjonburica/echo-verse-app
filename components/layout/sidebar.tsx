"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Library,
  Search,
  ListMusic,
  Settings,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Wallet,
  Mail,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CreatePlaylistModal } from "@/components/playlist/create-playlist-modal"
import { useMobile } from "@/hooks/use-mobile"
import { usePlaylist } from "@/hooks/use-playlist"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export function Sidebar() {
  const pathname = usePathname()
  const { user, authenticated, logout, getPrimaryIdentifier, hasLinkedEmail, hasLinkedWallet } = useAuth()
  const { playlists } = usePlaylist()
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if there's a saved sidebar state in localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState) {
      setCollapsed(savedState === "true")
    } else if (isMobile) {
      // Default to collapsed on mobile
      setCollapsed(true)
    }

    return () => {
      setMounted(false)
    }
  }, [])

  // Update collapsed state when switching between mobile and desktop
  useEffect(() => {
    if (mounted) {
      if (isMobile) {
        setCollapsed(true)
      }
    }
  }, [isMobile, mounted])

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    // Save state to localStorage
    localStorage.setItem("sidebar-collapsed", String(newState))

    // Dispatch a custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("sidebarStateChange", {
        detail: { collapsed: newState },
      }),
    )
  }

  const sidebarWidth = collapsed ? "w-14 sm:w-16" : "w-56 sm:w-64"
  const sidebarClass = cn(
    "bg-background fixed left-0 top-0 z-40 flex h-full flex-col border-r transition-all duration-300 ease-in-out",
    sidebarWidth,
  )

  const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Library, label: "Library", href: "/library" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  if (!mounted) return null

  // Get display name - ensure it's a string
  const displayName = getPrimaryIdentifier()

  // Determine which icon to show based on authentication method
  const AuthIcon = hasLinkedEmail() ? Mail : hasLinkedWallet() ? Wallet : User

  // Determine account type for tooltip
  const accountType = hasLinkedEmail() ? "Email Account" : hasLinkedWallet() ? "Wallet Account" : "Guest Account"

  return (
    <>
      <aside className={sidebarClass}>
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            {!collapsed && (
              <span className="text-base sm:text-xl font-bold animate-in fade-in slide-in-from-left-5 duration-300">
                Echo Verse
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "hidden md:flex transition-transform duration-200 hover:scale-110 h-7 w-7 sm:h-8 sm:w-8",
              collapsed && "ml-auto",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        {authenticated && (
          <div className={cn("flex items-center p-3 sm:p-4", collapsed ? "justify-center" : "justify-between")}>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative transition-transform duration-200 hover:scale-110">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>
                          <AuthIcon size={14} />
                        </AvatarFallback>
                      </Avatar>
                      {hasLinkedEmail() && (
                        <Badge
                          className="absolute -bottom-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 p-0 flex items-center justify-center bg-green-500 animate-pulse"
                          aria-label="Email verified"
                        >
                          <Mail className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white" />
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="animate-in fade-in zoom-in-95 duration-200">{accountType}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {!collapsed && (
                <div className="flex flex-col animate-in fade-in slide-in-from-left-5 duration-300">
                  <span className="text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-[160px]">
                    {displayName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-[160px]">
                    {accountType}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                title="Disconnect"
                className="transition-transform duration-200 hover:scale-110 hover:text-destructive h-7 w-7 sm:h-8 sm:w-8"
              >
                <LogOut size={16} />
              </Button>
            )}
          </div>
        )}

        <Separator />

        <nav className="flex-1">
          <ScrollArea className="h-full">
            <div className="px-2 sm:px-3 py-2">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                      collapsed ? "justify-center h-9 w-9 sm:h-10 sm:w-10 mx-auto p-0" : "px-2 sm:px-3 py-2",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", collapsed ? "" : "mr-2")} />
                    {!collapsed && (
                      <span className="animate-in fade-in slide-in-from-left-5 duration-300">{item.label}</span>
                    )}
                  </Link>
                ))}
              </div>

              <Separator className="my-3 sm:my-4" />

              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 sm:px-3 py-2">
                  {!collapsed && (
                    <h2 className="text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-left-5 duration-300">
                      Playlists
                    </h2>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCreatePlaylistOpen(true)}
                    className={cn(
                      "transition-transform duration-200 hover:scale-110 h-7 w-7 sm:h-8 sm:w-8",
                      collapsed && "mx-auto p-0",
                    )}
                    title="Create Playlist"
                  >
                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {playlists?.map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/playlist/${playlist.id}`}
                      className={cn(
                        "flex items-center rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
                        pathname === `/playlist/${playlist.id}`
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                        collapsed ? "justify-center h-9 w-9 sm:h-10 sm:w-10 mx-auto p-0" : "px-2 sm:px-3 py-2",
                      )}
                      title={collapsed ? playlist.name : undefined}
                    >
                      <ListMusic className={cn("h-4 w-4 sm:h-5 sm:w-5", collapsed ? "" : "mr-2")} />
                      {!collapsed && (
                        <span className="truncate max-w-[140px] sm:max-w-[180px] animate-in fade-in slide-in-from-left-5 duration-300">
                          {playlist.name}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </nav>
      </aside>
      <CreatePlaylistModal open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen} />
    </>
  )
}

