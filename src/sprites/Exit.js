export class Exit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, props) {
    super(scene, props.x + 4, props.y - 4, 'tilemap', 17)

    this.object = props
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enable(this)
    this.setOffset(0).setSize(2, 8)
    this.alpha = 0
  }

  toggle(isSolved, playSound = true) {
    if (playSound) {
      if (this.alpha !== (isSolved ? 1 : 0))
        this.scene.playSound(isSolved ? 'win' : 'unwin')
    }
    this.alpha = isSolved ? 1 : 0
  }

  overlap() {
    if (this.alpha < 1) return
    this.scene.sound.play('complete', { volume: 0.5 })
    this.scene.nextLevel()
  }
}
