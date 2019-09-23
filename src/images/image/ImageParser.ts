import {AnimatorParser} from '../animator/AnimatorParser'
import {Atlas} from '../../atlas/atlas/Atlas'
import {AtlasID} from '../../atlas/atlasID/AtlasID'
import {AtlasIDParser} from '../../atlas/atlasID/AtlasIDParser'
import {DecamillipixelIntXYParser} from '../decamillipixelIntXY/DecamillipixelXYParser'
import {ImageConfig} from './ImageConfig'
import {Image} from './Image'
import {ImageScaleParser} from '../imageScale/ImageScaleParser'
import {LayerParser} from '../layer/LayerParser'
import {Rect} from '../../math/rect/Rect'
import {XYParser} from '../../math/xy/XYParser'

export namespace ImageParser {
  export function parse(config: ImageConfig, atlas: Atlas): Image {
    const id = AtlasIDParser.parse(config.id)
    return {
      id,
      bounds: parseBounds(config, id, atlas),
      layer: LayerParser.parse(config.layer),
      animator: AnimatorParser.parse(config.animator),
      scale: ImageScaleParser.parse(config.scale),
      wrap: DecamillipixelIntXYParser.parse(config.wrap),
      wrapVelocity: DecamillipixelIntXYParser.parse(config.wrapVelocity)
    }
  }
}

function parseBounds(config: ImageConfig, id: AtlasID, atlas: Atlas): Rect {
  const w =
    config.bounds && config.bounds.size && config.bounds.size.w !== undefined
      ? config.bounds.size.w
      : Math.abs(config.scale && config.scale.x ? config.scale.x : 1) *
        atlas[id].size.w
  const h =
    config.bounds && config.bounds.size && config.bounds.size.h !== undefined
      ? config.bounds.size.h
      : Math.abs(config.scale && config.scale.y ? config.scale.y : 1) *
        atlas[id].size.h
  const xy = XYParser.parse(config.bounds ? config.bounds.position : undefined)
  return {...xy, w, h}
}
