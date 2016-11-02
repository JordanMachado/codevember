uniform float time;
attribute vec3 coco;
#pragma glslify: snoise3 = require(glsl-noise/periodic/3d);
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
void main() {

	vec3 p = position;

	float noise = snoise2(vec2(uv.x, uv.y + time) * 3.0);
	float nois2 = snoise3( 3.0 * position + vec3(time * 5.0), vec3(710.0,8.0,70.0));
	p += noise * normal * 5.0;
	p += nois2 * normal;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

}
