window.NUM_LEVELS = 15
export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()
    const { width, height } = this.sys.game.config

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(0, 0, width * value, height)
    })

    for (let i = 1; i <= window.NUM_LEVELS; i++) {
      this.load.tilemapTiledJSON(`map${i}`, `assets/maps/map${i}.json`)
    }

    this.load.audio('music1', 'assets/audio/menu-music.mp3')
    this.load.audio('music2', 'assets/audio/game-music1.mp3')
    this.load.audio('music3', 'assets/audio/game-music2.mp3')

    this.load.audio('unwin', 'assets/audio/unwin.mp3', { instances: 1 })
    this.load.audio('win', 'assets/audio/win.mp3', { instances: 1 })
    this.load.audio('complete', 'assets/audio/complete.mp3', { instances: 1 })
    this.load.audio('blocked', 'assets/audio/blocked.mp3', { instances: 3 })
    this.load.audio('walk', 'assets/audio/walk.mp3', { instances: 3 })
    this.load.audio('shoot', 'assets/audio/shoot.mp3', { instances: 3 })
    this.load.audio('put', 'assets/audio/put.mp3', { instances: 3 })
    this.load.audio('jump', 'assets/audio/jump.mp3', { instances: 1 })
    this.load.audio('swap', 'assets/audio/swap.mp3', { instances: 1 })

    this.load.image('background', 'assets/images/background.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.spritesheet('tilemap', 'assets/images/tilemap.png', {
      frameWidth: 8,
      frameHeight: 8,
    })

    this.load.bitmapFont(
      'pixel-dan',
      'assets/pixel-dan.png',
      'assets/pixel-dan.xml',
    )

    this.load.on('complete', () => {
      progress.destroy()
      window.musicKey = 0
      const playNext = () => {
        window.musicKey++
        if (musicKey > 3) musicKey = 1
        window.music = this.sound.add(`music${window.musicKey}`, {
          volume: 0.5,
        })
        window.music.play()
        window.music.once('complete', playNext)
      }
      playNext()

      // this.scene.start('Game')
      this.scene.start('Menu')
    })
  }
}
