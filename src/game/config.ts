import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'

const GAME_BACKGROUND_COLOR = '#000000'

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: GAME_BACKGROUND_COLOR,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [BootScene, GameScene],
  }
}
