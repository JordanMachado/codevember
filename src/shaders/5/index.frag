uniform sampler2D map;
varying vec2 vUv;
varying vec3 vcolor;
void main() {
  vec4 buffer = texture2D(map,vUv);

	// if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
	// 	discard;
	// }
  float depth = smoothstep( 3000.0, -3000.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(vcolor, buffer.a);

}
