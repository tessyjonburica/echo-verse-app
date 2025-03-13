"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login"]

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { authenticated, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!ready) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if (!authenticated && !isPublicRoute) {
      // Redirect to landing page if not authenticated and trying to access a protected route
      router.push("/")
    }

    setIsChecking(false)
  }, [authenticated, ready, router, pathname])

  // Show loading state while checking authentication
  if (isChecking || !ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center">
          {/* Music equalizer animation */}
          <div className="flex items-end h-12 space-x-1 mb-4">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-gradient-to-t from-primary to-purple-500 rounded-full"
                animate={{
                  height: [
                    `${Math.random() * 15 + 5}px`,
                    `${Math.random() * 40 + 10}px`,
                    `${Math.random() * 15 + 5}px`,
                  ],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          <p className="mt-4 text-sm font-medium text-primary">Authenticating...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

