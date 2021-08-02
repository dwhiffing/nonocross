import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const { width, height } = this.cameras.main
    this.background = new Background(this)

    this.add
      .bitmapText(width / 2, height / 2, 'pixel-dan', 'LR64'.toUpperCase())
      .setFontSize(5)
      .setOrigin(0.5, 0.5)

    this.add
      .image(width / 2 - 15, height - 10, 'tilemap', 56)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('Game', { level: 1 }))

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
