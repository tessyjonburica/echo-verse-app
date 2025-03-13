"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { usePlaylist, type Playlist } from "@/providers/playlist-provider"
import { usePlayback } from "@/providers/playback-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CustomDialog as Dialog,
  CustomDialogContent as DialogContent,
  CustomDialogDescription as DialogDescription,
  CustomDialogFooter as DialogFooter,
  CustomDialogHeader as DialogHeader,
  CustomDialogTitle as DialogTitle,
} from "@/components/ui/custom-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatTime } from "@/lib/utils"
import { MainLayout } from "@/components/layout/main-layout"

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const { getPlaylist, updatePlaylist, deletePlaylist, removeSongFromPlaylist } = usePlaylist()
  const { playSong } = usePlayback()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", description: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const playlistId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    if (playlistId && mounted) {
      const foundPlaylist = getPlaylist(playlistId)
      if (foundPlaylist) {
        setPlaylist(foundPlaylist)
        setEditForm({
          name: foundPlaylist.name,
          description: foundPlaylist.description || "",
        })
      } else {
        router.push("/library")
      }
    }
  }, [playlistId, getPlaylist, router, mounted])

  const handleEditSubmit = async () => {
    if (!playlist || !mounted) return

    setIsLoading(true)
    try {
      const updated = await updatePlaylist(playlist.id, {
        name: editForm.name,
        description: editForm.description,
      })
      setPlaylist(updated)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update playlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlaylist = async () => {
    if (!playlist || !mounted) return

    setIsLoading(true)
    try {
      await deletePlaylist(playlist.id)
      router.push("/library?tab=playlists")
    } catch (error) {
      console.error("Failed to delete playlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveSong = async (songId: string) => {
    if (!playlist || !mounted) return

    try {
      await removeSongFromPlaylist(playlist.id, songId)
      // Update local state
      const updatedPlaylist = getPlaylist(playlist.id)
      if (updatedPlaylist) {
        setPlaylist(updatedPlaylist)
      }
    } catch (error) {
      console.error("Failed to remove song:", error)
    }
  }

  const handlePlaySong = (index: number) => {
    if (!playlist || !mounted) return
    playSong(playlist.songs, index)
  }

  if (!mounted) return null

  if (!playlist) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
          <div className="w-full md:w-40 lg:w-48 h-40 lg:h-48 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={playlist.coverUrl || "/placeholder.svg?height=200&width=200"}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">{playlist.name}</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                    <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit playlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete playlist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {playlist.description && (
              <p className="text-sm sm:text-base text-muted-foreground">{playlist.description}</p>
            )}
            <div className="text-xs sm:text-sm text-muted-foreground">
              {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}
            </div>
            {playlist.songs.length > 0 && (
              <Button onClick={() => handlePlaySong(0)} className="mt-2 sm:mt-4">
                Play All
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {playlist.songs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <h3 className="text-lg sm:text-xl font-medium">This playlist is empty</h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Add songs to your playlist from the library or search page
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.songs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-2 sm:p-3 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => handlePlaySong(index)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img
                      src={song.coverUrl || "/placeholder.svg?height=40&width=40"}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm sm:text-base">{song.title}</div>
                    <div className="text-xs text-muted-foreground">{song.artist}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs text-muted-foreground">{formatTime(song.duration)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveSong(song.id)
                    }}
                    className="h-7 w-7 sm:h-8 sm:w-8"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Playlist Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Playlist</DialogTitle>
              <DialogDescription>Make changes to your playlist here.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit} disabled={!editForm.name.trim() || isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Playlist Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Playlist</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this playlist? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePlaylist} disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete playlist"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

