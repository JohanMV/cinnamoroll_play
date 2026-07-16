import { useEffect, useState } from 'react'

const LOADING_PROGRESS_EVENT = 'cinnamoroll:loading-progress'
const FADE_DURATION_MS = 700

interface LoadingScreenProps {
  isGameReady: boolean
}

export default function LoadingScreen({ isGameReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleProgress = (event: Event) => {
      const customEvent = event as CustomEvent<number>
      setProgress(Math.round(customEvent.detail * 100))
    }

    window.addEventListener(LOADING_PROGRESS_EVENT, handleProgress)
    return () => window.removeEventListener(LOADING_PROGRESS_EVENT, handleProgress)
  }, [])

  useEffect(() => {
    if (!isGameReady) return

    setProgress(100)
    const timeoutId = window.setTimeout(() => setIsVisible(false), FADE_DURATION_MS)
    return () => window.clearTimeout(timeoutId)
  }, [isGameReady])

  if (!isVisible) return null

  return (
    <section
      className={`fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center transition-opacity duration-700 ease-out ${
        isGameReady ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundImage: "url('./assets/pantalla_de_carga.webp')" }}
      aria-label="Loading Cinnamoroll Play"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-sky-950/10" />
      <div className="relative mt-[54vh] flex w-64 flex-col items-center gap-3 sm:w-80">
        <div className="h-3 w-full overflow-hidden rounded-full border border-white/80 bg-white/35 p-0.5 shadow-lg backdrop-blur-sm">
          <div
            className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="rounded-full bg-sky-900/35 px-4 py-1 text-sm font-bold tracking-wide text-white shadow-sm backdrop-blur-sm">
          Loading... {progress}%
        </p>
      </div>
    </section>
  )
}
