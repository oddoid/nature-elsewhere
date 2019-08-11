import * as bee from '../assets/entities/bee.json'
import * as bush from '../assets/entities/bush.json'
import * as cloud from '../assets/entities/cloud.json'
import * as clover from '../assets/entities/clover.json'
import * as conifer from '../assets/entities/conifer.json'
import * as cursor from '../assets/entities/cursor.json'
import * as editor from '../assets/entities/editor.json'
import {Entity} from './entity'
import * as grass from '../assets/entities/grass.json'
import * as mountain from '../assets/entities/mountain.json'
import * as pyramid from '../assets/entities/pyramid.json'
import * as text from '../assets/entities/text.json'
import * as tree from '../assets/entities/tree.json'

export const EntityConfigs: Readonly<
  Partial<Record<string, Entity.Config>>
> = Object.freeze({
  bee,
  bush,
  cloud,
  clover,
  conifer,
  cursor,
  editor,
  grass,
  mountain,
  pyramid,
  text,
  tree
})