import HudService from '../services/Hud'
import InputService from '../services/input'
import LevelService from '../services/level'
import Background from '../sprites/Background'

export default class extends Phaser.Scene {
  constructor(opts) {
    super({ key: 'Game' })
  }

  init(opts) {
    this.levelKey = opts.level || 1
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')
    this.background = new Background(this)
    this.particles = this.add.particles('tilemap')
    this.level = new LevelService(this)
    this.level.start(`map${this.levelKey}`)
    this.inputService = new InputService(this)
    this.hud = new HudService(this)
    this.hud.loadSolutionText(this.level.rowSolution, this.level.colSolution)
    this.level.checkSolution(false)
    this.history = { player: [] }
    this._time = 0
    this.physics.world.fixedDelta = true

    this.anims.create({
      key: `idle`,
      repeat: -1,
      frames: [{ key: 'tilemap', frame: '0' }],
    })

    this.anims.create({
      key: `walk`,
      frames: [
        { key: 'tilemap', frame: '1' },
        { key: 'tilemap', frame: '2' },
        { key: 'tilemap', frame: '3' },
        { key: 'tilemap', frame: '4' },
        { key: 'tilemap', frame: '5' },
        { key: 'tilemap', frame: '3' },
      ],
    })

    this.anims.create({
      key: `climb`,
      frames: [
        { key: 'tilemap', frame: '8' },
        { key: 'tilemap', frame: '9' },
        { key: 'tilemap', frame: '10' },
        { key: 'tilemap', frame: '11' },
        { key: 'tilemap', frame: '12' },
        { key: 'tilemap', frame: '11' },
        { key: 'tilemap', frame: '10' },
        { key: 'tilemap', frame: '9' },
      ],
    })

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'tilemap', frame: '1' }],
    })
  }

  startLevel(name) {
    this.level.start(name)
  }

  restartLevel() {
    this.scene.start('Game', { level: this.levelKey })
  }

  nextLevel() {
    const level = this.levelKey + 1
    if (level <= window.NUM_LEVELS) {
      this.scene.start('Game', { level })
    } else {
      this.scene.start('Menu')
    }
  }
  prevLevel() {
    const level = this.levelKey - 1
    if (level > 0) {
      this.scene.start('Game', { level })
    } else {
      this.scene.start('Menu')
    }
  }

  playSound(key, _rate = [8, 10], opts = {}) {
    const rate = Phaser.Math.RND.between(..._rate) / 10
    this.sound.play(key, { rate, ...opts })
  }

  update(time, delta) {
    this._time = Math.max(0, this._time + delta)
    this.behavior.preUpdate()
    this.behavior.update()
    this.level.update(time, delta)
  }
}
