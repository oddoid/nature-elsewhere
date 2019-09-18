import {UpdateState} from './update-state'
import {Entity} from '../entity'
import {LevelEditorPanel} from '../types/ui/level-editor-panel'
import {UpdateStatus} from './update-status'
import {FollowCam} from './follow-cam'
import {Cursor} from './cursor'
import {Atlas} from '../../atlas/atlas/atlas'
import {Link} from './link'
import {LevelLink} from './level-link'
import {Checkbox} from '../types/ui/checkbox'
import {Button} from '../types/ui/button'
import {DestinationMarker} from './destination-marker'
import {Backpacker} from '../types/backpacker'

/** See UpdatePredicate. */
export enum Updater {
  NO_UPDATE = 'noUpdate', // i think i need this for animation? can i move it just to updatepredicate.never?
  UI_LEVEL_EDITOR_PANEL = 'uiLevelEditorPanel',
  WRAPAROUND = 'wraparound',
  CIRCLE = 'circle',
  UI_CURSOR = 'uiCursor',
  UI_FOLLOW_CAM = 'uiFollowCam',
  UI_BUTTON = 'uiButton',
  UI_CHECKBOX = 'uiCheckbox',
  UI_LINK = 'uiLink',
  UI_LEVEL_LINK = 'uiLevelLink',
  UI_DESTINATION_MARKER = 'uiDestinationMarker',
  CHAR_BACKPACKER = 'charBackpacker'
}

const wraparound: Updater.Update = () => {
  return UpdateStatus.UNCHANGED
}

export namespace Updater {
  export type Update = (entity: Entity, state: UpdateState) => UpdateStatus
  export const Update: Readonly<Record<Updater, Update>> = {
    [Updater.NO_UPDATE]() {
      return UpdateStatus.UNCHANGED
    },
    [Updater.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanel.update,
    [Updater.WRAPAROUND]: wraparound,
    [Updater.CIRCLE]: wraparound,
    [Updater.UI_CURSOR]: Cursor.update,
    [Updater.UI_FOLLOW_CAM]: FollowCam.update,
    [Updater.UI_BUTTON]: Button.update,
    [Updater.UI_CHECKBOX]: Checkbox.update,
    [Updater.UI_LINK]: Link.update,
    [Updater.UI_LEVEL_LINK]: LevelLink.update,
    [Updater.UI_DESTINATION_MARKER]: DestinationMarker.update,
    [Updater.CHAR_BACKPACKER]: Backpacker.update
  }

  export type Parse = (config: Entity, atlas: Atlas) => Entity
  export const Parse: Readonly<Partial<Record<Updater, Parse>>> = {
    [Updater.UI_LEVEL_LINK]: LevelLink.parse,
    [Updater.UI_FOLLOW_CAM]: FollowCam.parse
  }
}
