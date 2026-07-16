import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from './game/config'
import type { MapKey } from './App'

const GAME_PARENT_ID = 'game-container'

interface PhaserGameProps {
  mapKey: MapKey
}

export default function PhaserGame({ mapKey }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    const game = new Phaser.Game(createGameConfig(GAME_PARENT_ID))
    game.registry.set('mapKey', mapKey)
    gameRef.current = game

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [mapKey])

  return <div id={GAME_PARENT_ID} className="absolute inset-0" aria-label="Cinnamoroll Play game canvas" />
}
