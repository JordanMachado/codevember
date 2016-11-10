import AbstractWebGL from '../AbstractWebGL';
import Sphere from './Terrain';

const THREE = require('three');
// window.THREE = THREE;

const RGB = require('@superguigui/wagner/src/passes/rgbsplit/rgbsplit');
const Tilt = require('@superguigui/wagner/src/passes/tiltshift/tiltshiftPass');
const Bloom = require('@superguigui/wagner/src/passes/bloom/MultiPassBloomPass');



export default class WebGl extends AbstractWebGL {
  constructor(params) {
    super(params);
    this.mouseWorldPosition = new THREE.Vector3();
    this.renderer.setClearColor(0xffffff);

    this.camera.position.z = 120;
    window.webGL = this;

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
  mouseMove(x, y, time) {
    super.mouseMove(x,y,time);
    this.rayCast();
  }
  initPostprocessing() {
    super.initPostprocessing();
    this.noisePass.params.speed = 1;
    this.noisePass.params.amount = 0.05;
    this.vignettePass.params.reduction = 0.8;

    this.vignettePass.params.reduction = 0.1;

    this.bloom = new Bloom({})
    this.bloom.params.blendMode = 8;
    this.bloom.params.blurAmount = 0.05;
    this.passes.push(this.bloom);

    this.rbg = new RGB({});
    this.rbg.params.delta = new THREE.Vector2(50, 50);
    this.rbg.params.brightness = 1.05;

    this.passes.push(this.rbg);
    // 
    // this.tilt = new Tilt();
    // this.passes.push(this.tilt);
  }
  initObjects() {

    this.planeRay = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 200),
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
      }));
    this.planeRay.material.visible = false;
    this.scene.add(this.planeRay);

    const loader = new THREE.TextureLoader();
    const heightMap = loader.load('static/img/heightMap.png')
    const normal = loader.load('static/img/normal.jpg');
    const blendMap = loader.load('static/img/blendMap.png');
    const background = loader.load('static/img/grass.png');
    background.wrapS = background.wrapT = THREE.RepeatWrapping;
    const R = loader.load('static/img/block.png');
    R.wrapS = R.wrapT = THREE.RepeatWrapping;
    const G = loader.load('static/img/grass2.png');
    G.wrapS = G.wrapT = THREE.RepeatWrapping;
    const B = loader.load('static/img/beton.png');
    G.wrapS = G.wrapT = THREE.RepeatWrapping;


    this.sphere = new Sphere({
      normal,
      blendMap,
      background,
      R,
      G,
      B,
      heightMap,
    });
    this.scene.add(this.sphere);

  }
  load() {


  }
  render() {
    super.render();
    this.camera.position.x += ((this.mouse.x * 50) - this.camera.position.x) * 0.1;
    this.camera.position.y += ((-this.mouse.y * 10) - this.camera.position.y) * 0.1;
    this.camera.lookAt(this.scene.position);
    this.sphere.update();
  }
}
