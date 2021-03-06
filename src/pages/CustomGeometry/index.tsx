import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const FirstScene = () => {

	const dom = useRef<HTMLDivElement>(null)

	const init = () => {
		const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 50;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // 添加坐标轴辅助工具
      const axesHelper = new THREE.AxesHelper(100);
      scene.add(axesHelper);

      // 控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; // 启用阻尼（惯性），这将给控制器带来重量感，如果该值被启用，必须在动画循环里调用.update()
      controls.dampingFactor = 0.05; // 阻尼惯性大小
      controls.update();

      const point1 = [50, 0, 0]; // 点1坐标
      const point2 = [-50, 0, 0]; // 点2坐标
      const controlPoint = [0, 50, 0]; // 控制点坐标

      // 创建三维二次贝塞尔曲线
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(controlPoint[0], controlPoint[1], controlPoint[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2])
      );
      const divisions = 30; // 曲线的分段数量
      const points = curve.getPoints(divisions); // 返回 分段数量 + 1 个点，例如这里的points.length就为31
      console.log(points, 'points')
      const geometry = new THREE.Geometry();
      geometry.vertices = points;
      // 设置顶点 colors 数组，与顶点数量和顺序保持一致。
      geometry.colors = new Array(points.length).fill(
        new THREE.Color('#333300')
      );
      // 生成材质
      const material = new (THREE as any).LineBasicMaterial({
        vertexColors: THREE.VertexColors,
        transparent: true, // 定义此材质是否透明
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Line(geometry, material);
      scene.add(mesh);

      let colorIndex = 0; // 高亮颜色流动的索引值
      let timestamp = 0; // 时间戳
      // console.log('animate')
      // 动画
      function animate() {
        // controls.enableDamping设为true时（启用阻尼），必须在动画循环里调用.update()
        controls.update();
        // 时间间隔
        let now = new Date().getTime();
        if (now - timestamp > 30) {
          geometry.colors = new Array(divisions + 1)
            .fill(new THREE.Color('#333300'))
            .map((color, index) => {
              if (index === colorIndex) {
                return new THREE.Color('#ffff00');
              }
              return color;
            })
          // console.log(geometry.colors)
          // 如果 geometry.colors 数据发生变化，colorsNeedUpdate 值需要被设置为 true
          geometry.colorsNeedUpdate = true;
          timestamp = now;
          colorIndex++;
          if (colorIndex > divisions) {
            colorIndex = 0;
          }
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();
	}

	useEffect(() => {
		init()
	}, [])

	return (
		<div ref={dom}>
		</div>
	)
}

export default FirstScene