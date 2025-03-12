import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { PrivyProvider } from "@/components/auth/privy-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PlaylistProvider } from "@/providers/playlist-provider"
import { PlaybackProvider } from "@/providers/playback-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Echo Verse",
  description: "A decentralized music streaming platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <PrivyProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PlaylistProvider>
              <PlaybackProvider>
                {children}
                <Toaster />
              </PlaybackProvider>
            </PlaylistProvider>
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}

