import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { PrivyProvider } from "@/components/auth/privy-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PlaylistProvider } from "@/providers/playlist-provider"
import { PlaybackProvider } from "@/providers/playback-provider"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ClientProviders } from "@/components/providers/client-providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
})

export const metadata: Metadata = {
  title: "EchoVerse | Decentralized Music Streaming",
  description: "A decentralized pay-per-second music streaming platform powered by MegaETH blockchain technology",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Add preload hints for critical resources */}
        <link rel="preload" as="image" href="/logo.svg" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <PrivyProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PlaylistProvider>
              <PlaybackProvider>
                <ClientProviders>
                  <AuthGuard>{children}</AuthGuard>
                  <Toaster />
                </ClientProviders>
              </PlaybackProvider>
            </PlaylistProvider>
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}

