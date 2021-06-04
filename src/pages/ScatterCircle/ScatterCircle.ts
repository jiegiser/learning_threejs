import * as THREE from 'three'
// r 圆半径
//init 初始圆半径
//ring 圆环大小
//color 颜色 THREE.Vector3
//speed 速度
function scatterCircle(r: number, init: number, ring: number, color: THREE.Vector3, speed: number) {
	var uniform = {
		u_color: { value: color },
		u_r: { value: init },
		u_ring: {
			value: ring,
		},
	};

	var vs = `
		varying vec3 vPosition;
		void main(){
			vPosition=position;
			gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;
	var fs = `
		varying vec3 vPosition;
		uniform vec3 u_color;
		uniform float u_r;
		uniform float u_ring;

		void main(){
			float pct=distance(vec2(vPosition.x,vPosition.y),vec2(0.0));
			if(pct>u_r || pct<(u_r-u_ring)){
				gl_FragColor = vec4(1.0,0.0,0.0,0);
			}else{
				float dis=(pct-(u_r-u_ring))/(u_r-u_ring);
				gl_FragColor = vec4(u_color,dis);
			}
		}
	`;
	const geometry = new THREE.CircleGeometry(r, 120);
	var material = new THREE.ShaderMaterial({
		vertexShader: vs,
		fragmentShader: fs,
		side: THREE.DoubleSide,
		uniforms: uniform,
		transparent: true,
		depthWrite: false,
	});
	const circle = new THREE.Mesh(geometry, material);

	function render() {
		uniform.u_r.value += speed || 0.1;
		if (uniform.u_r.value >= r) {
			uniform.u_r.value = init;
		}
		requestAnimationFrame(render);
	}
	render();

	return circle;
}

// eslint-disable-next-line import/no-anonymous-default-export
export {
  scatterCircle
}