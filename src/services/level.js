import { groupBy } from 'lodash'
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
    this.width = this.map.widthInPixels
    this.height = this.map.heightInPixels
    scene.physics.world.bounds.width = this.width
    scene.physics.world.bounds.height = this.height
    this.scene.cameras.main.setBounds(0, 0, this.width, this.height)

    // load ground
    const groundTiles = this.map.addTilesetImage('tilemap')
    this.groundLayer = this.map.createLayer('World', groundTiles, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])
    this.groundLayer.layer.data.forEach(function (row) {
      row.forEach(function (tile) {
        if (tile.index === 25) {
          tile.collideDown = false
        }
      })
    })

    // load solution
    this.numLayer = this.map.getObjectLayer('Solution')
    const def = { data: [] }
    const solution = this.numLayer.objects.map((o) => ({
      x: o.x / 8,
      y: o.y / 8,
      data: o.properties[0].value.split(' ').map((n) => +n),
    }))

    this.colSolution = new Array(this.map.width)
      .fill('')
      .map((n, i) =>
        (solution.find((d) => d.x === i && d.y === 0) || def).data.filter(
          (n) => n > 0,
        ),
      )
    this.rowSolution = new Array(this.map.height)
      .fill('')
      .map((n, i) =>
        (solution.find((d) => d.x === -1 && d.y === i + 1) || def).data.filter(
          (n) => n > 0,
        ),
      )

    // load objects
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
        this.playerGroup.add(this.player)
        const inventory =
          object.properties
            .find((p) => p.name === 'inventory')
            ?.value.split(' ')
            .map((n) => +n) || []

        this.player.setInventory(inventory)
      } else if (object.type === 'enemy-spawn') {
        this.spawners.push(object)
      } else if (object.type === 'coin' || object.type === 'upgrade') {
        this.coins.add(new ObjectSprite(scene, object))
      } else if (object.type === 'trigger') {
        this.triggers.add(new Trigger(scene, object))
      } else if (object.type === 'exit') {
        this.exits.add(new Exit(scene, object))
      } else if (object.type === 'ladder') {
        this.ladders.add(new Ladder(scene, object))
      }
    })

    // init colliders
    this.playerCollider = scene.physics.add.collider(
      this.player,
      this.groundLayer,
      (player, tile) => {
        player.body.setAllowGravity(true)

        if (tile.index === 25) {
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
  }

  checkSolution() {
    const cols = this.checkAxis('x')
    const rows = this.checkAxis('y')

    const solvedCols = cols.map(
      (col, i) => col.join(' ') === this.colSolution[i].join(' '),
    )
    const solvedRows = rows.map(
      (row, i) => row.join(' ') === this.rowSolution[i].join(' '),
    )

    if (solvedCols.every((b) => !!b) && solvedRows.every((b) => !!b)) {
      this.exits.children.entries.forEach((e) => e.activate())
    }

    this.scene.hud.updateSolutionText(solvedRows, solvedCols)
  }

  checkAxis(direction) {
    const data = this.groundLayer.layer.data
      .flat()
      .map((d) => ({ x: d.x, y: d.y, index: d.index }))
    const axis = Object.values(groupBy(data, (d) => d[direction])).map((col) =>
      col.map((c) => c.index),
    )
    let result = []
    axis.forEach((line, i) => {
      result[i] = [0]
      line.forEach((item) => {
        if (item === 17) result[i][result[i].length - 1]++
        else result[i].push(0)
      })
      result[i] = result[i].filter((n) => n > 0)
    })
    return result
  }

  update() {}
}
