uniform struct Viewport { // change to Camera
  vec2 resolution; // In pixels. chage to wh
  vec2 camera; // In pixels. change to xy
} uViewport;

attribute vec2 aVertex; // In pixels.
attribute vec2 aTextureCoords; // In units of 0 to 1.

varying vec2 vTextureCoords;

void main() {
  // Convert pixels to clipspace.
  vec2 ratio = (aVertex + uViewport.camera) / uViewport.resolution; // Scale from pixels to 0 to 1.
  vec2 flipY = vec2(1, -1); // Invert the y-coordinate
  // Scale to 0 - 2 and translate to -1 to 1.
  vec2 clipspace = (2. * ratio - 1.) * flipY;
  gl_Position = vec4(clipspace, 0, 1);

  vTextureCoords = aTextureCoords;
}
