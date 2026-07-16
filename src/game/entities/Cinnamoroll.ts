import Phaser from 'phaser'

const DEFAULT_DIRECTION = 'down'

type Direction = 'down' | 'up' | 'right' | 'left'

/** Arcade-physics player entity with keyboard and animation state handling. */
export default class Cinnamoroll extends Phaser.Physics.Arcade.Sprite {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private readonly wasd: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private readonly movementSpeed: number
  private lastDirection: Direction = DEFAULT_DIRECTION

  constructor(scene: Phaser.Scene, x: number, y: number, scale: number, speed: number) {
    super(scene, x, y, 'cinna-idle', 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const keyboard = scene.input.keyboard
    if (!keyboard) {
      throw new Error('Keyboard input is unavailable in this browser.')
    }

    this.cursors = keyboard.createCursorKeys()
    this.wasd = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.movementSpeed = speed

    this.setScale(scale)
    this.setCollideWorldBounds(true)
    this.setDepth(10)
    this.playAnimation('idle-down')

    // Key-down direction is retained so the correct idle pose remains visible.
    this.bindDirectionKey(this.cursors.down, 'down')
    this.bindDirectionKey(this.cursors.up, 'up')
    this.bindDirectionKey(this.cursors.right, 'right')
    this.bindDirectionKey(this.cursors.left, 'left')
    this.bindDirectionKey(this.wasd.S, 'down')
    this.bindDirectionKey(this.wasd.W, 'up')
    this.bindDirectionKey(this.wasd.D, 'right')
    this.bindDirectionKey(this.wasd.A, 'left')
  }

  updatePlayer(joystick: Phaser.Math.Vector2): void {
    const keyboardX = Number(this.cursors.right.isDown || this.wasd.D.isDown)
      - Number(this.cursors.left.isDown || this.wasd.A.isDown)
    const keyboardY = Number(this.cursors.down.isDown || this.wasd.S.isDown)
      - Number(this.cursors.up.isDown || this.wasd.W.isDown)

    const input = new Phaser.Math.Vector2(keyboardX + joystick.x, keyboardY + joystick.y)

    if (input.lengthSq() === 0) {
      this.setVelocity(0, 0)
      this.playAnimation(`idle-${this.lastDirection}`)
      return
    }

    input.normalize()
    this.setVelocity(input.x * this.movementSpeed, input.y * this.movementSpeed)

    this.lastDirection = this.directionFromVector(input)
    this.playAnimation(`walk-${this.lastDirection}`)
  }

  private bindDirectionKey(key: Phaser.Input.Keyboard.Key, direction: Direction): void {
    key.on(Phaser.Input.Keyboard.Events.DOWN, () => {
      this.lastDirection = direction
    })
  }

  private directionFromVector(vector: Phaser.Math.Vector2): Direction {
    if (Math.abs(vector.x) > Math.abs(vector.y)) {
      return vector.x > 0 ? 'right' : 'left'
    }

    return vector.y > 0 ? 'down' : 'up'
  }

  private playAnimation(key: string): void {
    if (this.anims.currentAnim?.key !== key) {
      this.play(key, true)
    }
  }
}
