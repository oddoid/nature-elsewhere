import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {NumberUtil} from '../math/NumberUtil'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Rect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../math/XY'
import {WH} from '../math/WH'

export class Backpacker extends Entity<Backpacker.Variant, Backpacker.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Backpacker.Variant.NONE, Backpacker.State>,
    // This reference is passed to all images so that any changes affect all
    // character images for all states. This orchestration could probably be
    // handled better, possibly with some new state or some way of generating
    // states on the fly, but it's unclear how to change the current system
    // without invalidating a lot of the encapsulation it provides.
    private readonly _size: WH = new WH(9, 16)
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Backpacker.State.IDLE_UP]: newImageRect(
          atlas,
          AtlasID.BACKPACKER_IDLE_UP,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.IDLE_RIGHT]: newImageRect(
          atlas,
          AtlasID.BACKPACKER_IDLE_RIGHT,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.IDLE_DOWN]: newImageRect(
          atlas,
          AtlasID.BACKPACKER_IDLE_DOWN,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_UP]: newImageRect(
          atlas,
          AtlasID.BACKPACKER_WALK_UP,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_RIGHT]: newImageRect(
          atlas,
          AtlasID.BACKPACKER_WALK_RIGHT,
          AtlasID.BACKPACKER_WALK_RIGHT_SHADOW,
          _size
        ),
        [Backpacker.State.WALK_DOWN]: newImageRect(
          atlas,
          AtlasID.BACKPACKER_WALK_DOWN,
          AtlasID.BACKPACKER_WALK_VERTICAL_SHADOW,
          _size
        )
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const objective = this._computeObjective(state)

    const {x, y} = this.bounds.position
    const left = objective.x < x
    const right = objective.x > x
    const up = objective.y < y
    const down = objective.y > y

    this.velocity.x = (left ? -1 : right ? 1 : 0) * 80 // (In one ten-thousandth of a pixel per millisecond (.1 px / s).)
    this.velocity.y = (up ? -1 : down ? 1 : 0) * 80
    const stopped = !this.velocity.x && !this.velocity.y

    let nextState = this.state()
    if (stopped) {
      nextState = idleStateFor[this.state()]
      hideDestinationMarker(state)
    } else {
      // If already in a horizontal state and further horizontal movement is
      // needed, allow the horizontal state to persist. Otherwise, require some
      // distance to transition. This prevents rapidly oscillating between
      // horizontal and vertical states when on a diagonal boundary.
      const distance = objective.sub(this.bounds.position).abs()
      const horizontalStatePreferred =
        distance.x &&
        (this.state() === Backpacker.State.WALK_RIGHT || distance.x > 3)

      if ((left || right) && ((!up && !down) || horizontalStatePreferred))
        nextState = Backpacker.State.WALK_RIGHT
      else if (down) nextState = Backpacker.State.WALK_DOWN
      else if (up) nextState = Backpacker.State.WALK_UP

      const scale = this.scale().copy()
      if (left && ((!up && !down) || horizontalStatePreferred))
        scale.x = -1 * Math.abs(scale.x)
      else if (up || down || right) scale.x = Math.abs(scale.x)
      status |= this.scaleTo(scale)
    }

    status |= this.transition(nextState)

    return status
  }

  collides(entities: readonly Entity[], state: UpdateState): void {
    super.collides(entities, state)
    const collisionType = entities.reduce(
      (type, entity) => type | entity.collisionType,
      CollisionType.INERT
    )
    {
      if (collisionType & CollisionType.OBSTACLE) {
        const idle = idleStateFor[this.state()]
        if (!state.inputs.pick || !state.inputs.pick.active) {
          this.transition(idle)
          hideDestinationMarker(state)
        }
      }
    }

    this._submerge(!!(collisionType & CollisionType.DEEP_WATER))
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }

  private _submerge(submerge: boolean): void {
    this._size.h = 16 - (submerge ? 3 : 0)
  }

  private _computeObjective(state: UpdateState): XY {
    const {destination} = state.level

    if (!destination || destination.state() === Entity.BaseState.HIDDEN)
      return this.bounds.position.copy()

    const {x, y} = destination.bounds.position.add(this.origin())
    const objective = new XY(
      NumberUtil.clamp(x, 0, state.level.size.w - this.bounds.size.w),
      NumberUtil.clamp(y, 0, state.level.size.h - this.bounds.size.h)
    )

    // If not already moving, don't pursue objectives practically underfoot.
    const stopped = !this.velocity.x && !this.velocity.y
    if (stopped && objective.sub(this.bounds.position).magnitude() < 4)
      return this.bounds.position.copy()

    return objective
  }
}

export namespace Backpacker {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    IDLE_UP = 'idleUp',
    IDLE_RIGHT = 'idleRight',
    IDLE_DOWN = 'idleDown',
    WALK_UP = 'walkUp',
    WALK_RIGHT = 'walkRight',
    WALK_DOWN = 'walkDown'
  }
}

function newImageRect(
  atlas: Atlas,
  character: AtlasID,
  shadow: AtlasID,
  size: WH
): ImageRect {
  return new ImageRect({
    origin: new XY(-2, -13),
    images: [
      new Image(atlas, {id: character, size}),
      new Image(atlas, {id: shadow, size, layer: Layer.SHADOW})
    ]
  })
}

function hideDestinationMarker(state: UpdateState): void {
  if (state.level.destination)
    state.level.destination.transition(Entity.BaseState.HIDDEN)
}

/** A mapping of the current state to the appropriate idle state. For example,
    if the backpacker is walking right then stops, the idle right animation is
    mapped. If the backpacker is walking down then stops, the idle down
    animation is mapped. */
const idleStateFor: Readonly<Record<
  Backpacker.State | Entity.BaseState,
  Backpacker.State | Entity.BaseState
>> = Object.freeze({
  [Entity.BaseState.HIDDEN]: Entity.BaseState.HIDDEN,
  [Backpacker.State.IDLE_UP]: Backpacker.State.IDLE_UP,
  [Backpacker.State.IDLE_RIGHT]: Backpacker.State.IDLE_RIGHT,
  [Backpacker.State.IDLE_DOWN]: Backpacker.State.IDLE_DOWN,
  [Backpacker.State.WALK_UP]: Backpacker.State.IDLE_UP,
  [Backpacker.State.WALK_RIGHT]: Backpacker.State.IDLE_RIGHT,
  [Backpacker.State.WALK_DOWN]: Backpacker.State.IDLE_DOWN
})

const defaults = ObjectUtil.freeze({
  type: EntityType.BACKPACKER,
  state: Backpacker.State.IDLE_DOWN,
  variant: Backpacker.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType:
    CollisionType.TYPE_CHARACTER |
    CollisionType.TYPE_BACKPACKER |
    CollisionType.HARMFUL |
    CollisionType.IMPEDIMENT,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(2, 12, 4, 3)]
})
