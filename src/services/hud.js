// do something with line when you win
export default class HudService {
  constructor(scene) {
    this.scene = scene
  }

  loadSolutionText = (rows, cols) => {
    this.rows = []
    this.cols = []
    this.graphics = this.scene.add.graphics()
    this.graphics.fillStyle(0x000000, 0.7)
    this.graphics.fillRect(40, 0, 1, 90).setDepth(40)
    this.graphics.fillRect(0, 40, 90, 1).setDepth(40)
    rows.forEach((row, i) => {
      const rowArr = []
      row.forEach((item, j) =>
        rowArr.push(
          this.addText(3 + 8 * j, 2 + i * 8, item).setScrollFactor(0, 1),
        ),
      )
      this.rows.push(rowArr)
    })
    cols.forEach((col, i) => {
      const colArr = []
      col.forEach((item, j) =>
        colArr.push(
          this.addText(3 + i * 8, 2 + j * 8, item).setScrollFactor(1, 0),
        ),
      )
      this.cols.push(colArr)
    })
    this.toggle(false)
  }

  updateSolutionText = (rows, cols) => {
    this.rows.forEach((row, i) => {
      row.forEach((item, j) => {
        item.setTint(rows[i][j] ? 0xffffff : 0xff0000)
        item.setAlpha(rows[i][j] ? 0.4 : 1)
      })
    })
    this.cols.forEach((col, i) => {
      col.forEach((item, j) => {
        item.setTint(cols[i][j] ? 0xffffff : 0xff0000)
        item.setAlpha(cols[i][j] ? 0.4 : 1)
      })
    })
  }

  toggle = (playSound = true) => {
    this.activeAxis = this.activeAxis ? 0 : 1
    if (playSound) this.scene.sound.play('swap')
    if (this.activeAxis) {
      this.rows.forEach((row) => row.forEach((item) => item.setDepth(-1)))
      this.cols.forEach((col) => col.forEach((item) => item.setDepth(3)))
    } else {
      this.rows.forEach((row) => row.forEach((item) => item.setDepth(3)))
      this.cols.forEach((col) => col.forEach((item) => item.setDepth(-1)))
    }
  }

  addText = (x, y, text = '') =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', text).setDepth(3)
}
