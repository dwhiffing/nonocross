import { WALK, FALL, JUMP, SHOOT, HEALTH } from '../behaviors'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, controlled = true) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.name = 'player'

    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.scene.behavior.enable(this)

    this.setSize(8, 8)
    this.setOffset(0, 0)
    this.setDepth(2)
    this.setAlpha(1)
    this.body.setGravityY(400)
    this.body.collideWorldBounds = true

    if (controlled) {
      this.behaviors.set('walk', WALK)
      this.behaviors.set('jump', JUMP)
      this.behaviors.set('fall', FALL)
      this.behaviors.set('shoot', SHOOT)
      this.scene.cameras.main.startFollow(this, true, 1, 1, 0, 0)
      this.behaviors.set('health', HEALTH, {
        maxHealth: 100,
        screenShake: true,
        knockback: 100,
        onHealthChange: (v) => this.scene.hud?.healthText.setText(v),
        onDestroy: () => this.scene.scene.restart(),
      })
    }
  }

  clone = () => {
    const clone = new Player(this.scene, this.x, this.y, false)
    clone.last_frame = 0
    clone.history = [...this.history]
    clone.isClone = true
  }
}
