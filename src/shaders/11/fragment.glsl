uniform sampler2D tBlendMap;
uniform sampler2D tBackground;
uniform sampler2D tR;
uniform sampler2D tG;
uniform sampler2D tB;

varying vec2 vUv;

varying float vvisibily;

void main() {
  vec4 blendMapColor = texture2D(tBlendMap,vUv);
  float backTextureAmout = 1. - (blendMapColor.r + blendMapColor.g + blendMapColor.b);
  vec2 tileCord = vUv * 40.0;
  vec4 backgroundColor = texture2D(tBackground,tileCord) * backTextureAmout;
  vec4 tRcolor = texture2D(tR,tileCord) * blendMapColor.r;
  vec4 tGcolor = texture2D(tG,tileCord) * blendMapColor.g;
  vec4 tBcolor = texture2D(tB,tileCord) * blendMapColor.b;
  vec4 color = backgroundColor + tRcolor + tGcolor + tBcolor;

    gl_FragColor = vec4(color);
    vec3 fogColor = vec3(1.0);
    gl_FragColor.rgb = mix(fogColor, gl_FragColor.rgb,vvisibily );

}
