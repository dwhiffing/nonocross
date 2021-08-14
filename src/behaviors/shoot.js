// TODO: need the player to be able to aim by holding down the button, pressing a combo of directions and releasing
export const SHOOT = {
  options: {
    poolSize: 10,
    delay: 200,
    maxSize: 8,
  },

  $create: function (ent, opts) {
    ent.inventory = []
    const ground = ent.scene.level.groundLayer
    const object = ent.scene.level.objLayer

    ent.canShoot = true
    ent.invGraphics = ent.scene.add.graphics().setDepth(99)
    ent.invGraphics.fillStyle(0xa6ca38, 1)

    ent.updateInventory = () => {
      ent.invGraphics.clear()
      ent.inventory.forEach((a, i) => {
        const color =
          ent.inventory.length === opts.maxSize ? 0xff0000 : 0xa6ca38
        ent.invGraphics.fillStyle(color, 1)
        ent.invGraphics.fillRect(0, i * -2, 1, 1)
      })
    }
    ent.updateInventory()

    ent.setInventory = (items) => {
      ent.inventory = items
      ent.updateInventory()
    }

    ent.getTargetTile = () => {
      const { up, down } = ent.scene?.inputService?.direction || {}
      let y = ent.y
      let x = ent.x + (ent.pointLeft ? -3 : 3)
      if (!up && !down) {
        x = ent.x + (ent.pointLeft ? -8 : 8)
      }
      if (up) y = ent.y - 8
      if (down) y = ent.y + 8
      return { x, y }
    }

    ent.cursor = ent.scene.add.sprite(0, 0, 'tilemap', 32).setOrigin(0, 0)

    ent.shoot = () => {
      if (!ent.canShoot || ent.inventory.length >= opts.maxSize)
        return ent.scene.playSound('blocked', [8, 10])

      const target = ent.getTargetTile()
      const tile = ground.getTileAtWorldXY(target.x, target.y)?.index
      if (!tile || tile !== 17) return ent.scene.playSound('blocked', [8, 10])

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
      if (!ent.canShoot || ent.inventory.length === 0)
        return ent.scene.playSound('blocked', [8, 10])
      const target = ent.getTargetTile()
      const tile = ground.getTileAtWorldXY(target.x, target.y)?.index
      const { width, height } = ent.scene.level
      const tx = Math.floor(target.x / 8) * 8
      const ty = Math.floor(target.y / 8) * 8
      const isLadder = object.objects.some(
        (o) => o.x === tx && o.y - 8 === ty && o.type === 'ladder',
      )
      if (
        tile ||
        target.x > width ||
        target.y > height ||
        target.x < 0 ||
        target.y < 0 ||
        isLadder
      )
        return ent.scene.playSound('blocked', [8, 10])

      ent.canShoot = false
      ent.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (ent.canShoot = true),
      })
      const block = ent.inventory.shift()
      ent.updateInventory()
      ground.putTileAtWorldXY(block, target.x, target.y, true)

      ent.scene.level.checkSolution()
      ent.scene.playSound('put', [8, 10])
    }
  },

  update(ent) {
    ent.invGraphics.setPosition(
      Math.floor(ent.x) + (ent.flipX ? -1 : 1),
      Math.floor(ent.y) - 7,
    )
    // ent.invGraphics.setAlpha(ent.onLadder ? 0 : 1)

    const target = ent.getTargetTile()
    ent.cursor.setPosition(
      Math.floor(target.x / 8) * 8,
      Math.floor(target.y / 8) * 8,
    )
    ent.cursor.setAlpha(1)
  },
}
