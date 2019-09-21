import {AtlasID} from './atlas-id'
import {AtlasIDConfig} from './atlas-id-config'
import {ObjectUtil} from '../../utils/object-util'

export namespace AtlasIDParser {
  export function parse(config: AtlasIDConfig): AtlasID {
    if (ObjectUtil.assertValueOf(AtlasID, config, 'AtlasID')) return config
    throw new Error()
  }
}
