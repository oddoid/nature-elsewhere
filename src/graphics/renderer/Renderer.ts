import fragmentGLSL from '../shaders/fragment.glsl'
import * as glConfig from './glConfig.json'
import {GLUtil} from '../GLUtil'
import {Rect} from '../../math/rect/Rect'
import {ShaderLayout} from '../shaders/shaderLayout/ShaderLayout'
import {Store} from '../../store/Store'
import vertexGLSL from '../shaders/vertex.glsl'
import {WH} from '../../math/wh/WH'

export interface Renderer {
  readonly gl: GL
  readonly layout: ShaderLayout
  readonly uniforms: Readonly<Record<string, GLUniformLocation>>
  readonly attributes: Readonly<Record<string, number>>
  readonly projection: Float32Array
  readonly perInstanceBuffer: GLBuffer
  readonly loseContext: GLLoseContext
}

const GL = WebGL2RenderingContext
const uv: Int16Array = new Int16Array(Object.freeze([1, 1, 0, 1, 1, 0, 0, 0]))
const uvLen: number = uv.length / 2 // dimensions

export namespace Renderer {
  export function make(
    canvas: HTMLCanvasElement,
    atlas: HTMLImageElement,
    layout: ShaderLayout
  ): Renderer {
    const gl = canvas.getContext('webgl2', glConfig)
    if (!(gl instanceof GL)) throw new Error('WebGL 2 unsupported.')

    // Avoid initial color flash by matching the background. [palette]
    gl.clearColor(0xf2 / 0xff, 0xf5 / 0xff, 0xf5 / 0xff, 1)
    gl.clear(GL.COLOR_BUFFER_BIT)

    // Allow transparent textures to be layered.
    gl.enable(GL.BLEND)
    gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

    // Disable image colorspace conversions. The default is browser dependent.
    gl.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, false)

    const program = GLUtil.loadProgram(gl, vertexGLSL, fragmentGLSL)
    const uniforms = GLUtil.uniformLocations(gl, program)

    gl.uniform1i(uniforms[layout.uniforms.atlas], 0)
    gl.uniform2i(
      uniforms[layout.uniforms.atlasSize],
      atlas.naturalWidth,
      atlas.naturalHeight
    )

    const attributes = GLUtil.attributeLocations(gl, program)

    const vertexArray = gl.createVertexArray()
    gl.bindVertexArray(vertexArray)

    const perVertexBuffer = gl.createBuffer()
    for (const attr of layout.perVertex.attributes)
      GLUtil.initAttribute(
        gl,
        layout.perVertex.stride,
        layout.perVertex.divisor,
        perVertexBuffer,
        attributes[attr.name],
        attr
      )
    GLUtil.bufferData(gl, perVertexBuffer, uv, GL.STATIC_READ)

    const perInstanceBuffer = gl.createBuffer()
    for (const attr of layout.perInstance.attributes)
      GLUtil.initAttribute(
        gl,
        layout.perInstance.stride,
        layout.perInstance.divisor,
        perInstanceBuffer,
        attributes[attr.name],
        attr
      )

    // Leave vertexArray bound.

    gl.bindTexture(GL.TEXTURE_2D, GLUtil.loadTexture(gl, GL.TEXTURE0, atlas))
    // Leave texture bound.

    return {
      gl,
      layout,
      uniforms,
      attributes,
      projection: new Float32Array(4 * 4),
      perInstanceBuffer,
      loseContext: gl.getExtension('WEBGL_lose_context')
    }
  }

  /**
   * @arg canvasWH The desired resolution of the canvas in CSS pixels. E.g.,
   *               {w: window.innerWidth, h: window.innerHeight}.
   * @arg scale Positive integer zoom.
   */
  export function render(
    renderer: Renderer,
    time: Milliseconds,
    canvasWH: WH,
    scale: number,
    cam: Rect,
    {dat, len}: Store
  ): void {
    resize(renderer, canvasWH, scale, cam)
    renderer.gl.uniform1ui(
      renderer.uniforms[renderer.layout.uniforms.time],
      time
    )
    const perInstanceBuffer = renderer.perInstanceBuffer
    GLUtil.bufferData(renderer.gl, perInstanceBuffer, dat, GL.DYNAMIC_READ)
    renderer.gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, uvLen, len)
  }

  /** @arg canvasWH The desired resolution of the canvas in CSS pixels. E.g.,
                    {w: window.innerWidth, h: window.innerHeight}.
      @arg scale Positive integer zoom. */
  export const resize = (
    {gl, layout, uniforms, projection}: Renderer,
    canvasWH: WH,
    scale: number,
    cam: Rect
  ): void => {
    ;({w: gl.canvas.width, h: gl.canvas.height} = canvasWH)

    projection.set(project(cam))
    gl.uniformMatrix4fv(uniforms[layout.uniforms.projection], false, projection)

    // The viewport is a rendered in physical pixels. It's intentional to use
    // the camera dimensions instead of canvas dimensions since the camera often
    // exceeds the canvas and the viewport's dimensions must be an integer
    // multiple of the camera. The negative consequence is that the first pixel
    // on the y-axis and last pixel on the x-axis may be partly truncated.
    gl.viewport(0, 0, scale * cam.size.w, scale * cam.size.h)
  }

  function project(cam: Rect): readonly number[] {
    // Convert the pixels to clipspace by taking them as a fraction of the cam
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y
    // is downward, and translating to -1 to 1 and again by the camera position.
    const {w, h} = {w: 2 / cam.size.w, h: 2 / cam.size.h}
    return [
      w,  0, 0, -1 - cam.position.x * w,
      0, -h, 0,  1 + cam.position.y * h,
      0,  0, 1,              0,
      0,  0, 0,              1
    ] // prettier-ignore
  }
}