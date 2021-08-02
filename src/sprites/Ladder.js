export class Ladder extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, props) {
    super(scene, props.x + 4, props.y - 4, 'tilemap', 24)

    this.object = props
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setOffset(0)
  }
}
