import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { TrackballControls } from 'three-trackballcontrols-ts'
import { scatterCircle } from './ScatterCircle'

const FirstScene = () => {

	const dom = useRef<HTMLDivElement>(null)

	const init = () => {
		// 开启显示动画运行时的帧数
		const scene = new THREE.Scene()
		
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
		const renderer = new THREE.WebGLRenderer()
		// webgl 清空背景色
		renderer.setClearColor(new THREE.Color(0x000000))
		// 设置场景大小
		renderer.setSize(window.innerWidth, window.innerHeight)
		// 设置需要阴影效果——需要设置阴影的提供者以及阴影的消费者
		renderer.shadowMap.enabled = true

		// 用于简单模拟 3 个坐标轴的对象,红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴. 参数 20 为轴线的粗细值
		const axes = new THREE.AxesHelper(20)
		scene.add(axes)
	
		// 添加一个平面
		const planeGeometry = new THREE.PlaneGeometry(60, 20)
		const planeMaterial = new THREE.MeshLambertMaterial({
			color: 0xAAAAAA
		})
	
		const plane = new THREE.Mesh(planeGeometry, planeMaterial)
		plane.rotation.x = -0.5 * Math.PI
		plane.position.set(15, 0 ,0)
		// 阴影接收者
		plane.receiveShadow = true
		scene.add(plane)
	
		const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
		const cubeMaterial = new THREE.MeshLambertMaterial({
			color: 0xFF0000,
			// 是否显示线框
			// wireframe: true
		})
	
		const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
		cube.position.set(-4, 2, 0)
		cube.castShadow = true
		scene.add(cube)
	
		const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
		// 基本材质不会对光源有反应，基本材质只会使用指定的颜色来渲染物体
		const sphereMaterail = new THREE.MeshLambertMaterial({
			color: 0x7777FF,
			// wireframe: true
		})
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterail)
		sphere.position.set(20, 4, 2)
		sphere.castShadow = true
		scene.add(sphere)
		
	
		// 设置相机的位置
		camera.position.set(-30, 40, 30)
		// 相机指向场景中心——默认指向 (0, 0, 0)
		camera.lookAt(scene.position)
	
		// 添加点光源
		const spotLight = new THREE.SpotLight(0xFFFFFF)
		spotLight.position.set(-40, 40, -15)
		// 是否显示阴影
		spotLight.castShadow = true
		spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
		spotLight.shadow.camera.far = 130
		spotLight.shadow.camera.near = 40
		
		scene.add(spotLight)


    let circle = scatterCircle(1, 0.1, 0.3, new THREE.Vector3(0, 1, 1), 0.02);
    circle.position.set(0, 1, 1);
    scene.add(circle);

		// 渲染
		if (dom.current){
		  dom.current.appendChild(renderer.domElement)
		}
		const trackballControls = new TrackballControls((camera as any), renderer.domElement)
		const clock = new THREE.Clock()

		const controls = {
			rotationSpeed: 0.02,
			bouncingSpeed: 0.03
		}
		// 定义 dataGUI
		const gui = new dat.GUI()
		// 设置取值范围
		gui.add(controls, 'rotationSpeed', 0, 0.5)
		gui.add(controls, 'bouncingSpeed', 0, 0.5)

		let step = 0
		const renderScene = () => {		
			(trackballControls as any).update(clock.getDelta())
			
			if ((window as any).statusAB instanceof Object) {
				(window as any).statusAB.update()
			}

			// 旋转立方体
			cube.rotation.x += controls.rotationSpeed
			cube.rotation.y += controls.rotationSpeed
			cube.rotation.z += controls.rotationSpeed

			// 让小球弹跳起来
			// 定义了球体的弹跳速度
			step += controls.bouncingSpeed
			sphere.position.x = 20 + 10 * (Math.cos(step))
			sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

			requestAnimationFrame(renderScene)
			renderer.render(scene, camera)
		}
		
		renderScene()

		const onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
		}
		window.addEventListener('resize', onResize, false)
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