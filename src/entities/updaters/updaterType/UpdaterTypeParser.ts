import {ObjectUtil} from '../../../utils/ObjectUtil'
import {UpdaterType} from './UpdaterType'
import {UpdaterTypeConfig, UpdaterTypeArrayConfig} from './UpdaterTypeConfig'

export namespace UpdaterTypeParser {
  export function parseAll(config: UpdaterTypeArrayConfig): UpdaterType[] {
    return (config || []).map(parse)
  }

  export function parse(config: UpdaterTypeConfig): UpdaterType {
    const type = config || UpdaterType.NO_UPDATE
    if (ObjectUtil.assertValueOf(UpdaterType, type, 'UpdaterType')) return type
    throw new Error()
  }
}