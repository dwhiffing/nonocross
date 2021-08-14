const speed = 13

export const CLIMB = {
  options: {},

  $create: function (entity, opts) {
    entity.climb = (isUp) => {
      // line up player with ladder
      entity.onLadder = true
      entity.body.velocity.x = 0
      entity.x = Math.floor(entity.x / 8) * 8 + (entity.flipX ? 4 : 4)
      entity.body.setAllowGravity(false)

      entity.walkSoundCallback?.remove()
      entity.walkSoundCallback = null

      // play/resume climb animation
      if (entity.anims?.currentAnim?.key !== 'climb') {
        entity.play({ key: 'climb', repeat: -1, frameRate: 8 })
      }
      entity.scene.anims.get('climb').paused = false

      entity?.stop()

      entity.body.velocity.y = isUp ? -speed : speed
    }
  },

  update(entity) {
    if (!entity.scene) return

    if (entity.canClimb) entity.canClimb = false
    entity.scene.physics.overlap(entity, entity.scene.level.ladders, () => {
      entity.canClimb = true
    })

    if (entity.onLadder) entity.body.setVelocityY(0)

    if (entity.canClimb) {
      if (entity.body.onFloor()) {
        entity.onLadder = false
      } else if (entity.onLadder) {
        entity.body.setAllowGravity(false)
      }

      const { up, down } = entity.scene.inputService.direction
      if (up || down) {
        entity.climb(up)
      } else if (entity.onLadder) {
        entity.scene.anims.get('climb').paused = true
      }
    } else {
      entity.onLadder = false
      entity.body.setAllowGravity(true)
    }
  },
}
