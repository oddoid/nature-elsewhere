import * as atlas from '../entities/atlas'
import * as entity from '../entities/entity'
import * as random from '../random'
import * as animation from '../entities/animation'
import * as util from '../util'

type State = Readonly<{player: entity.State; entities: entity.State[]}>

const tallGrassIDs = [
  animation.ID.TALL_GRASS_A,
  animation.ID.TALL_GRASS_B,
  animation.ID.TALL_GRASS_C,
  animation.ID.TALL_GRASS_D,
  animation.ID.TALL_GRASS_E,
  animation.ID.TALL_GRASS_F,
  animation.ID.TALL_GRASS_G,
  animation.ID.TALL_GRASS_H,
  animation.ID.TALL_GRASS_I
]

export function newState(atlas: atlas.State, randomState: random.State): State {
  const entities = [
    ...entity.newBackground(
      {x: entity.Limits.HALF_MIN, y: entity.Limits.HALF_MIN},
      {x: entity.Limits.MAX, y: entity.Limits.MAX}
    ),
    ...entity.newGrass(animation.ID.GRASS_L, {x: -512, y: -12}, {x: 48, y: 1}),
    ...entity.newGrass(animation.ID.GRASS_L, {x: 208, y: -12}, {x: 2, y: 1}),
    ...entity.newGrass(animation.ID.TALL_GRASS_A, {x: 188, y: -15}),
    ...entity.newGrass(animation.ID.TALL_GRASS_B, {x: 208, y: -15}),
    ...util
      .range(0, 20)
      .map(i => {
        randomState = random.nextIntState(randomState, 0, tallGrassIDs.length)
        return entity.newGrass(
          tallGrassIDs[(<random.NextState>randomState).result],
          {
            x: 228 + i * 4,
            y: -16
          }
        )
      })
      .reduce(util.flatten),
    ...entity.newGrass(animation.ID.GRASS_L, {x: 228, y: -12}, {x: 6, y: 1}),
    ...entity.newTree({x: 185, y: -39}),
    ...entity.newCloud(animation.ID.CLOUD_S, {x: 40, y: -60}),
    ...entity.newCloud(animation.ID.CLOUD_M, {x: 58, y: -76}),
    ...entity.newRainCloud(animation.ID.CLOUD_S, {x: 75, y: -65}, -0.08),
    ...entity.newCloud(animation.ID.CLOUD_XL, {x: 120, y: -60}),
    ...entity.newRainCloud(animation.ID.CLOUD_L, {x: 20, y: -81}, -0.1),
    ...entity.newSuperBall({x: 10, y: -30}, {x: 0, y: 4})
  ]

  const player = entity.newPlayer({
    x: 0,
    y: -atlas.animations['player idle'].cels[0].bounds.h - 12
  })[0]
  entities.push(player)
  return {player, entities}
}
