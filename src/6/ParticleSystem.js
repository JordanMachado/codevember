const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;


export default class ParticleSystem extends THREE.Object3D {
  constructor(renderer, scene) {
    super();

    const width = 10;
    const height = 10;
    const segmentW = 200;
    const segmentH = 50;

    const triangle = 1;
    const instances = segmentW * segmentH;
    const geom = new THREE.InstancedBufferGeometry();
    geom.maxInstancedCount = instances;
    const size = width / segmentW;
    const vertices = new THREE.BufferAttribute(new Float32Array(triangle * 3 * 2), 2);
    vertices.setXYZ(0, 0, 0, 0);
    vertices.setXYZ(1, size, 0, 0);
    geom.addAttribute('position', vertices);

    const offsets = new THREE.InstancedBufferAttribute(new Float32Array(instances * 3), 3, 1);
    const uv = new THREE.InstancedBufferAttribute(new Float32Array(instances * 2), 2, 1);

    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const gridX = Math.floor(segmentW) || 1;
    const gridY = Math.floor(segmentH) || 1;
    const gridX1 = gridX;
    const gridY1 = gridY;

    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;
    let offset = 0;
    let offset2 = 0;
    let _count = 0;
    for (let iy = 0; iy < gridY1; iy ++) {

      const y = iy * segmentHeight - heightHalf;

      for (let ix = 0; ix < gridX1; ix ++) {

        const x = ix * segmentWidth - widthHalf;
        offsets.setXYZ(_count, x, - y, 0);
        uv.setXY(_count, ix / gridX, 1 - (iy / gridY));
        offset += 3;
        offset2 += 2;
        _count++;
      }

    }
    geom.addAttribute('offsets', offsets);
    geom.addAttribute('uv', uv);
    const scale = new THREE.InstancedBufferAttribute(new Float32Array(instances * 3), 3, 1);
    for (let i = 0, ul = scale.count; i < ul; i++) {
      scale.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    geom.addAttribute('scale', scale);

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 },
      },
      vertexShader: glslify('../shaders/6/index.vert'),
      fragmentShader: glslify('../shaders/6/index.frag'),
      side: THREE.DoubleSide,
      transparent: true,
      linewidth: 2,
    });

    this.mesh = new THREE.Line(geom, this.mat);
    this.add(this.mesh);
    this.tick = 0;
  }
  update(mouse) {
    this.tick += 0.0025;
    this.mesh.material.uniforms.time.value = this.tick;
  }


}
