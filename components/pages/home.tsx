"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SongGrid } from "../music/song-grid";
import { fetchFeaturedSongs, fetchRecentlyPlayed } from "@/lib/web3-api";
import { Loader } from "../ui/loader";
import { MainLayout } from "../layout/main-layout";
import { usePrivy } from "@/hooks/use-privy";

export function HomePage() {
  const { authenticated } = usePrivy();
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when authenticated
  useEffect(() => {
    if (authenticated) {
      const loadData = async () => {
        setLoading(true);
        try {
          const featured = await fetchFeaturedSongs();
          const recent = await fetchRecentlyPlayed();

          setFeaturedSongs(featured);
          setRecentlyPlayed(recent);
        } catch (error) {
          console.error("Error loading music data:", error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [authenticated]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome to Echo Verse</h1>
          <p className="text-gray-400">Discover and stream music from the decentralized web</p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader text="Loading music..." />
          </div>
        ) : (
          <>
            {/* Featured Tracks Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Featured Tracks</h2>
              <SongGrid songs={featuredSongs} />
            </section>

            {/* Recently Added Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
              <SongGrid songs={recentlyPlayed} />
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}