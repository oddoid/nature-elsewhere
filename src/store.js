import * as recorder from './inputs/recorder.js'
import * as shader from './graphics/shader.js'
import * as util from './util.js'
import {Animatable} from './textures/animatable.js'
import {Entity} from './entities/entity.js'

/** @typedef {import('./textures/atlas.js').Atlas} Atlas} */

export class Store {
  constructor() {
    /** @prop {Int16Array} */ this._memory = new Int16Array()
    /** @prop {ReadonlyArray<Entity | EntityGroup>} */ this._entities = /** @type {(Animatable | Entity)[]} */ ([])
  }

  /** @return {Int16Array} */
  getMemory() {
    return this._memory
  }

  /** @return {number} */
  getLength() {
    return this._entities.reduce(
      (sum, val) =>
        sum + (val instanceof Entity ? val.getAnimatables().length : 1),
      0
    )
  }

  /**
   * @arg {ReadonlyArray<Animatable | Entity>} entities
   * @return {void}
   */
  spawn(entities) {
    entities.forEach(entity => {
      let index = this._entities.findIndex(
        val => entity.getDrawOrder() <= val.getDrawOrder()
      )
      this._entities.splice(
        index === -1 ? this._entities.length : index,
        0,
        entity
      )
    })
  }

  /**
   * @arg {number} step
   * @arg {Atlas} atlas
   * @arg {recorder.ReadState} recorder
   * @return {void}
   */
  step(step, atlas, recorder) {
    this._entities.forEach(entity => {
      if (entity instanceof Entity) {
        entity.step(step, atlas, recorder)
      } else {
        entity.step(step, atlas.animations[entity.getAnimationID()], recorder)
      }
    })
  }

  /** @return {void} */
  flushUpdatesToMemory() {
    /** @type {ReadonlyArray<Animatable>} */ const entities = this._entities
      .map(
        entity => (entity instanceof Entity ? entity.getAnimatables() : entity)
      )
      .reduce(util.flatten, [])
    const minMemory = entities.length * shader.layout.perInstance.length
    if (this._memory.length < minMemory) {
      this._memory = new Int16Array(minMemory * 2)
    }
    entities.forEach((entity, i) => {
      const coord = entity.getBounds()
      // prettier-ignore
      this._memory.set([coord.x, coord.y, coord.w, coord.h,
                        entity._scrollPosition.x, entity._scrollPosition.y,
                        entity._position.x, entity._position.y,
                        entity._scale.x, entity._scale.y],
                        i * shader.layout.perInstance.length)
    })
  }
}
