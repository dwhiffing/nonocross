import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const { width, height } = this.cameras.main
    this.background = new Background(this)

    this.add.image(5, 20, 'title', 56).setOrigin(0)

    this.add
      .image(width / 2 - 15, height - 10, 'tilemap', 56)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game', { level: 1 })
      })

    this.add
      .image(width / 2 + 15, height - 10, 'tilemap', 57)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Credits'))
  }

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
  }
}
