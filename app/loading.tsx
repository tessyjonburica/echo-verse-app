"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        {/* Music equalizer animation */}
        <div className="flex items-end h-16 space-x-1 mb-6">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-gradient-to-t from-primary to-purple-500 rounded-full"
              animate={{
                height: [
                  `${Math.random() * 20 + 10}px`,
                  `${Math.random() * 60 + 20}px`,
                  `${Math.random() * 20 + 10}px`,
                ],
              }}
              transition={{
                duration: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Vinyl record animation */}
        <motion.div
          className="relative w-20 h-20 mb-4"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700"></div>
          <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-primary"></div>
          <div className="absolute inset-8 rounded-full border-2 border-dashed border-gray-600 opacity-50"></div>
        </motion.div>

        <motion.p
          className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Loading EchoVerse...
        </motion.p>

        {/* Pulsing music notes */}
        <div className="mt-4 flex space-x-3">
          {["♪", "♫", "♪"].map((note, i) => (
            <motion.span
              key={i}
              className="text-primary text-xl"
              initial={{ y: 0 }}
              animate={{
                y: [-5, 5, -5],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            >
              {note}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

