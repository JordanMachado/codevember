import AbstractWebGL from '../AbstractWebGL';
import AttractPoint from './AttractPoint';
import ParticleSystem from './ParticleSystem';

const THREE = require('three');
// window.THREE = THREE;

const RGB = require('@superguigui/wagner/src/passes/rgbsplit/rgbsplit');
const Tilt = require('@superguigui/wagner/src/passes/tiltshift/tiltshiftPass');
const Bloom = require('@superguigui/wagner/src/passes/bloom/MultiPassBloomPass');



export default class WebGl extends AbstractWebGL {
  constructor(params) {
    super(params);
    this.mouseWorldPosition = new THREE.Vector3();
    this.renderer.setClearColor(0xFFFFFF);
    this.renderer.setClearColor(0x1e1e1e);

    this.camera.position.z = 200;


  }
  rayCast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.planeRay, true);
    if (intersects.length > 0) {
      this.mouseWorldPosition.x = intersects[0].point.x;
      this.mouseWorldPosition.y = -intersects[0].point.y;
      // this.particleSystem.updateMouse(this.mouseWorldPosition)
    }
  }
  click(x, y, time) {
    super.click(x, y, time);
    for (var i = 0; i < this.cubes.length; i++) {
      const time = Math.random() * (1 - 0.5) + 0.5;
      TweenLite.to(this.cubes[i].position, time,{
        x: Math.random() * (40 + 40) - 40,
        y: Math.random() * (40 + 40) - 40,
        z: Math.random() * (40 + 40) - 40,
        ease: Quad.easeOut
      })
    }
  }
  mouseMove(x, y, time) {
    super.mouseMove(x,y,time);
    this.rayCast();
  }
  initPostprocessing() {
    super.initPostprocessing();
    this.noisePass.params.speed = 1;
    this.noisePass.params.amount = 0.05;
    this.vignettePass.params.reduction = 0.8;
    //
    // this.bloom = new Bloom({})
    // this.bloom.params.blendMode = 8;
    // this.bloom.params.blurAmount = 0.5;
    // this.passes.push(this.bloom);
    //
    // this.rbg = new RGB({});
    // this.rbg.params.delta = new THREE.Vector2(50, 50);
    // this.rbg.params.brightness = 1.05;
    //
    // this.passes.push(this.rbg);

    this.tilt = new Tilt();
    this.passes.push(this.tilt);
  }
  initObjects() {

    this.planeRay = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 200),
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
      }));
    this.planeRay.material.visible = false;
    this.scene.add(this.planeRay);

    const cubes = this.cubes = [];
    const colors = [
      '#FF2712', // red
      '#FFFF33',
      '#0044FE',
      '#000000',
      '#FFFFFF',
    ];

    const cube = new THREE.Mesh(new THREE.CubeGeometry(
      130,
      130,
      10),
      new THREE.MeshBasicMaterial({
      color:0XFFFFFF
    }));
    cube.position.z = -50
    window.cube = cube;
    this.scene.add(cube);

    for (let i = 0; i < 20; i++) {

      const rand1 =   Math.random() * (40 - 10) + 10;
      const rand2 =   Math.random() * (40 - 10) + 10;
      const rand3 =   Math.random() * (20 - 10) + 10;
      const cube = new THREE.Mesh(new THREE.CubeGeometry(
        rand1,
        rand2,
        rand3),
        new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

      const cube2 = new THREE.Mesh(new THREE.CubeGeometry(
        rand1,
        rand2,
        rand3),
        new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
        color: 0x000000,
      }));
      cube2.scale.set(1.05,1.05,1.05);
      cube.add(cube2);
      cubes.push(cube);
      cube.position.x = Math.random() * (40 + 40) - 40;
      cube.position.y = Math.random() * (40 + 40) - 40;
      cube.position.z = Math.random() * (40 + 40) - 40;
      this.scene.add(cube);
    }

  }
  render() {
    super.render();
    this.camera.position.x += ((this.mouse.x * 150) - this.camera.position.x) * 0.1;
    this.camera.position.y += ((this.mouse.y * 150) - this.camera.position.y) * 0.1;
    this.camera.lookAt(this.scene.position);
    // if (this.particleSystem) this.particleSystem.update(this.mouseWorldPosition);
  }
}
