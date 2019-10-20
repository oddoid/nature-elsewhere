import {AtlasID, MEM_FONT_PREFIX} from '../../atlas/AtlasID'
import {Entity} from '../../entity/Entity'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {Image} from '../../image/Image'
import {ImageComposition} from '../../image/ImageComposition'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {JSONObject} from '../../utils/JSON'
import {Layer} from '../../image/Layer'
import {Limits} from '../../math/Limits'
import {Rect} from '../../math/Rect'
import {TextLayout} from '../../text/TextLayout'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'

export class Text extends Entity<Text.Variant, Text.State> {
  private _text: string
  private readonly _textLayer: Layer
  private readonly _textScale: XY
  private readonly _textMaxSize: WH

  constructor(props?: Text.Props<Text.Variant, Text.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Text.State.VISIBLE]: new ImageRect()
      },
      ...props
    })

    this._text = props?.text ?? defaults.text
    this._textLayer = props?.textLayer ?? defaults.textLayer
    this._textScale = props?.textScale ?? defaults.textScale.copy()
    this._textMaxSize = props?.textMaxSize ?? defaults.textMaxSize.copy()

    const textImages = toImages(
      this._text,
      this._textScale,
      {
        position: this.imageBounds().position.copy(),
        size: this._textMaxSize
      },
      this.constituentID()
    )
    if (props?.textLayer)
      for (const image of textImages) image.layer = this._textLayer

    this.addImages(...textImages)
  }

  get text(): string {
    return this._text
  }

  toJSON(): JSONObject {
    const diff = EntitySerializer.serialize(this, defaults)
    if (this._text !== defaults.text) diff.text = this._text
    if (this._textLayer !== defaults.textLayer) diff.textLayer = this._textLayer
    if (!this._textScale.equal(defaults.textScale))
      diff.textScale = {
        ...(this._textScale.x !== defaults.textScale.x && {
          x: this._textScale.x
        }),
        ...(this._textScale.y !== defaults.textScale.y && {
          y: this._textScale.y
        })
      }
    if (!this._textMaxSize.equal(defaults.textMaxSize))
      diff.textMaxSize = {
        ...(this._textMaxSize.w !== defaults.textMaxSize.w && {
          w: this._textMaxSize.w
        }),
        ...(this._textMaxSize.h !== defaults.textMaxSize.h && {
          h: this._textMaxSize.h
        })
      }
    return diff
  }
}

export namespace Text {
  export enum Variant {
    NONE = 'none'
  }
  export enum State {
    VISIBLE = 'visible'
  }

  export interface Props<
    Variant extends string = string,
    State extends string = Text.State
  > extends Entity.SubProps<Variant, State> {
    readonly text?: string
    readonly textLayer?: Layer
    readonly textScale?: XY
    readonly textMaxSize?: WH
  }
}

/** @arg y The vertical scroll offset in pixels. */
function toImages(
  string: string,
  scale: XY,
  bounds: Rect,
  constituentID?: AtlasID,
  y: number = 0
): readonly Image[] {
  const images = []
  const {chars} = TextLayout.layout(string, bounds.size.w, scale)
  for (let i = 0; i < chars.length; ++i) {
    const char = chars[i]
    if (!char) continue
    if (TextLayout.nextLine(char.position.y, scale).y < y) continue
    if (char.position.y > y + bounds.size.h) break

    const image = newCharacterImage(
      string.charCodeAt(i),
      new XY(
        bounds.position.x + char.position.x,
        bounds.position.y + char.position.y - y
      ),
      // Size is only needed for the last character to ensure minimal width
      // instead of maximal letter width bounding (five pixels, at time of
      // writing, which may be a good bit larger than some single pixel
      // character like an exclamation mark.)
      char.size,
      scale,
      constituentID
    )
    images.push(image)
  }
  return images
}

function newCharacterImage(
  char: number,
  position: XY,
  {w, h}: WH,
  scale: XY,
  constituentID: Maybe<AtlasID>
): Image {
  const id = <AtlasID>(MEM_FONT_PREFIX + char.toString().padStart(3, '0'))
  const composition = ImageComposition.SOURCE_MASK
  return new Image({id, constituentID, composition, position, w, h, scale})
}

const defaults = Object.freeze({
  type: EntityType.UI_TEXT,
  variant: Text.Variant.NONE,
  state: Text.State.VISIBLE,
  updatePredicate: UpdatePredicate.ALWAYS,
  text: '',
  textLayer: Layer.UI_LO,
  textScale: Object.freeze(new XY(1, 1)),
  textMaxSize: Object.freeze(new WH(Limits.maxShort, Limits.maxShort))
})
