import * as THREE from 'three';

const TWEEN = require('es6-tween/bundled/Tween')

const fs: string = `
  uniform sampler2D texture;
  varying float opacity;
  varying vec3 vexColor;

  void main(){
    gl_FragColor = vec4(vexColor,opacity);
    gl_FragColor = gl_FragColor * texture2D(texture,gl_PointCoord);
  }`

const vs: string = `
  attribute float size;
  attribute vec4 colors;
  varying float opacity;
  varying vec3 vexColor;

  void main(){
    vexColor.x = colors.r;
    vexColor.y = colors.g;
    vexColor.z = colors.b;
    // w 分量为透明度
    opacity = colors.w;
    vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }`

/**
* 粒子飞线
*/
export default class PointsFlyLine {
  // 粒子位置
  geometry: THREE.BufferGeometry;
  // 曲线
  spline: THREE.CatmullRomCurve3;
  // 粒子系统
  particleSystem: THREE.Points;
  // 粒子数目
  pointNum: number;
  // 粒子间的总距离
  distance: number;
  points: THREE.Vector3[];
  tween: any;

  /**
  * 创建粒子系统
  * @param points 粒子
  * @param size 粒子大小
  * @param num 粒子数目
  * @param color 粒子颜色
  */
  constructor({ vecs, num, size, color }: {
    vecs: THREE.Vector3[];
    num: number;
    size: number;
    color: THREE.Color;
  }) {
      this.spline = new THREE.CatmullRomCurve3(vecs);
      this.pointNum = num;
      this.distance = this.spline.getLength();
      //初始化粒子
      this.points = this.spline.getPoints(num);
      const colorsLen = this.points.length * 4;
      const sizeLen = this.points.length;
      const colors: Float32Array = new Float32Array(colorsLen);
      const sizes: Float32Array = new Float32Array(sizeLen);
      this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
      for (let i = 0, z = 0; i < colorsLen; i += 4, z++) {
        // color
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
        // opacity
        colors[i + 3] = (i + 3) / sizeLen;
        // size 从小到大
        sizes[z] = size * (z / sizeLen);
      }
      
      // this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
      this.geometry.addAttribute('colors', new THREE.BufferAttribute(colors, 4));
      this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const uniforms = {
        texture: {
          value: new THREE.CanvasTexture(this.createSpriteCanvas(size)),
        }
      };
      const shaderMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        depthTest: false
      });
      this.particleSystem = new THREE.Points(this.geometry, shaderMaterial);
    }

    // 飞线开始
    start() {
      const max = this.distance * 10;
      const end: number = this.pointNum;
      const m = {
        start: 0,
        end
      };
      this.tween = this.tweenAnimate(m, {
        start: max - end,
        end: max
      }, 2000, null, () => {
          let pointArr: number[] = [];
          let s = Math.round(m.start),
              e = Math.floor(m.end);
              
          for (let i = s; i <= e && i <= max; i++) {
            pointArr = pointArr.concat(this.spline.getPointAt(i / max).toArray());
          }
          this.geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(pointArr), 3);
      });
      this.tween.repeat(Infinity).start();
    }

    stop() {
      this.tween.stop();
    }

    tweenAnimate(current: object, target: object, interval: number, animation?: any, onUpdate? : Function, complete?: Function) {
      var animate = animation ? animation : TWEEN.Easing.Linear.None;
      let tween = new TWEEN.Tween(current).to(target, interval).easing(animate);
      // onUpdate && tween.onUpdate(() => onUpdate());
      onUpdate && tween.on('update', () => {onUpdate()})
      // complete && tween.onComplete(() => complete());
      complete && tween.on('complete', () => {complete()})
      return tween;
    }

    // 创建圆形精灵贴图
    createSpriteCanvas(size: number) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const context = canvas.getContext('2d');
      if (context != null) {
        context.fillStyle = 'rgba(255, 255, 255, .0)';
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
      }
      return canvas
    }
}