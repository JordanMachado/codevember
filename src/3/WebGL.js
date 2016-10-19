import AbstractWebGL from '../AbstractWebGL';
import Plane from './Plane';


const THREE = require('three');
window.THREE = THREE;
import BlurPass from '../postprocessing/blur/BlurPass';

const RGB = require('@superguigui/wagner/src/passes/rgbsplit/rgbsplit');
const Tilt = require('@superguigui/wagner/src/passes/tiltshift/tiltshiftPass');
const Bloom = require('@superguigui/wagner/src/passes/bloom/MultiPassBloomPass');


export default class WebGl extends AbstractWebGL {
  constructor(params) {
    super(params);
    this.mouseWorldPosition = new THREE.Vector3();
    this.renderer.setClearColor(0xe8e8e8);
    this.camera.position.z = 30;
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
    this.blurPass = new BlurPass({})
    this.bloom = new Bloom({})
    this.bloom.params.blendMode = 3;
    // this.passes.push(this.bloom);

    this.rbg = new RGB({});
    this.rbg.params.delta = new THREE.Vector2(50, 50);
    this.rbg.params.brightness = 1.05;

    this.passes.push(this.rbg);

    this.tilt = new Tilt();
    this.passes.push(this.tilt);
    // this.passes.push(this.blurPass);
  }
  initObjects() {

    this.planeRay = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 200),
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
      }));
    this.planeRay.material.visible = false;
    this.scene.add(this.planeRay);
    this.plane = new Plane();
    this.scene.add(this.plane);

  }
  render() {
    super.render();
    this.plane.update();
    // this.camera.position.x += ((this.mouse.x * 5) - this.camera.position.x) * 0.05;
    // this.camera.position.y += ((this.mouse.y * 5) - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

  }
  click() {
    this.particleSytem.click();
  }
}
