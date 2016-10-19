uniform sampler2D map;
uniform sampler2D origin;
attribute float size;

void main() {

	vec4 buffer = texture2D(map,uv);
	vec3 p = buffer.xyz;
	gl_PointSize = size;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

}
