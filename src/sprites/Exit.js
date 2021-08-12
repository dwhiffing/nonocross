export class Exit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, props) {
    super(scene, props.x + 4, props.y - 4, 'tilemap', 17)

    this.object = props
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setOffset(0)
    this.alpha = 0.1
  }

  activate() {
    this.alpha = 1
  }

  overlap() {
    if (this.alpha < 1) return
    const level = this.scene.levelKey + 1
    if (level <= window.NUM_LEVELS) {
      this.scene.scene.start('Game', { level })
    } else {
      this.scene.scene.start('Menu')
    }
  }
}
