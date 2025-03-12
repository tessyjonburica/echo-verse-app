"use client"

import { useState } from "react"
import { Play, Pause, MoreHorizontal, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddToPlaylistMenu } from "@/components/playlist/add-to-playlist-menu"
import { PlaybackProvider, usePlayback } from "@/providers/playback-provider"
import type { Song } from "@/providers/playlist-provider"
import { formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { songPaymentTiers } from "@/data/songs"

interface SongCardProps {
  song: Song
  index?: number
  songs?: Song[]
}

// This is the safe wrapper component that ensures PlaybackProvider is available
export function SongCard(props: SongCardProps) {
  return (
    <PlaybackProvider>
      <SongCardInner {...props} />
    </PlaybackProvider>
  )
}

// Inner component that uses the playback context
function SongCardInner({ song, index = 0, songs }: SongCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const { currentSong, isPlaying, playSong, togglePlayPause, isBuffering } = usePlayback()

  const isCurrentSong = currentSong?.id === song.id

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlayPause()
    } else {
      if (songs) {
        playSong(songs, index)
      } else {
        playSong([song], 0)
      }
    }
  }

  // Get payment tier badge if available
  const getTierBadge = () => {
    if (!song.id || !songPaymentTiers[song.id]) return null

    const { tier } = songPaymentTiers[song.id]
    const colors = {
      STANDARD: "bg-blue-100 text-blue-800 border-blue-200",
      PREMIUM: "bg-purple-100 text-purple-800 border-purple-200",
      EXCLUSIVE: "bg-amber-100 text-amber-800 border-amber-200",
    }

    return (
      <Badge variant="outline" className={colors[tier]}>
        {tier.charAt(0) + tier.slice(1).toLowerCase()}
      </Badge>
    )
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={song.coverUrl || "/placeholder.svg?height=200&width=200"}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {(isHovered || isCurrentSong) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full transition-transform duration-300 hover:scale-110"
              onClick={handlePlay}
              disabled={isBuffering && isCurrentSong}
            >
              {isBuffering && isCurrentSong ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isCurrentSong && isPlaying ? (
                <Pause className="h-6 w-6 animate-in fade-in duration-200" />
              ) : (
                <Play className="h-6 w-6 animate-in fade-in duration-200" />
              )}
            </Button>
          </div>
        )}
        {isCurrentSong && isPlaying && !isHovered && (
          <div className="absolute bottom-2 right-2 h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="truncate">
            <h3 className="truncate font-medium">{song.title}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              {getTierBadge()}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{formatTime(song.duration)}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-transform duration-200 hover:scale-110"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in fade-in slide-in-from-top-5 duration-200">
                <DropdownMenuItem onClick={handlePlay} className="cursor-pointer">
                  {isCurrentSong && isPlaying ? "Pause" : "Play"}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AddToPlaylistMenu song={song} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

