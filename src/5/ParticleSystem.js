const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;


export default class ParticleSystem extends THREE.Object3D {
  constructor(renderer, scene, attractPoints) {
    super();
    const width = 512;
    const height = 512;


    const triangle = 1;
    const instances = width * height;
    const geom = new THREE.InstancedBufferGeometry();
    geom.maxInstancedCount = instances;
    const size = 0.125;
    const vertices = new THREE.BufferAttribute(new Float32Array(triangle * 3 * 3), 3);
    vertices.setXYZ(0, size, -size, 0);
    vertices.setXYZ(1, -size, size, 0);
    vertices.setXYZ(2, 0, 0, size);
    geom.addAttribute('position', vertices);

    const scale = new THREE.InstancedBufferAttribute(new Float32Array(instances * 3), 3, 1);
    for (let i = 0, ul = scale.count; i < ul; i++) {
      scale.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    geom.addAttribute('scale', scale);

    const uv = new THREE.InstancedBufferAttribute( new Float32Array( instances * 2), 2, 1 );

    for ( var i = 0, ul = uv.count; i < ul; i++ ) {
      uv.setXY(i, ( i % width ) / width,  Math.floor( i / width ) / height )
    }

    geom.addAttribute('uv', uv);

    this.colors = [
      '16e539',
      '211dd6',
    ];
    const colors = new THREE.InstancedBufferAttribute(new Float32Array(instances * 3), 3, 1);
    for (let i = 0, ul = colors.count; i < ul; i++) {
      const color = hexRgb(this.colors[Math.floor(Math.random() * this.colors.length)]);

      colors.setXYZ(i,color[0] / 255, color[1] / 255, color[2] / 255);
    }
    geom.addAttribute('color', colors);

    const orientationsStart = new THREE.InstancedBufferAttribute(new Float32Array(instances * 4), 4, 1);
    const vector = new THREE.Vector4();
    for (let i = 0, ul = orientationsStart.count; i < ul; i++) {
      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1, Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();
      orientationsStart.setXYZW(i, vector.x, vector.y, vector.z, vector.w);
    }
    geom.addAttribute('orientationStart', orientationsStart);

    this.data = new Float32Array(instances * 4);
    let count = 0
    for (let i = 0, l = instances * 4; i < l; i += 4) {
      this.data[count] = Math.random();
      this.data[count + 1] = Math.random();
      this.data[count + 2] = Math.random();
      this.data[count + 3] = Math.random();
      count ++;
    }

    this.textureDataPos = new THREE.DataTexture(
    this.data, width, height, THREE.RGBAFormat, THREE.FloatType);
    this.textureDataPos.minFilter = THREE.NearestFilter;
    this.textureDataPos.magFilter = THREE.NearestFilter;
    this.textureDataPos.needsUpdate = true;

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
        mouse: {
          type: 'v3',
          value: new THREE.Vector3(),
        },
        origin: {
          type: 't',
          value: this.textureDataPos,
        },
      },
      vertexShader: glslify('../shaders/5/simulation.vert'),
      fragmentShader: glslify('../shaders/5/position.frag'),
    });
    this.positionsFBO = new THREE.FBOUtils(width, renderer, this.positionShader);
    this.positionsFBO.renderToTexture(this.rtTexturePos, this.rtTexturePos2);
    this.positionsFBO.in = this.rtTexturePos;
    this.positionsFBO.out = this.rtTexturePos2;


    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        map: {
          type: 't',
          value: this.rtTexturePos,
        },
        sineTime: { value: 1.0 },
      },
      vertexShader: glslify('../shaders/5/index.vert'),
      fragmentShader: glslify('../shaders/5/index.frag'),
      side: THREE.DoubleSide,
      transparent: true,
    });


    this.mesh = new THREE.Mesh(geom, this.mat);
    this.add(this.mesh);

  }
  updateMouse(mouse) {
    TweenMax.to(this.positionShader.uniforms.mouse.value, 0.8, {
      x: mouse.x,
      y: mouse.y,
      z: mouse.z,
    });
  }
  update(mouse) {
    const tmp = this.positionsFBO.in;
    this.positionsFBO.in = this.positionsFBO.out;
    this.positionsFBO.out = tmp;

    this.positionShader.uniforms.tPositions.value = this.positionsFBO.in;
    // this.positionShader.uniforms.mouse.value = mouse;

    this.positionsFBO.simulate(this.positionsFBO.out);
    this.mesh.material.uniforms.map.value = this.positionsFBO.out;
    this.mesh.rotation.y += 0.001;

  }


}
