"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Loader2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { usePlayback } from "@/providers/playback-provider"
import { formatTime } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { songPaymentTiers } from "@/data/songs"

export function Player() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong,
    seek,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    paymentRate,
    isBuffering,
  } = usePlayback()

  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [totalPaid, setTotalPaid] = useState(0)
  const volumeRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    setMounted(true)

    const handleClickOutside = (event: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Track payment for active playback
    let paymentInterval: NodeJS.Timeout | null = null

    if (isPlaying && paymentRate) {
      paymentInterval = setInterval(() => {
        setTotalPaid((prev) => prev + paymentRate)
      }, 1000)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (paymentInterval) clearInterval(paymentInterval)
      setMounted(false)
    }
  }, [isPlaying, paymentRate])

  if (!mounted || !currentSong) return null

  // Get payment tier badge
  const getTierBadge = () => {
    if (!currentSong.id || !songPaymentTiers[currentSong.id]) return null

    const { tier } = songPaymentTiers[currentSong.id]
    const colors = {
      STANDARD: "bg-blue-100 text-blue-800 border-blue-200",
      PREMIUM: "bg-purple-100 text-purple-800 border-purple-200",
      EXCLUSIVE: "bg-amber-100 text-amber-800 border-amber-200",
    }

    return (
      <Badge variant="outline" className={cn("ml-2", colors[tier])}>
        {tier.charAt(0) + tier.slice(1).toLowerCase()}
      </Badge>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-2">
      <div className="container mx-auto flex items-center justify-between max-w-7xl">
        <div className={cn("flex items-center gap-3", isMobile ? "w-1/2" : "w-1/3")}>
          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <img
              src={currentSong.coverUrl || "/placeholder.svg?height=48&width=48"}
              alt={currentSong.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="truncate">
            <div className="font-medium truncate flex items-center">
              {currentSong.title}
              {getTierBadge()}
            </div>
            <div className="text-xs text-muted-foreground truncate">{currentSong.artist}</div>
          </div>
        </div>

        <div className={cn("flex flex-col items-center", isMobile ? "w-1/2" : "w-1/3")}>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={previousSong}
                className="transition-transform duration-200 hover:scale-110"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full transition-transform duration-300 hover:scale-110 relative overflow-hidden"
              onClick={togglePlayPause}
              disabled={isBuffering}
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5 animate-in fade-in duration-200" />
              ) : (
                <Play className="h-5 w-5 animate-in fade-in duration-200" />
              )}
              {isPlaying && <span className="absolute inset-0 rounded-full animate-pulse-ring"></span>}
            </Button>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSong}
                className="transition-transform duration-200 hover:scale-110"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            )}
          </div>
          {!isMobile && (
            <>
              <div className="flex items-center gap-2 w-full mt-1">
                <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={(value) => seek(value[0])}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
              </div>
              {paymentRate && (
                <div className="text-xs text-muted-foreground mt-1 animate-pulse">
                  Paying {paymentRate.toFixed(6)} ETH/sec | Total: {totalPaid.toFixed(6)} ETH
                </div>
              )}
            </>
          )}
        </div>

        {!isMobile && (
          <div className="flex items-center justify-end gap-2 w-1/3">
            <div className="relative" ref={volumeRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="transition-transform duration-200 hover:scale-110"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-background border rounded-md shadow-md w-32 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                  />
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="transition-transform duration-200 hover:scale-110">
              <ListMusic className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

