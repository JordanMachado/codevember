// simulation
varying vec2 vUv;

uniform sampler2D origin;
uniform sampler2D tPositions;
uniform sampler2D tPositionstest;
uniform vec3 mouse;
uniform sampler2D tVelocity;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main() {
      vec4 opos = texture2D(origin, vUv);
      vec4 pos = texture2D(tPositions, vUv);
      vec4 tpos = texture2D(tPositionstest, vUv);
      vec4 vel = texture2D(tVelocity, vUv);
      vec3 yo = mouse - opos.xyz;
      if(length(yo) < 3.0) {
        pos.xyz -= (pos.xyz - tpos.xyz) *0.1;
      } else {
        pos.xyz += (opos.xyz - pos.xyz) * 0.1;
      }

      pos.xyz +=  rand(pos.xz) * 0.05;

      gl_FragColor = vec4(pos.xyz,1.0);
}
