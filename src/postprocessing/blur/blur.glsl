varying vec2 vUv;
uniform sampler2D tInput;
uniform vec2 resolution;
#pragma glslify: blur1 = require('glsl-fast-gaussian-blur/13')
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)
void main() {
  // gl_FragColor = texture2D(tInput, vUv);
  
  gl_FragColor = blur1(tInput, vUv, resolution.xy, vec2(5.0));
}
