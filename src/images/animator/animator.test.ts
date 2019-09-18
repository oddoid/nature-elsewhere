import {Animator} from './animator'
import {Atlas} from '../../atlas/atlas/atlas'
import {ObjectUtil} from '../../utils/object-util'
import {Aseprite} from '../../atlas/atlas/aseprite'

describe('step()', () => {
  test('time < duration', () => {
    const cel = {position: {x: 0, y: 0}, duration: 1}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel],
      duration: 2,
      direction: Atlas.AnimationDirection.FORWARD
    }
    const ret = Animator.animate(0, 0.5, animation)
    expect(ret).toMatchObject({period: 0, exposure: 0.5})
  })

  test('time === duration', () => {
    const cel = {position: {x: 0, y: 0}, duration: 1}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel],
      duration: 2,
      direction: Atlas.AnimationDirection.FORWARD
    }
    const ret = Animator.animate(0, 1, animation)
    expect(ret).toMatchObject({period: 1, exposure: 0})
  })

  test('time > duration', () => {
    const cel = {position: {x: 0, y: 0}, duration: 1}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel],
      duration: 2,
      direction: Atlas.AnimationDirection.FORWARD
    }
    const ret = Animator.animate(0, 1.5, animation)
    expect(ret).toMatchObject({period: 1, exposure: 0.5})
  })
})

describe('index', () => {
  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# direction %p array start',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel],
        duration: 2,
        direction
      }
      const {period} = Animator.animate(0, 1, animation)
      const ret = Animator.index(period, animation.cels)
      expect(ret).toStrictEqual(1)
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# direction %p array end',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel],
        duration: 2,
        direction
      }
      const {period} = Animator.animate(1, 1, animation)
      const ret = Animator.index(period, animation.cels)
      expect(ret).toStrictEqual(0)
    }
  )

  test.each(<
    readonly [Aseprite.AnimationDirection, number, readonly number[]][]
  >[
    [
      Atlas.AnimationDirection.FORWARD,
      0,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      Atlas.AnimationDirection.FORWARD,
      Number.MAX_SAFE_INTEGER,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      Atlas.AnimationDirection.REVERSE,
      Number.MIN_SAFE_INTEGER,
      [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]
    ],
    [
      Atlas.AnimationDirection.REVERSE,
      3,
      [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3]
    ],
    [
      Atlas.AnimationDirection.PING_PONG,
      -2,
      [3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2]
    ],
    [
      Atlas.AnimationDirection.PING_PONG,
      0,
      [1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2]
    ],
    [
      Atlas.AnimationDirection.PING_PONG,
      3,
      [2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1]
    ]
  ])('%# direction %p bounds %p', (direction, period, expected) => {
    const cel = {position: {x: 0, y: 0}, duration: 1}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel, cel, cel],
      duration: 4,
      direction
    }
    let exposure = 0
    const ret = []
    for (let i = 0; i < animation.cels.length * 5; ++i) {
      ;({period, exposure} = Animator.animate(period, exposure + 1, animation))
      ret.push(Animator.index(period, animation.cels))
    }
    expect(ret).toStrictEqual(expected)
  })

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# duration met direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      let {period, exposure} = {period: 0, exposure: 0}
      const ret = []
      for (let i = 0; i < animation.cels.length * 3; ++i) {
        ;({period, exposure} = Animator.animate(
          period,
          exposure + 1,
          animation
        ))
        ret.push(Animator.index(period, animation.cels))
      }
      // prettier-ignore
      const expected = {
        [Atlas.AnimationDirection.FORWARD]:   [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
        [Atlas.AnimationDirection.REVERSE]:   [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
        [Atlas.AnimationDirection.PING_PONG]: [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1]
      }
      expect(ret).toStrictEqual(expected[direction])
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# duration exceeded direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      let {period, exposure} = {period: 0, exposure: 0}
      const ret = []
      for (let i = 0; i < animation.cels.length * 3; ++i) {
        ;({period, exposure} = Animator.animate(
          period,
          exposure + 6,
          animation
        ))
        ret.push(Animator.index(period, animation.cels))
      }
      // prettier-ignore
      const expected = {
        [Atlas.AnimationDirection.FORWARD]:   [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
        [Atlas.AnimationDirection.REVERSE]:   [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
        [Atlas.AnimationDirection.PING_PONG]: [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1]
      }
      expect(ret).toStrictEqual(expected[direction])
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# fractional duration met direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      let {period, exposure} = {period: 0, exposure: 0}
      const ret = []
      for (let i = 0; i < animation.cels.length * 6; ++i) {
        ;({period, exposure} = Animator.animate(
          period,
          exposure + 0.5,
          animation
        ))
        ret.push(Animator.index(period, animation.cels))
      }
      // prettier-ignore
      const expected = {
        [Atlas.AnimationDirection.FORWARD]:   [0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0],
        [Atlas.AnimationDirection.REVERSE]:   [0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0],
        [Atlas.AnimationDirection.PING_PONG]: [0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1]
      }
      expect(ret).toStrictEqual(expected[direction])
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# duration not met direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      let {period, exposure} = {period: 0, exposure: 0}
      const ret = []
      for (let i = 0; i < animation.cels.length * 6; ++i) {
        ;({period, exposure} = Animator.animate(
          period,
          exposure + 0.9,
          animation
        ))
        ret.push(Animator.index(period, animation.cels))
      }
      // prettier-ignore
      const expected = {
        [Atlas.AnimationDirection.FORWARD]:   [0, 1, 2, 3, 4, 0, 1, 2, 3, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 1],
        [Atlas.AnimationDirection.REVERSE]:   [0, 4, 3, 2, 1, 0, 4, 3, 2, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 4],
        [Atlas.AnimationDirection.PING_PONG]: [0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 2]
      }
      expect(ret).toStrictEqual(expected[direction])
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
    '%# fractional duration exceeded direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      let {period, exposure} = {period: 0, exposure: 0}
      const ret = []
      for (let i = 0; i < animation.cels.length * 6; ++i) {
        ;({period, exposure} = Animator.animate(
          period,
          exposure + 5.5,
          animation
        ))
        ret.push(Animator.index(period, animation.cels))
      }
      // prettier-ignore
      const expected = {
        [Atlas.AnimationDirection.FORWARD]:   [0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0],
        [Atlas.AnimationDirection.REVERSE]:   [0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0],
        [Atlas.AnimationDirection.PING_PONG]: [0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1]
      }
      expect(ret).toStrictEqual(expected[direction])
    }
  )
})
