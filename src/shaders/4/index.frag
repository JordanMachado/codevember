varying vec3 vColor;
varying vec3 vVel;
void main() {

	if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
		discard;
	}
  float depth = smoothstep( 3000.0, -3000.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(vColor + vVel, depth);

}
