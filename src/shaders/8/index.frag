
varying vec2 vUv;
varying vec3 vcolor;
uniform float time;

void main() {

  float color = sin((vUv.y + time * 0.4) * 100.0 );
	color += sin((vUv.x * 0.4) * 250.0 )/  0.5;
  float depth = smoothstep( 300.0, -300.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(vec3(color), depth);

}
