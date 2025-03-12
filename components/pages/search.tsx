"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "../layout/main-layout"
import { motion } from "framer-motion"
import { SearchIcon } from "lucide-react"
import { SongGrid } from "../music/song-grid"
import { searchSongs } from "@/lib/web3-api"
import { Loader } from "../ui/loader"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsSearching(true)
    try {
      const searchResults = await searchSongs(query)
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6">Search</h1>

          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for songs, artists, or albums"
                className="w-full pl-12 pr-4 py-3 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>
        </motion.div>

        {isSearching ? (
          <div className="flex items-center justify-center py-20">
            <Loader text="Searching..." />
          </div>
        ) : results.length > 0 ? (
          <section>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <SongGrid songs={results} />
          </section>
        ) : query ? (
          <div className="text-center py-20 text-gray-400">No results found for "{query}"</div>
        ) : (
          <div className="text-center py-20 text-gray-400">Search for music to get started</div>
        )}
      </div>
    </MainLayout>
  )
}

