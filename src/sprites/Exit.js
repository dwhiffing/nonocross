export class Exit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, props) {
    super(scene, props.x + 4, props.y - 4, 'tilemap', 17)

    this.object = props
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setOffset(0)
    this.alpha = 0
  }

  toggle(isSolved) {
    this.alpha = isSolved ? 1 : 0
  }

  overlap() {
    if (this.alpha < 1) return
    this.scene.nextLevel()
  }
}
