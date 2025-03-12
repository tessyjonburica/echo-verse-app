import { ipfsService } from "@/services/ipfs-service"
import type { Song } from "@/providers/playlist-provider"

// Sample featured songs data with IPFS CIDs
export const featuredSongs: Song[] = [
  {
    id: "song1",
    title: "Midnight Serenade",
    artist: "Luna Echo",
    album: "Moonlight Sonatas",
    duration: 237,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Midnight+Serenade",
    audioUrl: "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  },
  {
    id: "song2",
    title: "Electric Dreams",
    artist: "Neon Pulse",
    album: "Synthwave Nights",
    duration: 198,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Electric+Dreams",
    audioUrl: "ipfs://QmZTR5bcpQD7cFgTorqxZDYaew1Wqgfbd2ud9QqGPAkK2V",
  },
  {
    id: "song3",
    title: "Ocean Waves",
    artist: "Coastal Vibes",
    album: "Seaside Sessions",
    duration: 264,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Ocean+Waves",
    audioUrl: "ipfs://QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq",
  },
  {
    id: "song4",
    title: "Mountain High",
    artist: "Alpine Echoes",
    album: "Summit Sounds",
    duration: 215,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Mountain+High",
    audioUrl: "ipfs://QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A",
  },
]

// Sample new releases data with IPFS CIDs
export const newReleases: Song[] = [
  {
    id: "song5",
    title: "Urban Jungle",
    artist: "City Beats",
    album: "Metropolitan",
    duration: 183,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Urban+Jungle",
    audioUrl: "ipfs://QmTDMoVqvyBkNMRhzvukTDznntByUNDwyNdSfV8dZ3VKRC",
  },
  {
    id: "song6",
    title: "Desert Wind",
    artist: "Sahara Sound",
    album: "Oasis",
    duration: 227,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Desert+Wind",
    audioUrl: "ipfs://QmPCawMTd7csXKf7QVrAFbHGiLPPn3qcjNBg1g6gWHkF3m",
  },
  {
    id: "song7",
    title: "Neon Lights",
    artist: "Cyber Punk",
    album: "Digital Dreams",
    duration: 192,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Neon+Lights",
    audioUrl: "ipfs://QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D",
  },
  {
    id: "song8",
    title: "Rainy Day",
    artist: "Melancholy Mood",
    album: "Umbrella Sessions",
    duration: 245,
    coverUrl: "/placeholder.svg?height=300&width=300&text=Rainy+Day",
    audioUrl: "ipfs://QmbtFKnBuyUmRoFAoxEJxqZBCTamYeGnZ4MrHCLehWkHre",
  },
]

// Library songs (combination of featured and new releases)
export const librarySongs: Song[] = [...featuredSongs, ...newReleases]

// Helper function to resolve IPFS URLs to HTTP URLs
export async function resolveAudioUrl(url: string): Promise<string> {
  if (url.startsWith("ipfs://")) {
    const cid = url.replace("ipfs://", "")
    const file = await ipfsService.getFile(cid)
    if (file) {
      return file.url
    }
    // Fallback to direct CID mapping if getFile fails
    const directUrl = ipfsService.cidToUrl(cid)
    if (directUrl) {
      return directUrl
    }
    throw new Error(`Failed to resolve IPFS URL: ${url}`)
  }
  return url
}

// Payment tiers for songs (for display purposes)
export const songPaymentTiers: Record<string, { rate: number; tier: "STANDARD" | "PREMIUM" | "EXCLUSIVE" }> = {
  song1: { rate: 0.0001, tier: "STANDARD" },
  song2: { rate: 0.0003, tier: "PREMIUM" },
  song3: { rate: 0.0005, tier: "EXCLUSIVE" },
  song4: { rate: 0.0001, tier: "STANDARD" },
  song5: { rate: 0.0001, tier: "STANDARD" },
  song6: { rate: 0.0003, tier: "PREMIUM" },
  song7: { rate: 0.0005, tier: "EXCLUSIVE" },
  song8: { rate: 0.0001, tier: "STANDARD" },
}

