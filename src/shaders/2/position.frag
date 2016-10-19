// simulation
varying vec2 vUv;

uniform sampler2D origin;
uniform sampler2D tPositions;
uniform sampler2D tInfos;
uniform vec3 mouse;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main() {
      vec4 opos = texture2D(origin, vUv);
      vec4 pos = texture2D(tPositions, vUv);
      vec4 infos = texture2D(tInfos, vUv);
      vec3 yo = mouse - opos.xyz;
      if(length(yo) < 10.0 + infos.x) {
        pos.xyz -= (pos.xyz - mouse.xyz) * infos.y;
      } else {
        pos.xyz += (opos.xyz - pos.xyz) * infos.z;
      }



      gl_FragColor = vec4(pos.xyz,1.0);
}
