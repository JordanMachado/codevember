


attribute vec3 scale;
attribute vec3 offsets;
attribute vec3 color;
uniform float time;
attribute vec4 orientationStart;
varying vec2 vUv;
varying vec3 vcolor;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/periodic/3d);

void main() {
  vUv = uv * 1.0;
  vcolor = color.rgb;

  float noise = snoise3(position + vec3(time), vec3(710.0,8.0,70.0)) *10.0;

	vec3 p = position + noise * normal;


	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

}
