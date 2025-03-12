"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  coverUrl: string
  audioUrl: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  coverUrl?: string
  songs: Song[]
  createdAt: number
  updatedAt: number
  userId: string
}

interface PlaylistContextType {
  playlists: Playlist[]
  createPlaylist: (name: string, description?: string) => Promise<Playlist>
  updatePlaylist: (id: string, data: Partial<Playlist>) => Promise<Playlist>
  deletePlaylist: (id: string) => Promise<void>
  getPlaylist: (id: string) => Playlist | undefined
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>
  loading: boolean
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined)

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const { user, authenticated } = useAuth()
  const { toast } = useToast()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  // Load playlists from localStorage on mount
  useEffect(() => {
    if (authenticated && user) {
      const userId = user.id || user.wallet?.address || "guest-user"

      try {
        const storedPlaylists = localStorage.getItem(`echo-verse-playlists-${userId}`)
        if (storedPlaylists) {
          setPlaylists(JSON.parse(storedPlaylists))
        }
      } catch (error) {
        console.error("Failed to load playlists:", error)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [authenticated, user])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (authenticated && user && playlists.length > 0) {
      const userId = user.id || user.wallet?.address || "guest-user"

      try {
        localStorage.setItem(`echo-verse-playlists-${userId}`, JSON.stringify(playlists))
      } catch (error) {
        console.error("Failed to save playlists:", error)
      }
    }
  }, [playlists, authenticated, user])

  const createPlaylist = async (name: string, description?: string): Promise<Playlist> => {
    // Allow creating playlists even if not fully authenticated
    // This is a fallback for development/testing
    const userId = user?.id || user?.wallet?.address || "guest-user"

    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      description,
      coverUrl: "/placeholder.svg?height=200&width=200",
      songs: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId,
    }

    setPlaylists((prev) => [...prev, newPlaylist])
    toast({
      title: "Playlist created",
      description: `"${name}" has been created successfully.`,
    })

    return newPlaylist
  }

  const updatePlaylist = async (id: string, data: Partial<Playlist>): Promise<Playlist> => {
    const playlistIndex = playlists.findIndex((p) => p.id === id)
    if (playlistIndex === -1) {
      throw new Error("Playlist not found")
    }

    const updatedPlaylist = {
      ...playlists[playlistIndex],
      ...data,
      updatedAt: Date.now(),
    }

    const updatedPlaylists = [...playlists]
    updatedPlaylists[playlistIndex] = updatedPlaylist
    setPlaylists(updatedPlaylists)

    toast({
      title: "Playlist updated",
      description: `"${updatedPlaylist.name}" has been updated.`,
    })

    return updatedPlaylist
  }

  const deletePlaylist = async (id: string): Promise<void> => {
    const playlist = playlists.find((p) => p.id === id)
    if (!playlist) {
      throw new Error("Playlist not found")
    }

    setPlaylists((prev) => prev.filter((p) => p.id !== id))

    toast({
      title: "Playlist deleted",
      description: `"${playlist.name}" has been deleted.`,
    })
  }

  const getPlaylist = (id: string): Playlist | undefined => {
    return playlists.find((p) => p.id === id)
  }

  const addSongToPlaylist = async (playlistId: string, song: Song): Promise<void> => {
    const playlistIndex = playlists.findIndex((p) => p.id === playlistId)
    if (playlistIndex === -1) {
      throw new Error("Playlist not found")
    }

    // Check if song already exists in playlist
    if (playlists[playlistIndex].songs.some((s) => s.id === song.id)) {
      toast({
        title: "Song already in playlist",
        description: `"${song.title}" is already in this playlist.`,
        variant: "destructive",
      })
      return
    }

    const updatedPlaylist = {
      ...playlists[playlistIndex],
      songs: [...playlists[playlistIndex].songs, song],
      updatedAt: Date.now(),
    }

    const updatedPlaylists = [...playlists]
    updatedPlaylists[playlistIndex] = updatedPlaylist
    setPlaylists(updatedPlaylists)

    toast({
      title: "Song added",
      description: `"${song.title}" has been added to "${updatedPlaylist.name}".`,
    })
  }

  const removeSongFromPlaylist = async (playlistId: string, songId: string): Promise<void> => {
    const playlistIndex = playlists.findIndex((p) => p.id === playlistId)
    if (playlistIndex === -1) {
      throw new Error("Playlist not found")
    }

    const playlist = playlists[playlistIndex]
    const songIndex = playlist.songs.findIndex((s) => s.id === songId)

    if (songIndex === -1) {
      throw new Error("Song not found in playlist")
    }

    const songTitle = playlist.songs[songIndex].title

    const updatedPlaylist = {
      ...playlist,
      songs: playlist.songs.filter((s) => s.id !== songId),
      updatedAt: Date.now(),
    }

    const updatedPlaylists = [...playlists]
    updatedPlaylists[playlistIndex] = updatedPlaylist
    setPlaylists(updatedPlaylists)

    toast({
      title: "Song removed",
      description: `"${songTitle}" has been removed from "${playlist.name}".`,
    })
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        getPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        loading,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  )
}

export function usePlaylist() {
  const context = useContext(PlaylistContext)
  if (context === undefined) {
    throw new Error("usePlaylist must be used within a PlaylistProvider")
  }
  return context
}

