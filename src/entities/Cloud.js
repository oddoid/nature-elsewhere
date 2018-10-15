import * as animation from './animation.js'
import * as entity from './entity.js'

export default class Cloud extends entity.State {
  /**
   * @arg {animation.ID} animationID
   * @arg {XY} position
   * @arg {XY} [speed]
   */
  constructor(animationID, position, speed) {
    super(
      position,
      animationID,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  }

  /** @return {entity.DrawOrder} */
  get drawOrder() {
    return entity.DrawOrder.CLOUDS
  }
}
