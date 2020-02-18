#version 100
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;
uniform int time;

attribute vec2 uv; // x, y (0 or 1).
// The subimage location and dimensions within the atlas given in pixel
// coordinates. x, y, width (z), and height (w) in pixels. Alpha (or masking) is
// taken from sourceAlpha and coloring (RGB) is taken from sourceColor. For
// unmasked images, sourceAlpha and sourceColor are the same.
attribute vec4 source;
attribute vec4 constituent;
attribute float composition;
// The rendered destination and dimensions in level pixel coordinates. x, y,
// scaled width (z) and scaled height (w) in pixels. When the destination width
// and height is not equal to the source width and height times scale, the
// rendered result is the source truncated or repeated.
attribute vec4 target;
attribute vec2 scale;
attribute vec4 translate; // Translation (x, y) and translation velocity (z, w)
                          // in units of 1/10000 pixels.

varying vec4 v_source;
varying vec4 v_constituent;
varying float v_composition;
varying vec2 v_offset;
varying vec2 v_constituent_offset;

void main() {
  // Offset flipped images by their width or height.
  gl_Position = vec4(target.xy + uv * (target.zw - target.xy), 1, 1) * projection;
  v_source = source;
  v_constituent = constituent;
  v_composition = composition;
  v_offset = (vec2(-translate.xy + uv * (target.zw - target.xy)) - vec2(translate.zw) * float(time) / 10000.) / vec2(scale);
  v_offset = v_offset - mod(v_offset, 1. / vec2(abs(scale)));
  v_constituent_offset = vec2(uv * (target.zw - target.xy)) / vec2(scale);
  v_constituent_offset = v_constituent_offset - mod(v_constituent_offset, 1. / vec2(abs(scale)));
}
