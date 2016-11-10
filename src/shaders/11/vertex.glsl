varying vec3 e;
varying vec3 n;
varying vec2 vUv;
varying float vvisibily;
uniform sampler2D tHeightMap;


uniform float time;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

#pragma glslify: snoise3 = require(glsl-noise/periodic/3d);

const float density = 0.09;
const float gradient = 1.5;


void main(){
	vUv = uv;
	vec4 p = vec4( position, 1.0 );

	vec4 heightMap = texture2D(tHeightMap,uv);
	p.z += (heightMap.r + heightMap.g + heightMap.b);
	vec4 worldPosition = modelViewMatrix * p;

	float dist = length(worldPosition);
	float visibily = exp(-pow(dist * density,gradient));
	visibily = clamp(visibily, 0.0, 1.0);
	vvisibily = visibily;







	// p.xyz += noise * normal * sin(time * 5.0);

	gl_Position = projectionMatrix  * modelViewMatrix * p;
}
