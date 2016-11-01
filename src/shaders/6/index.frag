
varying vec2 vUv;
varying vec3 vcolor;
void main() {


	// if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
	// 	discard;
	// }
  float depth = smoothstep( 100.0, -100.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(1.0,1.0,1.0, depth);

}
