import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import PointsFlyLine from './PointsFlyLine'

const PolylineMaterial = () => {

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
      let cube = new PointsFlyLine({
        vecs: points,
        num: 100,
        size: 10,
        color: new THREE.Color(0x009900)
      })
      cube.start()
      scene.add(cube.particleSystem);
	}

	useEffect(() => {
		init()
	}, [])

	return (
		<div ref={dom}>
		</div>
	)
}

export default PolylineMaterial