import {WH} from './wh'
import {XY} from './xy'

/** Where XY describes the upper-left corner, or minimum, and XY + WH the
    bottom-right, or maximum. */
export type Rect = WH & XY
type t = Rect

export namespace Rect {
  export const add = (lhs: t, rhs: t): t => ({
    ...XY.add(lhs, rhs),
    ...WH.add(lhs, rhs)
  })

  export const moveBy = ({w, h, ...xy}: t, by: XY): t => ({
    ...XY.add(xy, by),
    w,
    h
  })

  /** @return True if lhs and rhs are overlapping, false if touching or
      independent. */
  export const intersects = ({x, y, w, h}: t, rhs: t): boolean =>
    x + w > rhs.x && x < rhs.x + rhs.w && y + h > rhs.y && y < rhs.y + rhs.h

  export const within = ({x, y, w, h}: t, rhs: t): boolean =>
    x >= rhs.x && x + w <= rhs.x + rhs.w && y >= rhs.y && y + h <= rhs.y + rhs.h

  /** @return Width and / or height is less than zero if no intersection, equal
              to zero if touching but not overlapping, or greater than zero if
              overlapping. */
  export const intersection = (lhs: t, rhs: t): t => {
    // The bottom-rightmost coordinates is the upper-left of the intersection.
    const upperLeft = XY.max(lhs, rhs)
    const w = Math.min(lhs.x + lhs.w, rhs.x + rhs.w) - upperLeft.x
    const h = Math.min(lhs.y + lhs.h, rhs.y + rhs.h) - upperLeft.y
    return {x: upperLeft.x, y: upperLeft.y, w, h}
  }

  /** The union or bounds of an array of Rects may be computed thus:
      `rects.reduce(Rect.union)`. */
  export const union = (lhs: t, rhs: t): t => {
    const {x, y} = XY.min(lhs, rhs)
    const w = Math.max(lhs.x + lhs.w, rhs.x + rhs.w) - x
    const h = Math.max(lhs.y + lhs.h, rhs.y + rhs.h) - y
    return {x, y, w, h}
  }
}
