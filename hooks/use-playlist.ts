// Re-export the usePlaylist hook from the provider
import { usePlaylist as usePlaylistFromProvider } from "@/providers/playlist-provider"

export function usePlaylist() {
  return usePlaylistFromProvider()
}

