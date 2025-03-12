"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { Player } from "@/components/music/player"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const { authenticated, ready } = useAuth()

  useEffect(() => {
    setMounted(true)

    // Check if there's a saved sidebar state in localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState) {
      setSidebarCollapsed(savedState === "true")
    }

    // Listen for changes to the sidebar state
    const handleStorageChange = () => {
      const currentState = localStorage.getItem("sidebar-collapsed")
      if (currentState) {
        setSidebarCollapsed(currentState === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also set up a custom event listener for direct updates
    const handleCustomEvent = (e: Event) => {
      if (e instanceof CustomEvent) {
        setSidebarCollapsed(e.detail.collapsed)
      }
    }

    window.addEventListener("sidebarStateChange", handleCustomEvent as EventListener)

    // Check for changes periodically (as a fallback)
    const interval = setInterval(() => {
      const currentState = localStorage.getItem("sidebar-collapsed")
      if (currentState && (currentState === "true") !== sidebarCollapsed) {
        setSidebarCollapsed(currentState === "true")
      }
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sidebarStateChange", handleCustomEvent as EventListener)
      clearInterval(interval)
      setMounted(false)
    }
  }, [sidebarCollapsed])

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">
          <div className="container mx-auto p-4 pb-24">{children}</div>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <main className={cn("flex-1 transition-all duration-300", sidebarCollapsed ? "md:ml-16" : "md:ml-64")}>
        <div className="container mx-auto p-4 pb-24 max-w-7xl">{children}</div>
      </main>
      {authenticated && <Player />}
    </div>
  )
}

