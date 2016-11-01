// simulation
varying vec2 vUv;

uniform sampler2D origin;
uniform sampler2D tPositions;
uniform vec3 mouse;
#pragma glslify: snoise = require(glsl-curl-noise)

void main() {
      vec4 opos = texture2D(origin, vUv);
      vec4 pos = texture2D(tPositions, vUv);
      pos.xyz += snoise(pos.xyz) * 0.01;
      float life = pos.a;
      life -= 0.002;
      if(life < 0.0) {
        life = 1.0;
        pos.xyz = opos.xyz;
      }

      gl_FragColor = vec4(pos.xyz,life);
}
