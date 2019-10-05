import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'
import {CollisionType} from '../collision/CollisionType'
import {Atlas} from 'aseprite-atlas'
import {FollowCamOrientation, FollowCam} from '../updaters/followCam/FollowCam'
import {WH} from '../math/WH'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'

export class Toolbar extends Entity implements FollowCam {
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin: WH

  constructor(atlas: Atlas, props?: Optional<Entity.Props, 'type'>) {
    super({
      type: EntityType.UI_TOOLBAR,
      state: ToolbarState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [ToolbarState.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.SCENERY_FLAG, layer: Layer.UI_HI}),
            new Image(atlas, {
              id: AtlasID.SCENERY_FLAG,
              position: new XY(4, 0),
              layer: Layer.UI_HI
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_FLAG,
              position: new XY(8, 0),
              layer: Layer.UI_HI
            }),
            new Image(atlas, {
              id: AtlasID.CHAR_ARROW_DIAGONAL,
              position: new XY(12, 0),
              layer: Layer.UI_HI
            })
          ]
        })
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      updaters: [UpdaterType.UI_FOLLOW_CAM],
      collisionType: CollisionType.TYPE_UI,
      ...props
    })
    this.positionRelativeToCam = FollowCamOrientation.SOUTH_WEST
    this.camMargin = new WH(1, 1)
  }
}

export enum ToolbarState {
  VISIBLE = 'visible'
}