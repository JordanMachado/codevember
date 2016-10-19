
uniform vec3 color;
void main() {

	if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
		discard;
	}
  float depth = smoothstep( 800.0, -800.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(color/255.0, depth);

}
