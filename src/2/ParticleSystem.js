const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;


export default class ParticleSystem extends THREE.Object3D {
  constructor(renderer, scene, geom) {
    super();

    const width = 256;
    const height = 256;
    this.dataPos = new Float32Array(width * height * 4);
    this.dataInfo = new Float32Array(width * height * 4);
    this.geom = new THREE.BufferGeometry();

    const vertices = new Float32Array(width * height * 3);
    const uvs = new Float32Array(width * height * 2);
    const size = new Float32Array(width * height * 1);

    let count = 0;
    for (let i = 0, l = width * height * 4; i < l; i += 4) {

      this.dataPos[i] = ((count % width) / width - 0.5) * width;
      this.dataPos[i + 1] = ((count / width) / width - 0.5) * width;
      this.dataPos[i + 2] = 0;

      this.dataInfo[i] = Math.random() * 5;
      this.dataInfo[i + 1] = Math.random();
      this.dataInfo[i + 2] = Math.random() * 0.5;


      uvs[count * 2 + 0] = (count % width) / width;
      uvs[count * 2 + 1] = Math.floor(count / width) / height;


      size[count * 3] = Math.abs(((count % width) / width - 0.5) + ((count / width) / width - 0.5)) * 10;

      vertices[count * 3 + 0] = this.dataPos[i];
      vertices[count * 3 + 1] = this.dataPos[i + 1];
      vertices[count * 3 + 2] = this.dataPos[i + 2];
      count++;

    }
    this.geom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.geom.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.geom.addAttribute('size', new THREE.BufferAttribute(size, 1));

    this.textureDataPos = new THREE.DataTexture(
      this.dataPos, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataInfo = new THREE.DataTexture(
      this.dataInfo, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataPos.minFilter = THREE.NearestFilter;
    this.textureDataPos.magFilter = THREE.NearestFilter;
    this.textureDataPos.needsUpdate = true;

    this.textureDataInfo.minFilter = THREE.NearestFilter;
    this.textureDataInfo.magFilter = THREE.NearestFilter;
    this.textureDataInfo.needsUpdate = true;

    this.rtTexturePos = new THREE.WebGLRenderTarget(width, height, {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
      flipY: false,
    });

    this.rtTexturePos2 = this.rtTexturePos.clone();


    this.positionShader = new THREE.ShaderMaterial({
      uniforms: {
        tPositions: {
          type: 't',
          value: this.textureDataPos,
        },
        tInfos: {
          type: 't',
          value: this.textureDataInfo,
        },
        mouse: {
          type: 'v3',
          value: new THREE.Vector3(),
        },
        origin: {
          type: 't',
          value: this.textureDataPos,
        },
      },
      vertexShader: glslify('../shaders/2/simulation.vert'),
      fragmentShader: glslify('../shaders/2/position.frag'),
    });

    this.positionsFBO = new THREE.FBOUtils(width, renderer, this.positionShader);
    this.positionsFBO.renderToTexture(this.rtTexturePos, this.rtTexturePos2);
    this.positionsFBO.in = this.rtTexturePos;
    this.positionsFBO.out = this.rtTexturePos2;


    this.uniforms = {
      map: {
        type: 't',
        value: this.rtTexturePos,
      },
      pointSize: {
        type: 'f',
        value: 3.0,
      },
      color: {
        type: 'v3',
        value: hexRgb(Math.floor(Math.random() * 16777215).toString(16)),
      },
    };
    this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/2/index.vert'),
      fragmentShader: glslify('../shaders/2/index.frag'),
      // blending: THREE.AdditiveBlending,
      // transparent: true,
      linewidth: 3,
    });


    this.system = new THREE.Points(this.geom, this.mat);


    this.add(this.system);

    this.timer = 0;

  }
  click() {
    this.uniforms.color.value = hexRgb(Math.floor(Math.random() * 16777215).toString(16));
  }
  update(mouse) {

    this.positionShader.uniforms.mouse.value = mouse;

    const tmp = this.positionsFBO.in;
    this.positionsFBO.in = this.positionsFBO.out;
    this.positionsFBO.out = tmp;

    this.positionShader.uniforms.tPositions.value = this.positionsFBO.in;
    this.positionsFBO.simulate(this.positionsFBO.out);
    this.uniforms.map.value = this.positionsFBO.out;

  }
}
