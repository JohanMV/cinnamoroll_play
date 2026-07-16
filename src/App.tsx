import { useEffect, useState } from 'react'
import PhaserGame from './PhaserGame'
import LoadingScreen from './ui/LoadingScreen'

const GAME_READY_EVENT = 'cinnamoroll:game-ready'

export type MapKey = 'level1' | 'level2'

export default function App() {
  const [isGameReady, setIsGameReady] = useState(false)
  const [mapKey, setMapKey] = useState<MapKey | null>(null)

  useEffect(() => {
    const handleGameReady = () => setIsGameReady(true)

    window.addEventListener(GAME_READY_EVENT, handleGameReady)
    return () => window.removeEventListener(GAME_READY_EVENT, handleGameReady)
  }, [])

  return (
    <main className="relative h-full w-full bg-black">
      {mapKey && <PhaserGame mapKey={mapKey} />}
      <LoadingScreen isGameReady={isGameReady} onMapSelect={setMapKey} />
    </main>
  )
}
