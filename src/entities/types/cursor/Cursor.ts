import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

export interface Cursor extends Entity {
  readonly type: EntityType.UI_CURSOR
}