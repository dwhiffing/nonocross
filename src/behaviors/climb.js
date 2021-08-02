const speed = 20

export const CLIMB = {
  options: {},

  $create: function (entity, opts) {
    entity.climb = (isUp) => {
      // line up player with ladder
      entity.body.velocity.x = 0
      entity.x = Math.floor(entity.x / 8) * 8 + entity.flipX ? 5 : 3
      entity.body.setAllowGravity(false)

      // play/resume climb animation
      if (entity.anims?.currentAnim?.key !== 'climb') {
        entity.play({ key: 'climb', repeat: -1, frameRate: 8 })
      }
      entity.scene.anims.get('climb').paused = false

      entity.body.velocity.y = isUp ? -speed : speed
    }
  },

  update(entity) {
    if (!entity.scene) return

    entity.onLadder = false
    entity.scene.physics.overlap(entity, entity.scene.level.ladders, () => {
      entity.onLadder = true
    })

    if (!entity.onLadder) {
      entity.body.setAllowGravity(true)
      return
    }
    if (!entity.body.onFloor()) entity.body.setAllowGravity(false)

    const { up, down } = entity.scene.inputService.direction
    if (up || down) {
      entity.climb(up)
    } else {
      entity.body.setVelocityY(0)
      entity.scene.anims.get('climb').paused = true
    }
  },
}
