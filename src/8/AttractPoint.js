const THREE = require('three');


import hexRgb from 'hex-rgb';
const glslify = require('glslify');


export default class Sphere extends THREE.Object3D {
  constructor({ geom }) {
    super();
    this.tick = 0;
    this.mass = 10;
    // this.mass = 50;
    this.repulsion = Math.random() * 20;

    this.geom = geom;

    this.mat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      // normalMap: normal,
    });

    this.mesh = new THREE.Mesh(this.geom, this.mat);
    const scale = Math.abs(this.repulsion) * 0.2;
    this.mesh.scale.set(scale, scale, scale);
    this.mesh.position.x = Math.random() * (100 + 100) - 100;
    this.mesh.position.y = Math.random() * (100 + 100) - 100;
    this.mesh.position.z = Math.random() * (100 + 100) - 100;
    // this.repulsion = (Math.random() * (1 + 1) - 1) * this.mass *2;


    this.init = this.mesh.position.clone();
    this.rand = (Math.random() * (1 + 1) - 1) * 0.08;
    this.mouse = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.force = new THREE.Vector3();


    this.add(this.mesh);

  }
  updateMouse(mouse) {
    this.mouse = mouse;

  }
  update() {
    this.tick += this.rand;
    // this.force.x = this.mouse.x - this.mesh.position.x;
    // this.force.y = this.mouse.y - this.mesh.position.y;
    // this.force.z = this.mouse.z - this.mesh.position.z;
    //
    // let dist = this.force.length();
    // dist = Math.min(Math.max(dist, 1), 20);
    // this.force.normalize();
    // const strength = (2 * 30 * this.mass) / (dist * dist);
    // this.force.multiplyScalar(strength);
    // this.force.divideScalar(this.mass);
    // this.vel.add(this.force);
    //
    // this.mesh.position.add(this.vel);
    this.mesh.position.x = this.init.x + Math.cos(this.tick) * 20;
    this.mesh.position.y = this.init.y + Math.sin(this.tick) * 20;
    this.mesh.position.z = this.init.z + Math.sin(this.tick) * 20;

  }
}
