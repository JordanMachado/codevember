
uniform vec3 color;


void main() {

  float depth = smoothstep( 40.0, -40.0, gl_FragCoord.z / gl_FragCoord.w );

	gl_FragColor = vec4(vec3(0.0), depth);

}
