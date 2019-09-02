import {ObjectUtil} from './object-util'

// https://github.com/Microsoft/TypeScript/issues/1897
export type JSON = string | number | boolean | JSONObject | JSONArray
export interface JSONObject extends Readonly<Record<string, JSON>> {}
export interface JSONArray extends ReadonlyArray<JSON> {}

export namespace JSONUtil {
  export const merge = (...val: readonly JSONObject[]): JSONObject => {
    return val
      .map(ObjectUtil.entries)
      .reduce((sum, val) => sum.concat(val), [])
      .reduce((sum: JSONObject, [key, val]) => {
        const prev = sum[key]
        if (isJSONObject(prev) && isJSONObject(val)) val = merge(prev, val)
        else if (Array.isArray(prev))
          val = prev.concat(
            isJSONObject(val) || Array.isArray(val) ? copy(<any>val) : val
          )
        else if (isJSONObject(val) || Array.isArray(val)) val = copy(<any>val)
        return {...sum, [key]: val}
      }, {})
  }

  export const copy = <T>(val: Readonly<T> & JSON): T =>
    JSON.parse(JSON.stringify(val))
}

const isJSONObject = (val: JSON): val is JSONObject => ObjectUtil.isObject(val)