const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;


export default class Sphere extends THREE.Object3D {
  constructor({ normal, lit }) {
    super();
    this.light = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 72, 72), new THREE.MeshBasicMaterial({
      color: 0xaffcff
    }))
    this.light.position.x = this.light.position.y = 10;
    window.light = this.light;
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        tMatCap: {
          type: 't',
          value: lit,
        },
        tNormal: {
          type: 't',
          value: normal,
        },
        time: {
          type: 'f',
          value: 0,
        },
        Resolution: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        LightPos: {
          type: 'v3',
          value: this.light.position,
        },
      },
      vertexShader: glslify('../shaders/10/vertex.glsl'),
      fragmentShader: glslify('../shaders/10/fragment.glsl'),
      transparent: true,
    });
    this.geom = new THREE.SphereBufferGeometry(12, 72, 72);

    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.add(this.light)

    this.add(this.mesh);

    this.tick = 0;
  }
  update(mouse) {

    this.tick += 0.001;
    this.mesh.material.uniforms.LightPos.value = this.light.position;
    this.mesh.material.uniforms.time.value = this.tick;
    this.light.position.x = Math.cos(this.tick * 3) * 20;
    this.light.position.y = Math.sin(this.tick * 3) * 20;
  }


}
