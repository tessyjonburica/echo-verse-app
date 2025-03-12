"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
// Update the import here as well
import { usePlaylist } from "@/hooks/use-playlist"
import type { Song } from "@/providers/playlist-provider"
import { CreatePlaylistModal } from "./create-playlist-modal"

interface AddToPlaylistMenuProps {
  song: Song
  trigger?: React.ReactNode
}

export function AddToPlaylistMenu({ song, trigger }: AddToPlaylistMenuProps) {
  const playlistContext = usePlaylist()
  const { playlists, addSongToPlaylist, loading: playlistLoading } = playlistContext
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!mounted) return

    setIsLoading(playlistId)
    try {
      await addSongToPlaylist(playlistId, song)
    } catch (error) {
      console.error("Failed to add song to playlist:", error)
    } finally {
      setIsLoading(null)
    }
  }

  if (!mounted) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Add to Playlist</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {playlists.length === 0 ? (
            <DropdownMenuItem disabled className="text-muted-foreground">
              No playlists found
            </DropdownMenuItem>
          ) : (
            playlists.map((playlist) => {
              const isInPlaylist = playlist.songs.some((s) => s.id === song.id)
              return (
                <DropdownMenuItem
                  key={playlist.id}
                  disabled={isInPlaylist || isLoading === playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{playlist.name}</span>
                  {isInPlaylist && <Check className="h-4 w-4 text-primary" />}
                  {isLoading === playlist.id && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </DropdownMenuItem>
              )
            })
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreatePlaylistOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreatePlaylistModal open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen} />
    </>
  )
}

