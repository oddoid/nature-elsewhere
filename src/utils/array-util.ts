export namespace ArrayUtil {
  export function uniq<T>(
    equals: (lhs: T, rhs: T) => boolean
  ): Parameters<T[]['filter']>[0] {
    return (item: T, _: number, array: readonly T[]) =>
      array.findIndex(rhs => equals(item, rhs)) !== -1
  }

  /** Type guard. */
  export function is<T>(val: T | null | undefined): val is T {
    return val !== null && val !== undefined
  }
}
