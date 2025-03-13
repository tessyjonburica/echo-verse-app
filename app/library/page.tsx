"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SongCard } from "@/components/music/song-card"
import { usePlaylist } from "@/hooks/use-playlist"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { CreatePlaylistModal } from "@/components/playlist/create-playlist-modal"
import { librarySongs } from "@/data/songs"

export default function LibraryPage() {
  const { authenticated, login } = useAuth()
  const { playlists } = usePlaylist()
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam === "playlists" ? "playlists" : "songs")

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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Your Music Library</h1>
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl">
            Connect to access your personal music library and playlists.
          </p>
          <Button size="lg" onClick={() => login()} className="animate-pulse hover:animate-none">
            Connect to Access Library
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Library</h1>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="songs" className="flex-1 sm:flex-none">
              Songs
            </TabsTrigger>
            <TabsTrigger value="playlists" className="flex-1 sm:flex-none">
              Playlists
            </TabsTrigger>
          </TabsList>
          <TabsContent value="songs" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {librarySongs.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} songs={librarySongs} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="playlists" className="mt-4 sm:mt-6">
            {playlists.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <h3 className="text-lg sm:text-xl font-medium mb-2">No playlists yet</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Create your first playlist to organize your favorite songs
                </p>
                <Button
                  onClick={() => setIsCreatePlaylistOpen(true)}
                  className="transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Playlist
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {playlists.map((playlist) => (
                  <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="block">
                    <div className="bg-card hover:bg-accent transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-muted">
                        <img
                          src={playlist.coverUrl || "/placeholder.svg?height=300&width=300&text=Playlist"}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-medium truncate text-sm sm:text-base">{playlist.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                <div
                  className="bg-card hover:bg-accent transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden cursor-pointer flex flex-col items-center justify-center aspect-square"
                  onClick={() => setIsCreatePlaylistOpen(true)}
                >
                  <PlusCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-2 text-muted-foreground" />
                  <span className="font-medium text-sm sm:text-base">Create Playlist</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <CreatePlaylistModal open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen} />
    </MainLayout>
  )
}

