export const SHOOT = {
  options: {
    poolSize: 10,
    delay: 200,
  },

  $create: function (ent, opts) {
    ent.inventory = []
    const ground = ent.scene.level.groundLayer

    ent.canShoot = true
    ent.invGraphics = ent.scene.add.graphics().setDepth(99)
    ent.invGraphics.fillStyle(0xffffff, 1)

    ent.updateInventory = () => {
      ent.invGraphics.clear()
      ent.inventory.forEach((a, i) => {
        ent.invGraphics.fillStyle(0xffffff, 1)
        ent.invGraphics.fillRect(0, i * -2, 1, 1)
      })
    }
    ent.updateInventory()

    ent.setInventory = (items) => {
      ent.inventory = items
      ent.updateInventory()
    }

    ent.getTargetTile = () => {
      const x = ent.x + (ent.flipX ? -9 : 8)
      const y = ent.y + 8
      return { x, y }
    }

    ent.cursor = ent.scene.add.sprite(0, 0, 'tilemap', 32).setOrigin(0, 0)

    ent.shoot = () => {
      if (!ent.canShoot || ent.inventory.length > 2) return

      const target = ent.getTargetTile()
      const tile = ground.getTileAtWorldXY(target.x, target.y)?.index
      if (!tile) return

      ent.canShoot = false
      ent.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (ent.canShoot = true),
      })
      ground.putTileAtWorldXY(-1, target.x, target.y)

      ent.inventory.push(tile)
      ent.updateInventory()

      ent.scene.level.checkSolution()
      ent.scene.playSound('shoot', [8, 10])
    }

    ent.place = () => {
      if (!ent.canShoot || ent.inventory.length === 0) return
      const target = ent.getTargetTile()
      const tile = ground.getTileAtWorldXY(target.x, target.y)?.index
      if (tile === ent.inventory[0]) return

      ent.canShoot = false
      ent.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (ent.canShoot = true),
      })
      const block = ent.inventory.shift()
      ent.updateInventory()
      ground.putTileAtWorldXY(block, target.x, target.y, true)

      ent.scene.level.checkSolution()
      ent.scene.playSound('shoot', [8, 10])
    }
  },

  update(ent) {
    ent.invGraphics.setPosition(
      Math.floor(ent.x) + (ent.flipX ? -1 : 1),
      Math.floor(ent.y) - 7,
    )
    const target = ent.getTargetTile()
    ent.cursor.setPosition(
      Math.floor(target.x / 8) * 8,
      Math.floor(target.y / 8) * 8,
    )
    ent.cursor.setAlpha(1)
    ent.invGraphics.setAlpha(ent.onLadder ? 0 : 1)
  },
}
