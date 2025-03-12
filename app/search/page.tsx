"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SongCard } from "@/components/music/song-card"
import { SearchIcon, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { librarySongs } from "@/data/songs"
import type { Song } from "@/providers/playlist-provider"

export default function SearchPage() {
  const { authenticated, login } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Song[]>(librarySongs)
  const [isSearching, setIsSearching] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults(librarySongs)
      return
    }

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase()
      const results = librarySongs.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          (song.album && song.album.toLowerCase().includes(query)),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  if (!mounted) return null

  if (!authenticated) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Search Music</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Connect to search and discover your favorite songs.
          </p>
          <Button
            size="lg"
            onClick={() => login()}
            className="animate-pulse hover:animate-none transition-all duration-300 hover:scale-105"
          >
            Connect to Search
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Search</h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for songs, artists, or albums"
              className="pl-9 transition-all duration-300 focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching} className="transition-all duration-300 hover:scale-105">
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>

        <div className="mt-8">
          {searchResults.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">Try searching for something else or check your spelling</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
              {searchResults.map((song, index) => (
                <SongCard key={song.id} song={song} index={index} songs={searchResults} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

