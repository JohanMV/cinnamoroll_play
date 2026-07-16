import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from './game/config'

const GAME_PARENT_ID = 'game-container'

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    gameRef.current = new Phaser.Game(createGameConfig(GAME_PARENT_ID))

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div id={GAME_PARENT_ID} className="absolute inset-0" aria-label="Cinnamoroll Play game canvas" />
}
