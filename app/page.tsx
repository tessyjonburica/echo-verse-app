"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SongCard } from "@/components/music/song-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { featuredSongs, newReleases } from "@/data/songs"

export default function HomePage() {
  const { authenticated, login } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted) return null

  return (
    <MainLayout>
      {!authenticated ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Echo Verse</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Discover and enjoy your favorite music in a decentralized platform. Create playlists, share with friends,
            and experience music like never before.
          </p>
          <Button size="lg" onClick={() => login()} className="animate-pulse hover:animate-none">
            Connect to Get Started
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Featured Tracks</h2>
              <Button variant="link">See All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredSongs.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} songs={featuredSongs} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">New Releases</h2>
              <Button variant="link">See All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newReleases.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} songs={newReleases} />
              ))}
            </div>
          </section>
        </div>
      )}
    </MainLayout>
  )
}

