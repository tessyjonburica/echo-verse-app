"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "../layout/main-layout"
import { motion } from "framer-motion"
import { usePlaylist } from "@/hooks/use-playlist"
import { fetchSongsByIds } from "@/lib/web3-api"
import { Loader } from "../ui/loader"
import { SongGrid } from "../music/song-grid"
import type { Playlist } from "@/types"

export function PlaylistPage({ id }: { id: string }) {
  const { getPlaylistById, isLoading: isLoadingPlaylists } = usePlaylist()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [songs, setSongs] = useState([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(false)

  useEffect(() => {
    if (!isLoadingPlaylists) {
      const foundPlaylist = getPlaylistById(id)
      setPlaylist(foundPlaylist || null)

      if (foundPlaylist && foundPlaylist.songs.length > 0) {
        setIsLoadingSongs(true)
        fetchSongsByIds(foundPlaylist.songs)
          .then((fetchedSongs) => {
            setSongs(fetchedSongs)
          })
          .catch((error) => {
            console.error("Error loading playlist songs:", error)
          })
          .finally(() => {
            setIsLoadingSongs(false)
          })
      }
    }
  }, [id, getPlaylistById, isLoadingPlaylists])

  if (isLoadingPlaylists) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader text="Loading playlist..." />
        </div>
      </MainLayout>
    )
  }

  if (!playlist) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
          <p className="text-gray-400">The playlist you're looking for doesn't exist or has been removed.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          {playlist.description && <p className="text-gray-400 mb-4">{playlist.description}</p>}
          <div className="text-sm text-gray-500">Created by {playlist.createdBy}</div>
        </motion.div>

        {isLoadingSongs ? (
          <div className="flex items-center justify-center py-20">
            <Loader text="Loading songs..." />
          </div>
        ) : songs.length > 0 ? (
          <SongGrid songs={songs} />
        ) : (
          <div className="text-center py-20 text-gray-400">This playlist is empty. Add some songs to get started!</div>
        )}
      </div>
    </MainLayout>
  )
}

