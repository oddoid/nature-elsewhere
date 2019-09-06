import {Aseprite} from './aseprite'
import {Atlas} from './atlas'
import {Rect} from '../math/rect'
import {WH} from '../math/wh'
import {XY} from '../math/xy'

export namespace AtlasParser {
  export const parse = ({meta, frames}: Aseprite.File): Atlas => {
    const {frameTags, slices} = meta
    return frameTags.reduce(
      (sum, val) => ({...sum, [val.name]: parseAnimation(val, frames, slices)}),
      {}
    )
  }

  export function parseAnimation(
    frameTag: Aseprite.FrameTag,
    frames: Aseprite.FrameMap,
    slices: readonly Aseprite.Slice[]
  ): Atlas.Animation {
    const cels = tagFrames(frameTag, frames).map((frame, i) =>
      parseCel(frameTag, frame, i, slices)
    )

    let duration = cels.reduce((sum, {duration}) => sum + duration, 0)
    const pingPong =
      frameTag.direction === Aseprite.AnimationDirection.PING_PONG
    if (pingPong && cels.length > 2)
      duration += duration - (cels[0].duration + cels[cels.length - 1].duration)

    const size = frames[`${frameTag.name} ${frameTag.from}`].sourceSize
    const direction = parseAnimationDirection(frameTag)
    return {...size, cels, duration, direction}
  }

  function tagFrames(
    {name, from, to}: Aseprite.FrameTag,
    frames: Aseprite.FrameMap
  ): readonly Aseprite.Frame[] {
    const ret = []
    for (; from <= to; ++from) ret.push(frames[`${name} ${from}`])
    return ret
  }

  export function parseAnimationDirection({
    direction
  }: Aseprite.FrameTag): Atlas.AnimationDirection {
    if (isAnimationDirection(direction)) return direction
    throw new Error(`"${direction}" is not a Direction.`)
  }

  export function isAnimationDirection(
    val: string
  ): val is Atlas.AnimationDirection {
    const cast = <Atlas.AnimationDirection>val
    return Object.values(Atlas.AnimationDirection).includes(cast)
  }

  export function parseCel(
    frameTag: Aseprite.FrameTag,
    frame: Aseprite.Frame,
    frameNumber: number,
    slices: readonly Aseprite.Slice[]
  ): Atlas.Cel {
    const duration = parseDuration(frame.duration)
    const collisions = parseCollisions(frameTag, frameNumber, slices)
    return {...parsePosition(frame), duration, collisions}
  }

  export function parsePosition(frame: Aseprite.Frame): XY {
    const padding = parsePadding(frame)
    return {x: frame.frame.x + padding.w / 2, y: frame.frame.y + padding.h / 2}
  }

  export function parsePadding({frame, sourceSize}: Aseprite.Frame): WH {
    return {w: frame.w - sourceSize.w, h: frame.h - sourceSize.h}
  }

  export function parseDuration(duration: Aseprite.Duration): number {
    const infinite = duration === Aseprite.INFINITE_DURATION
    return infinite ? Number.POSITIVE_INFINITY : duration
  }

  export function parseCollisions(
    {name}: Aseprite.FrameTag,
    index: number,
    slices: readonly Aseprite.Slice[]
  ): readonly Rect[] {
    // Filter out Slices not for this Tag.
    slices = slices.filter(slice => slice.name === name)
    return slices // For each Slice, get the greatest relevant Key.
      .map(({keys}) => keys.filter(key => key.frame <= index).slice(-1)[0])
      .map(({bounds}) => bounds)
  }
}
