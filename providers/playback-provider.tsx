"use client"

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react"
import type { Song } from "@/providers/playlist-provider"
import { useToast } from "@/hooks/use-toast"
import { resolveAudioUrl } from "@/data/songs"
import { songPaymentTiers } from "@/data/songs"

interface PlaybackContextType {
  currentSong: Song | null
  isPlaying: boolean
  playSong: (songs: Song[], index: number) => void
  togglePlayPause: () => void
  nextSong: () => void
  previousSong: () => void
  seek: (time: number) => void
  currentTime: number
  duration: number
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  toggleMute: () => void
  paymentRate: number | null
  isBuffering: boolean
}

// Create a default context value to avoid null checks
const defaultContextValue: PlaybackContextType = {
  currentSong: null,
  isPlaying: false,
  playSong: () => {},
  togglePlayPause: () => {},
  nextSong: () => {},
  previousSong: () => {},
  seek: () => {},
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  setVolume: () => {},
  isMuted: false,
  toggleMute: () => {},
  paymentRate: null,
  isBuffering: false,
}

export const PlaybackContext = createContext<PlaybackContextType>(defaultContextValue)

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [songList, setSongList] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [paymentRate, setPaymentRate] = useState<number | null>(null)
  const [isBuffering, setIsBuffering] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Initialize audio element on client-side only
  useEffect(() => {
    setMounted(true)

    // Create audio element
    const audio = new Audio()
    audioRef.current = audio

    // Set up event listeners
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsBuffering(false)
    }
    const handleEnded = () => nextSong()
    const handleWaiting = () => setIsBuffering(true)
    const handleCanPlay = () => setIsBuffering(false)

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("canplay", handleCanPlay)

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""

        // Remove event listeners
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("waiting", handleWaiting)
        audio.removeEventListener("canplay", handleCanPlay)
      }
      setMounted(false)
    }
  }, [])

  // Update audio element when volume or mute state changes
  useEffect(() => {
    if (audioRef.current && mounted) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted, mounted])

  // Update audio element when current song changes
  useEffect(() => {
    const loadSong = async () => {
      if (!audioRef.current || !currentSong || !mounted) return

      try {
        setIsBuffering(true)

        // Resolve IPFS URL if needed
        const resolvedUrl = await resolveAudioUrl(currentSong.audioUrl)

        // Set the payment rate based on the song
        if (currentSong.id && songPaymentTiers[currentSong.id]) {
          setPaymentRate(songPaymentTiers[currentSong.id].rate)
        } else {
          setPaymentRate(0.0001) // Default rate
        }

        // Set up error handling before changing the source
        const handleError = () => {
          console.error("Error playing audio")
          toast({
            title: "Playback Error",
            description: "Could not play this track. The audio source may be unavailable.",
            variant: "destructive",
          })
          setIsPlaying(false)
          setIsBuffering(false)
        }

        audioRef.current.onerror = handleError
        audioRef.current.src = resolvedUrl
        audioRef.current.load()

        // If it was playing, continue playing the new track
        if (isPlaying) {
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Error playing audio:", error)
              setIsPlaying(false)
              setIsBuffering(false)
            })
          }
        }
      } catch (error) {
        console.error("Error loading song:", error)
        toast({
          title: "Playback Error",
          description: "Failed to load audio from IPFS. Please try again.",
          variant: "destructive",
        })
        setIsPlaying(false)
        setIsBuffering(false)
      }
    }

    if (currentSong) {
      loadSong()
    }
  }, [currentSong, isPlaying, mounted, toast])

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current || !mounted) return

    if (isPlaying) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      }
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, mounted])

  // Update time display during playback
  const updateTimeDisplay = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      requestAnimationFrame(updateTimeDisplay)
    }
  }

  const playSong = async (songs: Song[], index: number) => {
    if (!mounted) return
    setSongList(songs)
    setCurrentSong(songs[index])
    setCurrentSongIndex(index)
    setIsPlaying(true)
    requestAnimationFrame(updateTimeDisplay)
  }

  const togglePlayPause = () => {
    if (!mounted) return
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (!mounted || songList.length === 0) return
    const nextIndex = (currentSongIndex + 1) % songList.length
    setCurrentSong(songList[nextIndex])
    setCurrentSongIndex(nextIndex)
    setIsPlaying(true)
  }

  const previousSong = () => {
    if (!mounted || songList.length === 0) return
    const previousIndex = (currentSongIndex - 1 + songList.length) % songList.length
    setCurrentSong(songList[previousIndex])
    setCurrentSongIndex(previousIndex)
    setIsPlaying(true)
  }

  const seek = (time: number) => {
    if (!mounted || !audioRef.current) return
    setCurrentTime(time)
    audioRef.current.currentTime = time
  }

  const toggleMute = () => {
    if (!mounted) return
    setIsMuted(!isMuted)
  }

  const value = {
    currentSong,
    isPlaying,
    playSong,
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
  }

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
}

export function usePlayback() {
  const context = useContext(PlaybackContext)
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider")
  }
  return context
}

