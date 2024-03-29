import AbstractWebGL from '../AbstractWebGL';
import ParticleSystem from './ParticleSystem';

const THREE = require('three');
window.THREE = THREE;

export default class WebGl extends AbstractWebGL {
  constructor(params) {
    super(params);
    this.mouseWorldPosition = new THREE.Vector3();
    this.renderer.setClearColor(0xe8e8e8);



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
    super.mouseMove(x, y, time);
    this.rayCast();
  }
  touchMove(touchList) {
    const touch = touchList[0];
    this.originalMouse.x = touchList[0].clientX;
    this.originalMouse.y = touchList[0].clientY;
    this.mouse.x = (touchList[0].clientX / window.innerWidth - 0.5) * 2;
    this.mouse.y = (touchList[0].clientY / window.innerHeight - 0.5) * 2;
    this.rayCast();
  }
  initPostprocessing() {
    super.initPostprocessing();
    this.noisePass.params.speed = 1;
    this.noisePass.params.amount = 0.05;
    this.vignettePass.params.reduction = this.params.device === 'desktop' ? 0.8 : 0.3;
  }
  initObjects() {

    this.planeRay = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(400, 200),
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
      }));
    this.planeRay.material.visible = false;
    this.scene.add(this.planeRay);

    const loader = new THREE.FontLoader();
    loader.load('static/fonts/Brandon Grotesque Regular_Regular.js', (font) => {
      const geom = new THREE.TextGeometry('# CODEVEMBER', {
        font,
        size: 10,
        height: 1,
      });

      this.particleSystem = new ParticleSystem(this.renderer, this.scene, geom);
      this.particleSystem.position.set(0, 0, 0);
      this.scene.add(this.particleSystem);
    });
  }
  render() {
    super.render();
    this.camera.position.x += ((this.mouse.x * 30) - this.camera.position.x) * 0.1;
    this.camera.position.y += ((this.mouse.y * 30) - this.camera.position.y) * 0.1;
    this.camera.lookAt(this.scene.position);
    if (this.particleSystem) this.particleSystem.update(this.mouseWorldPosition);
  }
}
