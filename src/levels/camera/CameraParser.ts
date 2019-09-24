import {CameraConfig} from './CameraConfig'
import {EntityIDParser} from '../../entities/entityID/EntityIDParser'
import {XYParser} from '../../math/xy/XYParser'
import {EntityID} from '../../entities/entityID/EntityID'
import {Camera} from './Camera'

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config)
      return {
        bounds: {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
        followID: EntityID.ANONYMOUS
      }
    const position = XYParser.parse(config.position)
    const followID = EntityIDParser.parse(config.followID)
    return {bounds: {position, size: {w: 0, h: 0}}, followID}
  }
}