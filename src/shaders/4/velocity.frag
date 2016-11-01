// simulation
varying vec2 vUv;

uniform sampler2D tVelocity;
uniform sampler2D tPositions;
uniform sampler2D tInfos;

uniform vec3 mouse;

const int ATTRACTNUM = 10;
uniform vec3 reperlerCenter[ATTRACTNUM];
uniform float reperlersForce[ATTRACTNUM];
const float G = 0.1;

vec3 getForce(vec3 pos, float mass) {
	vec3 f = vec3(0.0);

	for (int i = 0; i < ATTRACTNUM; i++) {
		vec3 reperlerCenter = reperlerCenter[i];
		float reperlerForce = reperlersForce[i];

    vec3 force = reperlerCenter - pos.xyz;
    float fL = clamp(length(force),5.0,20.0);
    vec3 fN = normalize(force);
    float strength = (G * reperlerForce * mass) / (fL * fL);
    fN *= strength;
    fN /= mass;
    f.xyz += fN ;

	}
	return f;
}


void main() {


      vec4 pos = texture2D(tPositions, vUv);
      vec4 vel = texture2D(tVelocity, vUv);
      vec4 infos = texture2D(tInfos, vUv);
      float mass = infos.x;
      vec3 force = mouse - pos.xyz;
      float fL = clamp(length(force),5.0,20.0);
      vec3 fN = normalize(force);
      float strength = (G * 20.0 * mass) / (fL * fL);
      fN *= strength;
      fN /= mass;
      vel.xyz += fN;

      vec3 f = getForce(pos.xyz, mass);
      vel.xyz += f;

      // vel.xyz += fN;


      // if(length(force) < 1.0) {
      //   vel.xyz += nForce * 0.1;
      //
      // }
      // vel.xyz *= 0.993;


      gl_FragColor = vec4(vel.xyz,1.0);
}
