export const SHOOT = {
  options: {
    poolSize: 10,
    delay: 200,
  },

  $create: function (entity, opts) {
    entity.canShoot = true
    entity.gun = entity.scene.add
      .image(entity.x, entity.y, 'tilemap', 52)
      .setDepth(99)

    entity.shoot = () => {
      if (!entity.canShoot) return
      entity.canShoot = false
      entity.scene.time.addEvent({
        delay: opts.delay,
        callback: () => (entity.canShoot = true),
      })
      // tile.layer.tilemapLayer.removeTileAt(tile.x, tile.y)

      entity.scene.playSound('shoot', [8, 10])
    }
  },

  update(entity) {
    entity.gun.setPosition(entity.x + (entity.flipX ? -5 : 5), entity.y + 3)
    entity.gun.flipX = entity.flipX
  },
}
