export default class HudService {
  constructor(scene) {
    this.scene = scene
  }

  loadSolutionText = (rows, cols) => {
    this.rows = []
    this.cols = []
    for (let i = 0; i < 10; i++) {
      this.rows.push(this.addText(2, 2 + i * 8, rows[i]).setScrollFactor(0, 1))
    }
    for (let i = 0; i < 10; i++) {
      this.cols.push(this.addText(3 + i * 8, 1, cols[i]).setScrollFactor(1, 0))
    }
  }

  updateSolutionText = (rows, cols) => {
    this.rows.forEach((t, i) => t.setAlpha(rows[i] ? 0.1 : 1))
    this.cols.forEach((t, i) => t.setAlpha(cols[i] ? 0.1 : 1))
  }

  addText = (x, y, text = '') =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', text).setDepth(3)
}
