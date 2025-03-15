"use client"

import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth"
import { type ReactNode, useEffect, useState } from "react"
import { MockPrivyProvider } from "./mock-privy"

interface PrivyProviderProps {
  children: ReactNode
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  // During server-side rendering or before mounting, just render children
  if (!mounted) {
    return <>{children}</>
  }

  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  // If no app ID is available, use the mock provider
  if (!privyAppId) {
    console.warn("No Privy App ID found. Using mock Privy provider.")
    return <MockPrivyProvider>{children}</MockPrivyProvider>
  }

  return (
    <PrivyProviderBase
      appId={privyAppId}
      config={{
        loginMethods: ["email", "wallet"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        appearance: {
          theme: "light",
          accentColor: "#7c3aed",
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  )
}

