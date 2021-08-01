export default class HudService {
  constructor(scene) {
    this.scene = scene
    const { width, height } = this.scene.cameras.main

    // this.background = this.scene.add
    //   .graphics(0, 0)
    //   .fillStyle(0x181425)
    //   .fillRect(0, 0, width, 17)
    //   .fillStyle(0x3a4466)
    //   .fillRect(1, 1, width - 2, 15)
    //   .fillStyle(0x181425)
    //   .fillRect(2, 2, width - 4, 13)
    //   .setScrollFactor(0)

    // this.heartImage = this.scene.add
    //   .image(10, 8, 'tilemap', 47)
    //   .setScrollFactor(0)
 

    // this.healthText = this.addText(20, 6, '100')
  }

  addText = (x, y, text = '') =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', text).setScrollFactor(0)
}
