import { WALK, FALL, JUMP, SHOOT, HEALTH, CLIMB } from '../behaviors'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, controlled = true) {
    super(scene, x, y, 'tilemap')
    this.scene = scene
    this.name = 'player'

    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.scene.behavior.enable(this)

    this.setSize(2, 8)
    this.setOffset(3, 0)
    this.setDepth(2)
    this.setAlpha(1)
    this.body.setGravityY(50)
    this.body.collideWorldBounds = true

    if (controlled) {
      this.behaviors.set('walk', WALK)
      this.behaviors.set('jump', JUMP)
      this.behaviors.set('fall', FALL)
      this.behaviors.set('shoot', SHOOT)
      this.behaviors.set('climb', CLIMB)
      this.scene.cameras.main.startFollow(this, true, 1, 1, 0, 0)
    }
  }
}
