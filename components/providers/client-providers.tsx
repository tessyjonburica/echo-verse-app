"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"

// Dynamically import components that aren't needed for initial render
const AnalyticsProvider = dynamic(() => import("@/providers/analytics-provider"), {
  loading: () => null,
})

export function ClientProviders({ children }: { children: ReactNode }) {
  return <AnalyticsProvider>{children}</AnalyticsProvider>
}

