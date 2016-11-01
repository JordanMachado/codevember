const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;


export default class ParticleSystem extends THREE.Object3D {
  constructor(renderer, scene, attractPoints) {
    super();
    this.geom = new THREE.SphereBufferGeometry(50,72,72);
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 },
      },
      vertexShader: glslify('../shaders/8/index.vert'),
      fragmentShader: glslify('../shaders/8/index.frag'),
      side: THREE.BackSide,
      wireframe: false,
      transparent: true,
      // linewidth: 2,
    });

    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.add(this.mesh);
    this.tick = 0;
  }
  update(mouse) {
    this.tick += 0.0025;
    console.log();
    this.mesh.material.uniforms.time.value = this.tick;
  }


}
