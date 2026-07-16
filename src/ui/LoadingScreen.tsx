import { useEffect, useState } from 'react'
import type { MapKey } from '../App'

const LOADING_PROGRESS_EVENT = 'cinnamoroll:loading-progress'
const FADE_DURATION_MS = 700

const requestFullscreen = () => {
  const el = document.documentElement

  try {
    let fullscreenRequest: Promise<void> | undefined

    if (el.requestFullscreen) {
      fullscreenRequest = el.requestFullscreen()
    } else if ((el as any).webkitRequestFullscreen) {
      fullscreenRequest = (el as any).webkitRequestFullscreen() // Safari/iOS
    } else if ((el as any).mozRequestFullScreen) {
      fullscreenRequest = (el as any).mozRequestFullScreen() // Firefox
    } else if ((el as any).msRequestFullscreen) {
      fullscreenRequest = (el as any).msRequestFullscreen() // IE/Edge
    }

    void fullscreenRequest?.catch(() => undefined)
  } catch {
    // Some mobile browsers do not support fullscreen; loading continues normally.
  }
}

interface LoadingScreenProps {
  isGameReady: boolean
  onMapSelect: (map: MapKey) => void
}

export default function LoadingScreen({ isGameReady, onMapSelect }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const isMobile = 'ontouchstart' in window
  const [selectedMap, setSelectedMap] = useState<MapKey | null>(null)


  const handleMapSelect = (map: MapKey) => {
    setSelectedMap(map)
    onMapSelect(map)
  }
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
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        isGameReady ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-label="Loading Cinnamoroll Play"
      aria-live="polite"
    >
      <picture className="absolute inset-0" aria-hidden="true">
        <source
          media="(orientation: portrait)"
          srcSet="./assets/pantalla_de_carga_vertical.webp"
        />
        <img
          src="./assets/pantalla_de_carga_horizontal.webp"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/5 via-transparent to-sky-950/15" />
      {selectedMap ? (
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
      ) : (
        <div className="fixed bottom-4 left-1/2 z-10 w-[min(90vw,22rem)] -translate-x-1/2 portrait:bottom-8">
          <div className="relative rounded-[2rem] border-2 border-white/90 bg-white/65 p-3.5 shadow-[0_18px_50px_rgba(78,145,185,0.25)] backdrop-blur-md">
            <span className="absolute -left-2 top-8 h-5 w-5 rounded-full border-2 border-white bg-[#bfeeff] shadow-sm" />
            <span className="absolute -right-1 top-16 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ffe6a6] shadow-sm" />

            <div className="mb-3 flex items-center justify-center gap-2 text-center text-sm font-extrabold tracking-wide text-[#39769b]">
              <span className="text-[#f6b9cf]">&#10022;</span>
              <span>&iquest;A d&oacute;nde vamos hoy?</span>
              <span className="text-[#f6b9cf]">&#10022;</span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleMapSelect('level1')}
                className="group flex min-h-16 w-full items-center gap-3 rounded-[1.4rem] border-[3px] border-[#a9ddf5] bg-gradient-to-r from-white to-[#eaf8ff] px-3 py-2.5 text-left shadow-[0_5px_0_#8bc8e5,0_9px_18px_rgba(74,152,190,0.18)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-1 active:shadow-none"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white bg-[#cceeff] text-xl shadow-[0_3px_8px_rgba(82,156,193,0.2)] transition group-hover:rotate-[-6deg]">&#127891;</span>
                <span className="flex flex-col">
                  <span className="text-base font-black tracking-wide text-[#245f88]">UCSUR</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#73a9c7]">Campus Villa</span>
                </span>
                <span className="ml-auto pr-1 text-lg font-black text-[#8fcbe7]">&#8250;</span>
              </button>

              <button
                type="button"
                onClick={() => handleMapSelect('level2')}
                className="group flex min-h-16 w-full items-center gap-3 rounded-[1.4rem] border-[3px] border-[#f4cf91] bg-gradient-to-r from-white to-[#fff6df] px-3 py-2.5 text-left shadow-[0_5px_0_#e5b96e,0_9px_18px_rgba(180,127,41,0.16)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-1 active:shadow-none"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white bg-[#ffe9b8] text-xl shadow-[0_3px_8px_rgba(183,126,36,0.18)] transition group-hover:rotate-[6deg]">&#127963;&#65039;</span>
                <span className="flex flex-col">
                  <span className="text-base font-black tracking-wide text-[#986717]">Centro de Lima</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c79a4e]">Centro hist&oacute;rico</span>
                </span>
                <span className="ml-auto pr-1 text-lg font-black text-[#e2b767]">&#8250;</span>
              </button>
            </div>

            {isMobile && (
              <button
                type="button"
                onClick={requestFullscreen}
                className="mx-auto mt-4 flex min-w-60 items-center justify-center gap-2 rounded-full border-2 border-white bg-white/85 px-6 py-2.5 text-xs font-extrabold tracking-wide text-[#477f9f] shadow-[0_4px_14px_rgba(62,126,161,0.16)] transition hover:bg-white active:scale-95"
                aria-label="Jugar en pantalla completa"
              >
                <span className="text-base text-[#78bddf]">&#9974;</span>
                Pantalla Completa
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
