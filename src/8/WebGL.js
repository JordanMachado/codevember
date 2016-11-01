import AbstractWebGL from '../AbstractWebGL';
import AttractPoint from './AttractPoint';
import Env from './Env';

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

    this.camera.position.z = 80;
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

    const cubes = [];
    const colors = [
      '#FF2712', // red
      '#FFFF33',
      '#0044FE',
      '#000000',
      '#FFFFFF',
    ];
    this.cubeCamera1 = new THREE.CubeCamera( 1, 1000, 512 );
    this.cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    this.scene.add( this.cubeCamera1 );
    const cube = this.cube = new THREE.Mesh(new THREE.CubeGeometry(
      10,
      10,
      10),
      new THREE.MeshBasicMaterial({
      color:0XFFFFFF,
      envMap: this.cubeCamera1.renderTarget.texture

    }));
    this.env = new Env({})
    this.scene.add(this.env);
    cube.position.z = 0
    window.cube = cube;
    // this.scene.add(cube);

  }
  render() {
    super.render();
    this.cube.visible = false;
    this.cubeCamera1.updateCubeMap(this.renderer, this.scene);
    this.cube.visible = true;
    this.camera.position.x += ((this.mouse.x * 50) - this.camera.position.x) * 0.1;
    this.camera.position.y += ((this.mouse.y * 50) - this.camera.position.y) * 0.1;
    this.camera.lookAt(this.scene.position);
    this.env.update();
  }
}
