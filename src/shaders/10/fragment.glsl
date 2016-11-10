// DIRTYYYYYYYY
uniform sampler2D tMatCap;
uniform sampler2D tNormal;
uniform vec3 LightPos;
uniform vec2 Resolution;
varying vec3 e;
varying vec3 n;

vec4 LightColor;
vec4 AmbientColor;
vec3 Falloff;
varying vec2 vUv;

void main() {

    vec3 normalTex = texture2D(tNormal,vUv).rbg * 2.0 - 1.0;
    normalTex.xy *= 10.;
    vec3 LightDir = vec3(LightPos.xy - (gl_FragCoord.xy / Resolution.xy), LightPos.z);
    LightDir.x *= Resolution.x / Resolution.y;

    LightColor = vec4(0.17,.23,1.0,1.0);
    AmbientColor = vec4(1.0,1.0,1.0,.2);
    Falloff = vec3(.005,.005,0.005);
    float D = length(LightDir);
    vec3 N = normalize(normalTex);
    vec3 L = normalize(LightDir);

    vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);
    vec3 Ambient = AmbientColor.rgb * AmbientColor.a;

    float Attenuation = 1.0 / ( Falloff.x + (Falloff.y*D) + (Falloff.z*D*D) );


    vec3 Intensity = Ambient + Diffuse *Attenuation;
    vec3 FinalColor = Intensity;


    vec3 r = reflect( e, n );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vec2 vN = r.xy / m + .5;

    vec3 base = texture2D( tMatCap, vN ).rgb;

    gl_FragColor = vec4(base+ Intensity, 1. );

}
