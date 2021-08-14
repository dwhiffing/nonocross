import { groupBy } from 'lodash'
import { Player } from '../sprites/Player'
import { Exit } from '../sprites/Exit'
import { Ladder } from '../sprites/Ladder'

export default class LevelService {
  constructor(scene) {
    this.scene = scene
  }

  start(key) {
    const scene = this.scene
    this.key = key
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
    const def = { data: [0] }
    const solution = this.numLayer.objects.map((o) => ({
      x: o.x / 8,
      y: o.y / 8,
      data: o.properties[0].value.split(' ').map((n) => +n),
    }))

    this.colSolution = new Array(this.map.width)
      .fill('')
      .map((n, i) => (solution.find((d) => d.x === i && d.y === 0) || def).data)
    this.rowSolution = new Array(this.map.height)
      .fill('')
      .map(
        (n, i) =>
          (solution.find((d) => d.x === -1 && d.y === i + 1) || def).data,
      )

    // load objects
    this.playerGroup = scene.add.group()
    this.ladders = scene.physics.add.group()
    this.exits = scene.physics.add.group({ allowGravity: false })

    this.objLayer = this.map.getObjectLayer('Objects')
    this.objLayer.objects.forEach((object) => {
      if (object.type === 'spawn') {
        this.player = new Player(scene, object.x, object.y)
        this.playerGroup.add(this.player)
        const startingInv =
          Number(
            object.properties.find((p) => p.name === 'inventory')?.value,
          ) || 0
        const inventory = new Array(startingInv).fill('').map(() => 17)

        this.player.setInventory(inventory)
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
      [this.exits],
      (player, object) => {
        object.overlap(player, () => {})
      },
    )
  }

  checkSolution(playSound) {
    const cols = this.checkAxis('x')
    const rows = this.checkAxis('y')

    const solvedCols = this.colSolution.map((col, i) =>
      col.map((ci, j) => ci === cols[i][j]),
    )
    const solvedRows = this.rowSolution.map((row, i) =>
      row.map((ri, j) => ri === rows[i][j]),
    )

    const isSolved =
      solvedCols.every((col) => col.every((ci) => !!ci)) &&
      solvedRows.every((row) => row.every((ri) => !!ri))
    this.exits.children.entries.forEach((e) => e.toggle(isSolved, playSound))

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
      if (result[i].every((r) => r === 0)) result[i] = [0]
      else result[i] = result[i].filter((r) => r > 0)
    })
    return result
  }

  update() {}
}
