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
    this.datatest = new Float32Array(width * height * 4);
    this.dataVel = new Float32Array(width * height * 4);

    const points = THREE.GeometryUtils.randomPointsInGeometry(geom, this.dataPos.length / 3);
    this.geom = new THREE.Geometry();
    this.geom = new THREE.BufferGeometry();

    const vertices = new Float32Array(width * height * 3);
    const uvs = new Float32Array(width * height * 2);
    const colors = new Float32Array(width * height * 3);
    const size = new Float32Array(width * height * 1);

    let count = 0;

    this.colors = [
      'FFFFFF',
      '00171F',
      '003459',
      '007EA7',
      '00A8E8',
    ];
    geom.computeBoundingBox();
    for (let i = 0, l = width * height * 4; i < l; i += 4) {
      //
      // this.dataPos[i] = ((count % width) / width - 0.5) * width;
      // this.dataPos[i + 1] = ((count / width) / height - 0.5) * height;
      // this.dataPos[i + 2] = 0;

      this.dataPos[i] = points[count].x - geom.boundingBox.max.x / 2;
      this.dataPos[i + 1] = points[count].y - geom.boundingBox.max.y / 2;
      this.dataPos[i + 2] = points[count].z;

      this.datatest[i] = this.dataPos[i] + (Math.random() * (10 + 10) - 10);
      this.datatest[i + 1] = this.dataPos[i + 1] + (Math.random() * (10 + 10) - 10);
      this.datatest[i + 2] = this.dataPos[i + 2] + (Math.random() * (10 + 10) - 10);

      this.dataVel[i] = 0.0001;
      this.dataVel[i + 1] = 0.0001;
      this.dataVel[i + 2] = 0.0001;

      uvs[count * 2 + 0] = (count % width) / width;
      uvs[count * 2 + 1] = Math.floor(count / width) / height;

      const color = hexRgb(this.colors[Math.floor(Math.random() * this.colors.length)]);

      colors[count * 3 + 0] = color[0] / 255;
      colors[count * 3 + 1] = color[1] / 255;
      colors[count * 3 + 2] = color[2] / 255;

      size[count * 3] = Math.random() * 3;

      vertices[count * 3 + 0] = this.dataPos[i];
      vertices[count * 3 + 1] = this.dataPos[i + 1];
      vertices[count * 3 + 2] = this.dataPos[i + 2];
      count++;

    }
    this.geom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.geom.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.geom.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geom.addAttribute('size', new THREE.BufferAttribute(size, 1));

    this.textureDataPos = new THREE.DataTexture(
      this.dataPos, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataPostest = new THREE.DataTexture(
      this.datatest, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataPos.minFilter = THREE.NearestFilter;
    this.textureDataPos.magFilter = THREE.NearestFilter;
    this.textureDataPos.needsUpdate = true;

    this.textureDataPostest.minFilter = THREE.NearestFilter;
    this.textureDataPostest.magFilter = THREE.NearestFilter;
    this.textureDataPostest.needsUpdate = true;

    this.textureDataVel = new THREE.DataTexture(
      this.dataVel, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataVel.minFilter = THREE.NearestFilter;
    this.textureDataVel.magFilter = THREE.NearestFilter;
    this.textureDataVel.needsUpdate = true;


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

    this.rtTextureVel = new THREE.WebGLRenderTarget(width, height, {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
      flipY: false,
    });

    this.rtTextureVel2 = this.rtTextureVel.clone();

    this.positionShader = new THREE.ShaderMaterial({
      uniforms: {
        tPositions: {
          type: 't',
          value: this.textureDataPos,
        },
        tPositionstest: {
          type: 't',
          value: this.textureDataPostest,
        },
        tVelocity: {
          type: 't',
          value: this.textureDataVel,
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
      vertexShader: glslify('../shaders/1/simulation.vert'),
      fragmentShader: glslify('../shaders/1/position.frag'),
    });

    this.velocityShader = new THREE.ShaderMaterial({
      uniforms: {
        tVelocity: {
          type: 't',
          value: this.textureDataVel,
        },
        tPositions: {
          type: 't',
          value: this.textureDataPos,
        },
        mouse: {
          type: 'v3',
          value: new THREE.Vector3(),
        },
        origin: {
          type: 't',
          value: this.textureDataVel,
        },
      },
      vertexShader: glslify('../shaders/1/simulation.vert'),
      fragmentShader: glslify('../shaders/1/velocity.frag'),
    });
    this.positionsFBO = new THREE.FBOUtils(width, renderer, this.positionShader);
    this.positionsFBO.renderToTexture(this.rtTexturePos, this.rtTexturePos2);
    this.positionsFBO.in = this.rtTexturePos;
    this.positionsFBO.out = this.rtTexturePos2;

    this.velocityFBO = new THREE.FBOUtils(width, renderer, this.velocityShader);
    this.velocityFBO.renderToTexture(this.rtTextureVel, this.rtTextureVel2);
    this.velocityFBO.in = this.rtTextureVel;
    this.velocityFBO.out = this.rtTextureVel2;

    this.uniforms = {
      map: {
        type: 't',
        value: this.rtTexturePos,
      },
      vel: {
        type: 't',
        value: this.rtTextureVel,
      },
      origin: {
        type: 't',
        value: this.textureDataPos,
      },
      pointSize: {
        type: 'f',
        value: 3.0,
      },
    };
    this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/1/index.vert'),
      fragmentShader: glslify('../shaders/1/index.frag'),
      // blending: THREE.AdditiveBlending,
      transparent: true,
    });


    this.system = new THREE.Points(this.geom, this.mat);


    this.add(this.system);

    this.timer = 0;

  }
  update(mouse) {

    this.velocityShader.uniforms.mouse.value = mouse;
    this.positionShader.uniforms.mouse.value = mouse;

    const tmp = this.positionsFBO.in;
    this.positionsFBO.in = this.positionsFBO.out;
    this.positionsFBO.out = tmp;

    const tmp2 = this.velocityFBO.in;
    this.velocityFBO.in = this.velocityFBO.out;
    this.velocityFBO.out = tmp2;

    this.positionShader.uniforms.tPositions.value = this.positionsFBO.in;
    this.positionShader.uniforms.tVelocity.value = this.velocityFBO.in;
    this.velocityShader.uniforms.tVelocity.value = this.velocityFBO.in;
    this.velocityShader.uniforms.tPositions.value = this.positionsFBO.in;

    this.positionsFBO.simulate(this.positionsFBO.out);
    this.velocityFBO.simulate(this.velocityFBO.out);
    this.uniforms.map.value = this.positionsFBO.out;

  }
}
