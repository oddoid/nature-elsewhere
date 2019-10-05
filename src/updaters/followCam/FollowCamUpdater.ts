import {Entity} from '../../entity/Entity'
import {FollowCam, FollowCamOrientation} from './FollowCam'
import {Rect} from '../../math/Rect'
import {Update} from '../Update'
import {UpdateStatus} from '../updateStatus/UpdateStatus'
import {UpdaterType} from '../updaterType/UpdaterType'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'

export namespace FollowCamUpdater {
  export function is(entity: Entity): entity is FollowCam & Entity {
    return entity.updaters.includes(UpdaterType.UI_FOLLOW_CAM)
  }

  export const update: Update = (entity, state) => {
    if (!is(entity)) throw new Error()
    const to = orientationToXY(
      entity.bounds,
      state.level.cam.bounds,
      entity.camMargin,
      entity.positionRelativeToCam
    )

    if (entity.bounds.position.equal(to)) return UpdateStatus.UNCHANGED

    return entity.moveTo(to)
  }
}

/** In fractional pixel level coordinates. */
function orientationToXY(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCamOrientation
): XY {
  return new XY(
    orientationToX(entity, cam, margin, orientation),
    orientationToY(entity, cam, margin, orientation)
  )
}

function orientationToX(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCamOrientation
): number {
  let x = cam.position.x
  switch (orientation) {
    case FollowCamOrientation.SOUTH_WEST:
    case FollowCamOrientation.WEST:
    case FollowCamOrientation.NORTH_WEST:
      x += margin.w
      break
    case FollowCamOrientation.SOUTH_EAST:
    case FollowCamOrientation.EAST:
    case FollowCamOrientation.NORTH_EAST:
      x += cam.size.w - (entity.size.w + margin.w)
      break
    case FollowCamOrientation.NORTH:
    case FollowCamOrientation.SOUTH:
    case FollowCamOrientation.CENTER:
      x +=
        Math.trunc(cam.size.w / 2) - (Math.trunc(entity.size.w / 2) + margin.w)
      break
  }
  return x
}

function orientationToY(
  entity: Rect,
  cam: Rect,
  margin: WH,
  orientation: FollowCamOrientation
): number {
  let y = cam.position.y
  switch (orientation) {
    case FollowCamOrientation.NORTH:
    case FollowCamOrientation.NORTH_EAST:
    case FollowCamOrientation.NORTH_WEST:
      y += margin.h
      break
    case FollowCamOrientation.SOUTH_EAST:
    case FollowCamOrientation.SOUTH:
    case FollowCamOrientation.SOUTH_WEST:
      y += cam.size.h - (entity.size.h + margin.h)
      break
    case FollowCamOrientation.EAST:
    case FollowCamOrientation.WEST:
    case FollowCamOrientation.CENTER:
      y +=
        Math.trunc(cam.size.h / 2) - (Math.trunc(entity.size.h / 2) + margin.h)
      break
  }
  return y
}