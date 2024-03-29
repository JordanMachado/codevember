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
    this.renderer.setClearColor(0x2d2d2d);
    this.camera.position.z = 300;


  }
  rayCast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.planeRay, true);
    if (intersects.length > 0) {
      this.mouseWorldPosition.x = intersects[0].point.x;
      this.mouseWorldPosition.y = -intersects[0].point.y;
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

    this.bloom = new Bloom({})
    this.bloom.params.blendMode = 8;
    this.bloom.params.blurAmount = 0.5;
    this.passes.push(this.bloom);

    this.rbg = new RGB({});
    this.rbg.params.delta = new THREE.Vector2(50, 50);
    this.rbg.params.brightness = 1.05;

    this.passes.push(this.rbg);

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

    this.attractPoint = [];
    const geom2 = new THREE.SphereBufferGeometry(1, 10, 10);

    for (let i = 0; i < 10; i++) {
      const reperl = new AttractPoint({ geom: geom2 });
      this.attractPoint.push(reperl);
      // this.scene.add(reperl);
    }
    this.particleSystem = new ParticleSystem(this.renderer, this.scene, this.attractPoint);
    this.particleSystem.position.set(0, 0, 0);
    this.scene.add(this.particleSystem);

  }
  render() {
    super.render();
    this.camera.position.x += ((this.mouse.x * 150) - this.camera.position.x) * 0.01;
    this.camera.position.y += ((this.mouse.y * 150) - this.camera.position.y) * 0.01;
    this.camera.lookAt(this.scene.position);
    if (this.particleSystem) this.particleSystem.update(this.mouseWorldPosition);
  }
}
