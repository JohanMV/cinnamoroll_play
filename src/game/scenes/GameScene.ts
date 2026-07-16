import Phaser from 'phaser'
import Cinnamoroll from '../entities/Cinnamoroll'

const MAP_WIDTH = 4619
const MAP_HEIGHT = 2598
const PLAYER_SCALE = 0.40 //Tamaño de Cinamonroll
const PLAYER_SPEED = 200
const CAMERA_LERP = 0.1
const GAME_READY_EVENT = 'cinnamoroll:game-ready'
const JOYSTICK_OUTER_RADIUS = 80
const JOYSTICK_KNOB_RADIUS = 30
const JOYSTICK_TRAVEL_RADIUS = 50

/** The main level: map, player, camera, animations, and mobile controls. */
export default class GameScene extends Phaser.Scene {
  private player!: Cinnamoroll
  private readonly joystickVector = new Phaser.Math.Vector2(0, 0)
  private joystickElement: HTMLDivElement | null = null
  private joystickKnob: HTMLDivElement | null = null
  private activeTouchId: number | null = null

  constructor() {
    super('GameScene')
  }

  create(): void {
    this.createAnimations()

    // The background fills the map world at its native aspect ratio.
    this.add
      .image(MAP_WIDTH / 2, MAP_HEIGHT / 2, 'level-map')
      .setDisplaySize(MAP_WIDTH, MAP_HEIGHT)
      .setDepth(0)

    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT)

    this.player = new Cinnamoroll(
      this,
      MAP_WIDTH / 2,
      MAP_HEIGHT / 2,
      PLAYER_SCALE,
      PLAYER_SPEED,
    )

    const camera = this.cameras.main
    camera.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT)
    camera.centerOn(this.player.x, this.player.y)
    camera.startFollow(this.player, true, CAMERA_LERP, CAMERA_LERP)

    if ('ontouchstart' in window) {
      this.createVirtualJoystick()
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroyVirtualJoystick, this)

    // React fades the splash only after every playable system exists.
    window.dispatchEvent(new Event(GAME_READY_EVENT))
  }

  update(): void {
    this.player.updatePlayer(this.joystickVector)
  }

  private createAnimations(): void {
    const animationDefinitions = [
      { key: 'walk-down', texture: 'cinna-walk', start: 0, end: 3, frameRate: 8 },
      { key: 'walk-up', texture: 'cinna-walk', start: 4, end: 7, frameRate: 8 },
      { key: 'walk-right', texture: 'cinna-walk', start: 8, end: 11, frameRate: 8 },
      { key: 'walk-left', texture: 'cinna-walk', start: 12, end: 15, frameRate: 8 },
      { key: 'idle-down', texture: 'cinna-idle', start: 0, end: 3, frameRate: 4 },
      { key: 'idle-up', texture: 'cinna-idle', start: 4, end: 7, frameRate: 4 },
      { key: 'idle-right', texture: 'cinna-idle', start: 8, end: 11, frameRate: 4 },
      { key: 'idle-left', texture: 'cinna-idle', start: 12, end: 15, frameRate: 4 },
    ] as const

    for (const definition of animationDefinitions) {
      if (this.anims.exists(definition.key)) continue

      this.anims.create({
        key: definition.key,
        frames: this.anims.generateFrameNumbers(definition.texture, {
          start: definition.start,
          end: definition.end,
        }),
        frameRate: definition.frameRate,
        repeat: -1,
      })
    }
  }

  private createVirtualJoystick(): void {
    const outer = document.createElement('div')
    const knob = document.createElement('div')

    Object.assign(outer.style, {
      position: 'fixed',
      left: '24px',
      bottom: '24px',
      width: `${JOYSTICK_OUTER_RADIUS * 2}px`,
      height: `${JOYSTICK_OUTER_RADIUS * 2}px`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.28)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      boxSizing: 'border-box',
      touchAction: 'none',
      zIndex: '20',
    })

    Object.assign(knob.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${JOYSTICK_KNOB_RADIUS * 2}px`,
      height: `${JOYSTICK_KNOB_RADIUS * 2}px`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    })

    outer.setAttribute('aria-hidden', 'true')
    outer.appendChild(knob)
    document.body.appendChild(outer)

    outer.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    outer.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    outer.addEventListener('touchend', this.handleTouchEnd, { passive: false })
    outer.addEventListener('touchcancel', this.handleTouchEnd, { passive: false })

    this.joystickElement = outer
    this.joystickKnob = knob
  }

  private readonly handleTouchStart = (event: TouchEvent): void => {
    event.preventDefault()
    if (this.activeTouchId !== null) return

    const touch = event.changedTouches[0]
    if (!touch) return

    this.activeTouchId = touch.identifier
    this.updateJoystick(touch)
  }

  private readonly handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault()
    if (this.activeTouchId === null) return

    const touch = Array.from(event.changedTouches).find(
      (candidate) => candidate.identifier === this.activeTouchId,
    )
    if (touch) this.updateJoystick(touch)
  }

  private readonly handleTouchEnd = (event: TouchEvent): void => {
    if (this.activeTouchId === null) return

    const ended = Array.from(event.changedTouches).some(
      (touch) => touch.identifier === this.activeTouchId,
    )
    if (!ended) return

    event.preventDefault()
    this.activeTouchId = null
    this.joystickVector.set(0, 0)
    if (this.joystickKnob) {
      this.joystickKnob.style.transform = 'translate(-50%, -50%)'
    }
  }

  private updateJoystick(touch: Touch): void {
    if (!this.joystickElement || !this.joystickKnob) return

    const bounds = this.joystickElement.getBoundingClientRect()
    const offset = new Phaser.Math.Vector2(
      touch.clientX - (bounds.left + bounds.width / 2),
      touch.clientY - (bounds.top + bounds.height / 2),
    )
    const distance = Math.min(offset.length(), JOYSTICK_TRAVEL_RADIUS)

    if (offset.lengthSq() > 0) offset.normalize()

    const knobX = offset.x * distance
    const knobY = offset.y * distance
    this.joystickVector.set(knobX / JOYSTICK_TRAVEL_RADIUS, knobY / JOYSTICK_TRAVEL_RADIUS)
    this.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`
  }

  private destroyVirtualJoystick(): void {
    if (!this.joystickElement) return

    this.joystickElement.removeEventListener('touchstart', this.handleTouchStart)
    this.joystickElement.removeEventListener('touchmove', this.handleTouchMove)
    this.joystickElement.removeEventListener('touchend', this.handleTouchEnd)
    this.joystickElement.removeEventListener('touchcancel', this.handleTouchEnd)
    this.joystickElement.remove()
    this.joystickElement = null
    this.joystickKnob = null
    this.activeTouchId = null
    this.joystickVector.set(0, 0)
  }
}
