export default class HudService {
  constructor(scene) {
    this.scene = scene
    // scene.time.addEvent({
    //   delay: 3000,
    //   callback: this.toggle,
    //   loop: true,
    // })
  }

  loadSolutionText = (rows, cols) => {
    this.rows = []
    this.cols = []
    this.graphics = this.scene.add.graphics()
    this.graphics.fillStyle(0x000000, 0.7)
    this.graphics.fillRect(40, 0, 1, 90).setDepth(40)
    this.graphics.fillRect(0, 40, 90, 1).setDepth(40)
    rows.forEach((item, i) =>
      this.rows.push(
        this.addText(3, 2 + i * 8, item.join(' ')).setScrollFactor(0, 1),
      ),
    )
    cols.forEach((item, i) =>
      this.cols.push(this.addText(3 + i * 8, 2, item).setScrollFactor(1, 0)),
    )
    this.toggle(false)
  }

  updateSolutionText = (rows, cols) => {
    this.rows.forEach((t, i) => t.setTint(rows[i] ? 0xffffff : 0xff0000))
    this.cols.forEach((t, i) => t.setTint(cols[i] ? 0xffffff : 0xff0000))
    this.rows.forEach((t, i) => t.setAlpha(rows[i] ? 0.6 : 1))
    this.cols.forEach((t, i) => t.setAlpha(cols[i] ? 0.6 : 1))
  }

  toggle = (playSound = true) => {
    this.activeAxis = this.activeAxis ? 0 : 1
    if (playSound) this.scene.sound.play('swap')
    if (this.activeAxis) {
      this.rows.forEach((t, i) => t.setDepth(-1))
      this.cols.forEach((t, i) => t.setDepth(3))
    } else {
      this.rows.forEach((t, i) => t.setDepth(3))
      this.cols.forEach((t, i) => t.setDepth(-1))
    }
  }

  addText = (x, y, text = '') =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', text).setDepth(3)
}
