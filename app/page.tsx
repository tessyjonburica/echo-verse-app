"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, Play, Music, Wallet, Zap, Globe, Shield, ChevronDown, Headphones, Volume2 } from "lucide-react"
import { preloadAssets } from "@/lib/performance"
import { cn } from "@/lib/utils"

// Preload critical images
const CRITICAL_ASSETS = [
  "/hero-bg.jpg",
  "/logo.svg",
  "/artist-payment.png",
  "/app-screenshot.png",
  "/mobile-app.png",
  "/waveform.svg",
  "/vinyl-record.png",
  "/headphones.png",
]

// Interactive music notes for animation
const MUSIC_NOTES = [
  { id: 1, size: 20, delay: 0, duration: 3 },
  { id: 2, size: 16, delay: 0.5, duration: 3.5 },
  { id: 3, size: 24, delay: 1, duration: 4 },
  { id: 4, size: 14, delay: 1.5, duration: 3.2 },
  { id: 5, size: 18, delay: 2, duration: 3.8 },
  { id: 6, size: 22, delay: 2.5, duration: 4.2 },
]

// Animated music note component
const MusicNote = ({ size, delay, duration }: { size: number; delay: number; duration: number }) => {
  return (
    <motion.div
      className="absolute text-primary/30"
      initial={{
        opacity: 0,
        scale: 0,
        x: Math.random() * 100 - 50,
        y: Math.random() * 50 + 50,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: Math.random() * 200 - 100,
        y: -100 - Math.random() * 100,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 2,
      }}
      style={{ fontSize: size }}
    >
      ♪
    </motion.div>
  )
}

// Animated waveform component
const AnimatedWaveform = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[url('/waveform.svg')] bg-repeat-x bg-bottom opacity-20"
        animate={{
          backgroundPositionX: ["0%", "100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}

// Interactive vinyl record component
const VinylRecord = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <motion.div
      className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 hidden lg:block"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 3, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <Image
          src="/vinyl-record.png"
          alt="Vinyl Record"
          width={320}
          height={320}
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "w-16 h-16 rounded-full bg-white flex items-center justify-center transition-all duration-300",
              isPlaying ? "scale-90 bg-primary" : "scale-100 bg-white",
            )}
          >
            {isPlaying ? <Headphones className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-primary ml-1" />}
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-sm font-medium">
        {isPlaying ? "Click to pause" : "Click to play"}
      </div>
    </motion.div>
  )
}

// Interactive volume slider
const VolumeControl = () => {
  const [volume, setVolume] = useState(70)

  return (
    <motion.div
      className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 hidden lg:flex"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <Volume2 className="h-8 w-8 text-primary" />
      <div className="h-40 w-2 bg-muted rounded-full relative">
        <div
          className="absolute bottom-0 left-0 right-0 bg-primary rounded-full transition-all duration-200"
          style={{ height: `${volume}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number.parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="text-sm font-medium">{volume}%</span>
    </motion.div>
  )
}

// Floating headphones component
const FloatingHeadphones = () => {
  return (
    <motion.div
      className="absolute -top-10 right-1/4 hidden lg:block"
      initial={{ y: 0 }}
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <Image src="/headphones.png" alt="Headphones" width={120} height={120} className="object-contain" />
    </motion.div>
  )
}

export default function LandingPage() {
  const { authenticated, login } = useAuth()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100])
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  useEffect(() => {
    setMounted(true)

    // Preload critical assets
    preloadAssets(CRITICAL_ASSETS)

    // If already authenticated, redirect to home
    if (authenticated) {
      router.push("/home")
    }

    return () => {
      setMounted(false)
    }
  }, [authenticated, router])

  const handleExploreApp = async () => {
    if (authenticated) {
      router.push("/home")
    } else {
      // Login and then redirect to home
      await login()
      router.push("/home")
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Enhanced Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity, scale, y }}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-30"
            style={{ y: bgY }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />

          {/* Animated particles */}
          <div className="absolute inset-0 z-5">
            {MUSIC_NOTES.map((note) => (
              <MusicNote key={note.id} size={note.size} delay={note.delay} duration={note.duration} />
            ))}
          </div>

          {/* Animated waveform */}
          <AnimatedWaveform />

          {/* Interactive vinyl record */}
          <VinylRecord />

          {/* Volume control */}
          <VolumeControl />

          {/* Floating headphones */}
          <FloatingHeadphones />
        </div>

        <div className="container mx-auto px-4 z-10 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Image
                src="/logo.svg"
                alt="EchoVerse Logo"
                width={150}
                height={150}
                className="mx-auto mb-6 drop-shadow-lg"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-[length:200%_200%]"
            >
              EchoVerse
            </motion.span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          >
            Revolutionizing Music in Web3
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto px-4"
          >
            Stream music and pay artists directly per second with MegaETH blockchain technology. Fair, transparent, and
            decentralized.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleExploreApp}
                className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Explore App
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Interactive sound wave visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 max-w-md mx-auto h-16 flex items-center justify-center gap-1"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-primary/60 rounded-full"
                animate={{
                  height: [
                    `${Math.random() * 20 + 10}px`,
                    `${Math.random() * 40 + 20}px`,
                    `${Math.random() * 20 + 10}px`,
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </motion.div>
      </motion.div>

      {/* Features Section - Made more responsive */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-background/90 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Why Choose EchoVerse</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              EchoVerse combines cutting-edge blockchain technology with a seamless music streaming experience to create
              a revolutionary platform for artists and listeners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="bg-primary/10 p-4 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                <Music className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Pay-Per-Second Streaming</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Only pay for what you listen to with our revolutionary pay-per-second model, ensuring fair compensation
                for artists and value for listeners.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="bg-primary/10 p-4 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                <Wallet className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Direct Artist Payments</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Artists receive payments directly to their wallets in real-time, eliminating middlemen and maximizing
                their earnings from their creative work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="bg-primary/10 p-4 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Lightning Fast Streaming</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Experience high-quality, buffer-free music streaming powered by our optimized decentralized
                infrastructure and IPFS technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Improved for mobile */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How EchoVerse Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Our platform seamlessly connects artists and listeners through blockchain technology, creating a
              transparent and fair music ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">For Listeners</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Connect Your Wallet</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Link your MegaETH wallet to your EchoVerse account to enable seamless payments.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Browse and Discover</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Explore our vast library of decentralized music from artists around the world.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Stream and Pay</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Listen to music and automatically pay artists per second of playback at transparent rates.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-xl opacity-70"></div>
              <Image
                src="/app-screenshot.png"
                alt="EchoVerse App Interface"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl relative z-10 w-full h-auto"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mt-16 sm:mt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 md:order-1"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-xl blur-xl opacity-70"></div>
              <Image
                src="/artist-payment.png"
                alt="Artist Payment Dashboard"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl relative z-10 w-full h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">For Artists</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Upload Your Music</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Upload your tracks to our decentralized storage system powered by IPFS.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Set Your Rates</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Choose your per-second streaming rates with our tiered pricing system.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Receive Instant Payments</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Get paid directly to your wallet in real-time as listeners stream your music.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Section - Improved for mobile */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Powered by Cutting-Edge Technology</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              EchoVerse leverages the latest blockchain and web technologies to create a seamless, secure, and
              transparent music platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-card p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-primary/10 p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Wallet className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">MegaETH Blockchain</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Built on MegaETH's high-performance blockchain for lightning-fast transactions with minimal fees.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-primary/10 p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Globe className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">IPFS Storage</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Decentralized file storage ensures your music is always available and resistant to censorship.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-primary/10 p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Zap className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">React & Next.js</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Built with modern web technologies for a fast, responsive, and seamless user experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-card p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-primary/10 p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">Smart Contracts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Secure and transparent smart contracts handle all payments and rights management.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Improved for mobile */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Music Experience?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Join thousands of artists and listeners already revolutionizing the music industry with EchoVerse.
            </p>
            <Button
              size="lg"
              onClick={handleExploreApp}
              className="group text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300"
            >
              Explore App Now
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer - Enhanced with music theme */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Animated music notes background */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 10,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              style={{ fontSize: Math.random() * 20 + 10 }}
            >
              {Math.random() > 0.5 ? "♪" : "♫"}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Image src="/logo.svg" alt="EchoVerse Logo" width={50} height={50} className="mr-3" />
                </motion.div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                  EchoVerse
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                A decentralized pay-per-second music streaming platform powered by MegaETH blockchain technology.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons */}
                {["twitter", "facebook", "instagram", "github"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors"
                  >
                    {social === "twitter" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    )}
                    {social === "facebook" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    )}
                    {social === "instagram" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    )}
                    {social === "github" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">Platform</h3>
              <ul className="space-y-2">
                {["About", "Features", "Pricing", "FAQ", "Support"].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">For Artists</h3>
              <ul className="space-y-2">
                {["Upload Music", "Analytics", "Payments", "Promotion", "Resources"].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates and releases.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-background border border-border rounded-l-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <motion.button
                  className="bg-primary text-primary-foreground rounded-r-md px-3 py-2 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} EchoVerse. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Terms", "Privacy", "Cookies", "Legal"].map((item) => (
                <a key={item} href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Animated waveform at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[url('/waveform.svg')] bg-repeat-x bg-bottom opacity-10"
              animate={{
                backgroundPositionX: ["0%", "100%"],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

