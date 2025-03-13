"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  trackPageView: (path: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  trackPageView: () => {},
})

export function useAnalytics() {
  return useContext(AnalyticsContext)
}

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
  // Track initial page load time
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Report performance metrics
      const reportWebVitals = () => {
        if ("performance" in window) {
          const perfEntries = performance.getEntriesByType("navigation")
          if (perfEntries.length > 0) {
            const timing = perfEntries[0] as PerformanceNavigationTiming
            console.log(`[Performance] Page loaded in ${timing.loadEventEnd - timing.startTime}ms`)
          }
        }
      }

      // Wait for the page to fully load
      if (document.readyState === "complete") {
        reportWebVitals()
      } else {
        window.addEventListener("load", reportWebVitals)
        return () => window.removeEventListener("load", reportWebVitals)
      }
    }
  }, [])

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // In a real app, this would send data to an analytics service
    console.log(`[Analytics] Event: ${eventName}`, properties)
  }

  const trackPageView = (path: string) => {
    // In a real app, this would send page view data to an analytics service
    console.log(`[Analytics] Page View: ${path}`)
  }

  return <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>{children}</AnalyticsContext.Provider>
}

