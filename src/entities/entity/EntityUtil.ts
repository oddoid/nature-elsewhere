import {Entity} from './Entity'
import {EntityID} from '../entityID/EntityID'
import {EntityState} from '../entityState/EntityState'
import {Image} from '../../images/image/Image'
import {ImageRect} from '../../images/imageRect/ImageRect'
import {Rect} from '../../math/rect/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../../math/xy/XY'
import {UpdateState} from '../updaters/UpdateState'
import {UpdaterMap} from '../updaters/UpdaterMap'
import {Layer} from '../../images/layer/layer'
import {ImageStateMachine} from '../../images/imageStateMachine/ImageStateMachine'
import {AtlasID} from '../../atlas/atlasID/AtlasID'

export namespace EntityUtil {
  export function setColorID(entity: Entity, id: AtlasID): UpdateStatus {
    return ImageStateMachine.setColorID(entity.machine, id)
  }

  /** See Entity.spawnID. */
  export function equal(lhs: Entity, rhs: Entity): boolean {
    return lhs.spawnID === rhs.spawnID
  }

  /** This is a shallow invalidation. If a child changes state, or is added, the
      parents' bounds should be updated. */
  export function invalidateBounds(entity: Entity): void {
    const bounds = Rect.unionAll([
      imageRect(entity).bounds,
      ...entity.collisionBodies,
      ...entity.children.map(child => child.bounds)
    ])
    if (bounds) {
      entity.bounds.position.x = bounds.position.x
      entity.bounds.position.y = bounds.position.y
      entity.bounds.size.w = bounds.size.w
      entity.bounds.size.h = bounds.size.h
    }
  }

  export function moveTo(entity: Entity, to: Readonly<XY>): UpdateStatus {
    return moveBy(entity, XY.sub(to, entity.bounds.position))
  }

  /** Recursively move the entity, its images, its collision bodies, and all of
      its children. */
  export function moveBy(entity: Entity, by: Readonly<XY>): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    if (!by.x && !by.y) return status
    entity.bounds.position.x += by.x
    entity.bounds.position.y += by.y
    status |= ImageRect.moveBy(imageRect(entity), by)
    Rect.moveAllBy(entity.collisionBodies, by)
    for (const child of entity.children) moveBy(child, by)
    return status | UpdateStatus.UPDATED
  }

  export function getScale(entity: Readonly<Entity>): XY {
    return imageRect(entity).scale
  }

  export function setScale(entity: Entity, scale: Readonly<XY>): UpdateStatus {
    const collisionScale =
      getScale(entity).x && getScale(entity).y
        ? XY.div(scale, getScale(entity))
        : undefined
    const status = ImageRect.setScale(imageRect(entity), scale)
    if (collisionScale && status & UpdateStatus.UPDATED) {
      for (const body of entity.collisionBodies) {
        body.size.w *= Math.abs(collisionScale.x)
        body.size.h *= Math.abs(collisionScale.y)
      }
    }
    invalidateBounds(entity)
    return status
  }

  export function imageRect(entity: Readonly<Entity>): ImageRect {
    return ImageStateMachine.imageRect(entity.machine)
  }

  /** Recursively animate the entity and its children. Only visible entities are
      animated so its possible for a composition entity's children to be fully,
      *partly*, or not animated together. */
  export function animate(entity: Entity, state: UpdateState): Image[] {
    if (!Rect.intersects(state.level.cam.bounds, entity.bounds)) return []
    const visible = ImageRect.intersects(
      imageRect(entity),
      state.level.cam.bounds
    )
    for (const image of visible)
      Image.animate(image, state.time, state.level.atlas)
    return [
      ...visible,
      ...entity.children.reduce(
        (images: Image[], child) => [...images, ...animate(child, state)],
        []
      )
    ]
  }

  export function resetAnimation(entity: Entity): void {
    ImageStateMachine.resetAnimation(entity.machine)
  }

  /** Returns whether the current entity is in the viewport or should always be
      updated. Children are not considered. */
  export function active(entity: Readonly<Entity>, viewport: Rect): boolean {
    return (
      entity.updatePredicate === UpdatePredicate.ALWAYS ||
      Rect.intersects(entity.bounds, viewport)
    )
  }

  export function setState(
    entity: Entity,
    state: EntityState | string
  ): UpdateStatus {
    const status = ImageStateMachine.setState(entity.machine, state)
    if (status & UpdateStatus.UPDATED) invalidateBounds(entity)
    return status
  }

  /** See UpdatePredicate. Actually this is going to go ahead and go into children so updte the docs */
  export function update(entity: Entity, state: UpdateState): UpdateStatus {
    if (!active(entity, state.level.cam.bounds)) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED
    for (const updater of entity.updaters) {
      status |= UpdaterMap[updater](entity, state)
      if (UpdateStatus.terminate(status)) return status
    }

    for (const child of entity.children) {
      status |= update(child, state)
      if (UpdateStatus.terminate(status)) return status
    }

    return status
  }

  export function findAny(
    entities: readonly Entity[],
    id: EntityID
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = find(entity, id)
      if (found) return found
    }
    return
  }

  export function find(entity: Entity, id: EntityID): Maybe<Entity> {
    if (entity.id === id) return entity
    for (const child of entity.children) {
      const descendant = find(child, id)
      if (descendant) return descendant
    }
    return
  }

  export function velocity(
    _entity: Entity,
    time: Milliseconds,
    horizontal: boolean,
    vertical: boolean
  ): XY {
    const vx = 90
    const vy = 90
    const x = horizontal
      ? vertical
        ? vx
        : Math.sign(vx) * Math.sqrt(vx * vx + vy * vy)
      : 0
    const y = vertical
      ? horizontal
        ? vy
        : Math.sign(vy) * Math.sqrt(vx * vx + vy * vy)
      : 0
    return {x: (x * time) / 10000, y: (y * time) / 10000}
  }

  /** Raise or lower an entity's images and its descendants' images for all
      states. */
  export function elevate(entity: Entity, offset: Layer): void {
    ImageStateMachine.elevate(entity.machine, offset)
    for (const child of entity.children) elevate(child, offset)
  }
}