import { Player } from '../sprites/Player'
import { ObjectSprite } from '../sprites/Object'
import { Exit } from '../sprites/Exit'
import { Ladder } from '../sprites/Ladder'
import { Trigger } from '../sprites/Trigger'

export default class LevelService {
  constructor(scene) {
    this.scene = scene
  }

  start(key) {
    const scene = this.scene
    this.map = scene.make.tilemap({ key })
    const groundTiles = this.map.addTilesetImage('tilemap')
    this.groundLayer = this.map.createLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])
    this.groundLayer.layer.data.forEach(function (row) {
      row.forEach(function (tile) {
        if (tile.index === 3) {
          tile.collideDown = false
          tile.collideRight = false
          tile.collideLeft = false
        }
      })
    })

    this.playerGroup = scene.add.group()
    this.coins = scene.physics.add.group({ allowGravity: false })
    this.ladders = scene.physics.add.group()
    this.triggers = scene.physics.add.group({ allowGravity: false })
    this.exits = scene.physics.add.group({ allowGravity: false })
    this.spawners = []

    this.objLayer = this.map.getObjectLayer('Objects')
    this.objLayer.objects.forEach((object) => {
      if (object.type === 'spawn') {
        this.player = new Player(scene, object.x, object.y)
      }
      if (object.type === 'enemy-spawn') {
        this.spawners.push(object)
      }

      if (object.type === 'coin' || object.type === 'upgrade') {
        this.coins.add(new ObjectSprite(scene, object))
      }

      if (object.type === 'trigger') {
        this.triggers.add(new Trigger(scene, object))
      }

      if (object.type === 'exit') {
        this.exits.add(new Exit(scene, object))
      }

      if (object.type === 'ladder') {
        this.ladders.add(new Ladder(scene, object))
      }
    })

    this.playerGroup.add(this.player)

    this.width = this.map.widthInPixels
    this.height = this.map.heightInPixels

    scene.physics.world.bounds.width = this.width
    scene.physics.world.bounds.height = this.height
    this.playerCollider = scene.physics.add.collider(
      this.player,
      this.groundLayer,
      (player, tile) => {
        if (tile.index === 3) {
          player.canFall = true
        } else {
          player.canFall = false
        }
      },
    )
    scene.physics.add.overlap(
      this.playerGroup,
      [this.coins, this.triggers, this.exits],
      (player, object) => {
        object.overlap(player, () => {})
      },
    )
    this.scene.cameras.main.setBounds(0, 0, this.width, this.height)
  }

  update() {}
}
