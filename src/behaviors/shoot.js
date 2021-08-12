export const SHOOT = {
  options: {
    poolSize: 10,
    delay: 200,
  },

  $create: function (ent, opts) {
    ent.inventory = []
    const ground = ent.scene.level.groundLayer

    ent.canShoot = true
    ent.invGraphics = ent.scene.add.graphics()
    ent.invGraphics.fillStyle(0xffffff, 1)

    ent.updateInventory = () => {
      ent.invGraphics.clear()
      ent.inventory.forEach((a, i) => {
        ent.invGraphics.fillStyle(0xffffff, 1)
        ent.invGraphics.fillRect(i * 2, 0, 1, 1)
      })
    }
    ent.updateInventory()

    ent.setInventory = (items) => {
      ent.inventory = items
      ent.updateInventory()
    }

    ent.shoot = () => {
      if (!ent.canShoot || ent.inventory.length > 2) return
      ent.canShoot = false
      ent.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (ent.canShoot = true),
      })
      const tX = ent.x + (ent.flipX ? -8 : 8)
      const tY = ent.y + 8
      const tile = ground.getTileAtWorldXY(tX, tY)?.index
      ground.putTileAtWorldXY(-1, tX, tY)

      ent.inventory.push(tile)
      ent.updateInventory()

      ent.scene.level.checkSolution()
      ent.scene.playSound('shoot', [8, 10])
    }

    ent.place = () => {
      if (!ent.canShoot || ent.inventory.length === 0) return
      const tX = ent.x + (ent.flipX ? -8 : 8)
      const tY = ent.y + 8
      const tile = ground.getTileAtWorldXY(tX, tY)?.index
      if (tile === ent.inventory[0]) return

      ent.canShoot = false
      ent.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (ent.canShoot = true),
      })
      const block = ent.inventory.shift()
      ent.updateInventory()
      ground.putTileAtWorldXY(block, tX, tY, true)

      ent.scene.level.checkSolution()
      ent.scene.playSound('shoot', [8, 10])
    }
  },

  update(ent) {
    ent.invGraphics.setPosition(ent.x + (ent.flipX ? -3 : 0), ent.y - 6)
  },
}
