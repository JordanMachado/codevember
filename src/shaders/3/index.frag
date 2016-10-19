
uniform vec3 color;
varying vec3 vcoco;

void main() {

  float depth = smoothstep( 40.0, -40.0, gl_FragCoord.z / gl_FragCoord.w );

	gl_FragColor = vec4(0.0, 0.0, 0.0, depth);


}
