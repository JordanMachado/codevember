


attribute vec3 scale;
attribute vec3 offsets;
attribute vec3 color;
uniform float time;
attribute vec4 orientationStart;
varying vec2 vUv;
varying vec3 vcolor;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
void main() {
  vUv = uv;
  vcolor = color.rgb;

  float noise = snoise2((vec2(uv.x, uv.y)+time) * 2.1);

	vec3 p = position + offsets ;
  p.z += noise;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

}
