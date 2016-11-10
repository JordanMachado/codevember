varying vec3 e;
varying vec3 n;
varying vec2 vUv;
varying float vvisibily;
uniform sampler2D tHeightMap;
uniform sampler2D tBlendMap;


uniform float time;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

#pragma glslify: snoise3 = require(glsl-noise/periodic/3d);

const float density = 0.005;
const float gradient = 1.5;


void main(){
	vUv = uv;
	vec4 p = vec4( position, 1.0 );

	vec4 blend = texture2D(tBlendMap,uv);
	vec4 heightMap = texture2D(tHeightMap,uv);
	float noise = snoise3( position/50., vec3(71.0,8.0,70.0));
	float noise2 = snoise3( position, vec3(71.0,8.0,70.0));

	p.z += noise * 10.;
	p.z += noise2 * (1.0 - blend.b);
	vec4 worldPosition = modelViewMatrix * p;

	float dist = length(worldPosition);
	float visibily = exp(-pow(dist * density,gradient));
	visibily = clamp(visibily, 0.0, 1.0);
	vvisibily = visibily;







	// p.xyz += noise * normal * sin(time * 5.0);

	gl_Position = projectionMatrix  * modelViewMatrix * p;
}
