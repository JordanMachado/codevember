const THREE = require('three');
const glslify = require('glslify');
window.THREE = THREE;

export default class Sprite extends THREE.Object3D{
  constructor({texture}) {
    super();
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        tSprite: {
          type: 't',
          value: texture,
        },
        uvOffset: {
          type: 'v2',
          value: new THREE.Vector2(),
        },
        uvScale: {
          type: 'v2',
          value: new THREE.Vector2(),
        }
      },
      vertexShader: glslify('../shaders/12/vertex.glsl'),
      fragmentShader: glslify('../shaders/12/fragment.glsl'),
      transparent: true,
    });
    this.nbOfFrame = 6;
    console.log(texture.image.width,texture.image.height);
    const w = texture.image.width/6;
    const h = texture.image.height;
    this.frames = []
    for (var i = 0; i < this.nbOfFrame; i++) {
      const frame = {
        offset: {
          x: (i * w ) / texture.image.width,
          y:0,
        },
        scale:{
  					x:w / texture.image.width,
  					y:h / texture.image.height,
  			},
      }
      this.frames.push(frame);
      console.log((i * w ) / texture.image.width);
    }
    this.geom = new THREE.PlaneBufferGeometry(10, 10, 500, 500);
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.position.y = 0;
    this.mesh.renderOrder = 9999
    this.add(this.mesh);

    this.mesh.material.uniforms.uvOffset.value = new THREE.Vector2(this.frames[0].offset.x,this.frames[0].offset.y);
    this.mesh.material.uniforms.uvScale.value = new THREE.Vector2(this.frames[0].scale.x,this.frames[0].scale.y);
    console.log(this.mesh.material.uniforms.uvOffset.value,this.mesh.material.uniforms.uvScale.value);
    this.tick = 0.3;
    this.speed = 0.2;
  }
  update() {
    this.tick += this.speed;
    const f = Math.floor(this.tick % this.nbOfFrame)
    this.mesh.material.uniforms.uvOffset.value = new THREE.Vector2(this.frames[f].offset.x,this.frames[f].offset.y);
    this.mesh.material.uniforms.uvScale.value = new THREE.Vector2(this.frames[f].scale.x,this.frames[f].scale.y);

  }
}
