"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { SongCard } from "@/components/music/song-card"
import { useAuth } from "@/hooks/use-auth"
import { featuredSongs, newReleases } from "@/data/songs"
import { useRouter } from "next/navigation"
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { authenticated, login } = useAuth()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted) return null

  if (!authenticated) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to EchoVerse</h1>
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl">
            Connect to discover and stream music directly from artists around the world.
          </p>
          <Button size="lg" onClick={() => login()} className="animate-pulse hover:animate-none">
            Connect to Continue
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8 sm:space-y-10">
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Tracks</h2>
            <Button variant="ghost" onClick={() => router.push("/library")} className="group text-sm sm:text-base">
              View All
              <ArrowRight className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredSongs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} songs={featuredSongs} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">New Releases</h2>
            <Button variant="ghost" onClick={() => router.push("/library")} className="group text-sm sm:text-base">
              View All
              <ArrowRight className="ml-1 sm:ml-2 h-3 sm:h-4 w-3 sm:w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {newReleases.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} songs={newReleases} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 sm:p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Your First Playlist</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Organize your favorite tracks and discover new music tailored to your taste.
              </p>
            </div>
            <Button onClick={() => router.push("/library?tab=playlists")} size="lg" className="w-full md:w-auto">
              Create Playlist
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
