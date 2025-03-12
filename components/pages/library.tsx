"use client"

import { MainLayout } from "../layout/main-layout"
import { motion } from "framer-motion"
import { usePrivy } from "@/hooks/use-privy"
import { Loader } from "../ui/loader"

export function LibraryPage() {
  const { authenticated } = usePrivy()

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-2">Your Library</h1>
          <p className="text-gray-400">Manage your playlists and saved songs</p>
        </motion.div>

        {authenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-400">Your library features are being implemented. Check back soon for updates!</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <Loader text="Connect your wallet to view your library" />
          </div>
        )}
      </div>
    </MainLayout>
  )
}

