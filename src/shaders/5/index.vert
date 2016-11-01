uniform sampler2D map;


attribute vec3 scale;
attribute vec3 color;

attribute vec4 orientationStart;
varying vec2 vUv;
varying vec3 vcolor;

void main() {
  vUv = uv;
  vcolor = color.rgb;
  vec4 buffer = texture2D(map,uv);

	vec3 p = position * scale;
  vec3 vcV = cross(orientationStart.xyz, p);
  vec3	vPosition = buffer.xyz + vcV * (2.0 * orientationStart.w) + (cross(orientationStart.xyz, vcV) * 2.0 + p);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

}
