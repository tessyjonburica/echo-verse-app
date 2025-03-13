// Performance utilities for optimizing application speed

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function to limit the rate at which a function can fire
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
  const startTime = performance.now()
  return () => {
    const endTime = performance.now()
    console.log(`[Performance] ${componentName} rendered in ${endTime - startTime}ms`)
  }
}

/**
 * Preload critical assets
 */
export function preloadAssets(urls: string[]) {
  if (typeof window === "undefined") return

  urls.forEach((url) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const img = new Image()
      img.src = url
    } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
      const audio = new Audio()
      audio.preload = "metadata"
      audio.src = url
    }
  })
}

