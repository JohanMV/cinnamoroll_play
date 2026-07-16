import { useEffect, useState } from 'react'
import PhaserGame from './PhaserGame'
import LoadingScreen from './ui/LoadingScreen'

const GAME_READY_EVENT = 'cinnamoroll:game-ready'

export default function App() {
  const [isGameReady, setIsGameReady] = useState(false)

  useEffect(() => {
    const handleGameReady = () => setIsGameReady(true)

    window.addEventListener(GAME_READY_EVENT, handleGameReady)
    return () => window.removeEventListener(GAME_READY_EVENT, handleGameReady)
  }, [])

  return (
    <main className="relative h-full w-full bg-black">
      <PhaserGame />
      <LoadingScreen isGameReady={isGameReady} />
    </main>
  )
}
