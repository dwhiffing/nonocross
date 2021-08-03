export const WALK = {
  options: {
    sound: true,
    emitter: true,
  },

  $create: function (entity, opts) {
    const playWalkSound = () => {
      if (!opts.sound) return
      entity.scene.playSound('hit2', [3, 6], { volume: 0.2 })
    }

    if (opts.emitter)
      entity.walkEmitter = entity.scene.particles
        .createEmitter(WALK_PARTICLE_CONFIG)
        .stop()

    entity.walk = (isLeft) => {
      if (entity.tintFill || !entity.body.onFloor()) return

      entity.flipX = isLeft
      const speed = 30
      entity.body.velocity.x = isLeft ? -speed : speed
      entity.body.x = Math.round((entity.body.x + Number.EPSILON) * 100) / 100

      if (!entity.body?.onFloor()) {
        entity.walkEmitter?.stop()
        entity.walkSoundCallback?.remove()
        entity.walkSoundCallback = null
        return
      }

      if (entity.anims?.currentAnim?.key !== 'walk') {
        entity.play({ key: 'walk', frameRate: 8, repeat: -1 })
      }

      if (!entity.walkEmitter?.on) entity.walkEmitter?.flow(300)

      if (!entity.walkSoundCallback)
        entity.walkSoundCallback = entity.scene.time.addEvent({
          delay: 380,
          repeat: -1,
          callback: playWalkSound,
        })
    }

    entity.stop = () => {
      if (entity.tintFill || !entity.body?.onFloor()) return

      entity.body.velocity.x = 0
      entity.walkEmitter?.stop()
      entity.walkSoundCallback?.remove()
      entity.walkSoundCallback = null
      entity.play({ key: 'idle' })
    }
  },

  update(entity, time, delta) {
    if (!entity.scene) return
    const { x, y, flipX } = entity

    entity.walkEmitter?.setPosition(x + (flipX ? 2 : -2), y + 3)

    if (!entity.body?.onFloor() && entity.walkEmitter?.on)
      entity.walkEmitter?.stop()

    const { left, right } = entity.scene.inputService.direction
    if (left || right) {
      entity.setOffset(left ? 2 : 3, 0)
      entity.walk(left)
    } else {
      entity.stop()
    }
  },
}

const WALK_PARTICLE_CONFIG = {
  frame: 16,
  x: 0,
  y: 0,
  lifespan: { min: 400, max: 800 },
  speedX: { min: -10, max: 10 },
  speedY: { min: -10, max: -2 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -3,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.3, end: 0 },
  quantity: 1,
}
