"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CustomDialog as Dialog,
  CustomDialogContent as DialogContent,
  CustomDialogDescription as DialogDescription,
  CustomDialogFooter as DialogFooter,
  CustomDialogHeader as DialogHeader,
  CustomDialogTitle as DialogTitle,
} from "@/components/ui/custom-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// Update the import here as well
import { usePlaylist } from "@/hooks/use-playlist"

interface CreatePlaylistModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePlaylistModal({ open, onOpenChange }: CreatePlaylistModalProps) {
  const router = useRouter()
  const { createPlaylist } = usePlaylist()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setName("")
      setDescription("")
      setIsLoading(false)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!name.trim() || !mounted) return

    setIsLoading(true)
    try {
      const playlist = await createPlaylist(name, description)
      onOpenChange(false)
      router.push(`/playlist/${playlist.id}`)
    } catch (error) {
      console.error("Failed to create playlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
          <DialogDescription>Create a new playlist to organize your favorite songs.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="My Awesome Playlist" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="A collection of my favorite songs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? "Creating..." : "Create Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

