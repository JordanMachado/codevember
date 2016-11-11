uniform sampler2D tSprite;
uniform vec2 uvOffset;
uniform vec2 uvScale;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * uvScale + uvOffset;
  vec4 sprite = texture2D(tSprite,uv);
  gl_FragColor = vec4(0.0);
  gl_FragColor = sprite;

}
