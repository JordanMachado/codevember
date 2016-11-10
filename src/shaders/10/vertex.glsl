varying vec3 e;
varying vec3 n;
varying vec2 vUv;
uniform float time;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

#pragma glslify: snoise3 = require(glsl-noise/periodic/3d);


void main(){
	e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
	n = normalize( normalMatrix * normal );
	vUv = uv;
	vec4 p = vec4(position, 1.0);
	float noise = snoise3( position/8. - vec3(time * 3.0), vec3(71.0,8.0,70.0));
	float noise2 = snoise3( position/2. - vec3(time * 10.0), vec3(71.0,8.0,70.0));

	p.xyz += noise * normal * 4.0;
	p.xyz += noise2 * normal ;
	// p.xyz += noise * normal * sin(time * 5.0);

	gl_Position = projectionMatrix * modelViewMatrix * p;
}
