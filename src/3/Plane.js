const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;

export default class Plane extends THREE.Object3D {
  constructor() {
    super();

    this.geom = new THREE.PlaneBufferGeometry(20, 20, 100, 100);
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: glslify('../shaders/3/index.vert'),
      fragmentShader: glslify('../shaders/3/index.frag'),
      wireframe: true,
      transparent: true,
      wireframeLinewidth: 3,
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat)
    this.add(this.mesh);
  }
  update() {
    this.mesh.material.uniforms.time.value += 0.0025;

  }
}
