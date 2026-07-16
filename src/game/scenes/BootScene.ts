import Phaser from 'phaser'

const LOADING_PROGRESS_EVENT = 'cinnamoroll:loading-progress'
const WALK_SHEET_PATH = './assets/cinna-walk.png'
const IDLE_SHEET_PATH = './assets/cinna-idle.png'
const SPRITE_FRAME_SIZE = 313

/** Loads every game asset before handing control to the playable scene. */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload(): void {
    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      window.dispatchEvent(new CustomEvent<number>(LOADING_PROGRESS_EVENT, { detail: value }))
    })

    this.load.spritesheet('cinna-walk', WALK_SHEET_PATH, {
      frameWidth: SPRITE_FRAME_SIZE,
      frameHeight: SPRITE_FRAME_SIZE,
      endFrame: 15,
    })
    this.load.spritesheet('cinna-idle', IDLE_SHEET_PATH, {
      frameWidth: SPRITE_FRAME_SIZE,
      frameHeight: SPRITE_FRAME_SIZE,
      endFrame: 15,
    })
  }

  create(): void {
    window.dispatchEvent(new CustomEvent<number>(LOADING_PROGRESS_EVENT, { detail: 1 }))
    this.scene.start('GameScene')
  }
}
