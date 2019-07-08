#version 300 es
precision mediump int;
precision mediump float;

// The camera projection in pixels.
uniform mat4 projection;

in ivec2 uv; // x, y (0 or 1).
in ivec4 source; // x, y, width (z), and height (w) in pixels.
in ivec2 position; // x, y in pixels.

out vec2 vSource;

void main() {
  gl_Position = vec4(position + uv * source.zw, 0, 1) * projection;
  vSource = vec2(source.xy + uv * source.zw);
}
