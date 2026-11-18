'use no memo'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type MascotFocusTarget = 'none' | 'username' | 'password'
export type MascotActionType = 'nod' | 'shake'
export type MascotAction = { type: MascotActionType; id: number }

type LoginMascotProps = {
	action: MascotAction | null
	focusTarget: MascotFocusTarget
	passwordVisible: boolean
	usernameProgress: number
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

const LoginMascot: React.FC<LoginMascotProps> = ({ action, focusTarget, passwordVisible, usernameProgress }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const cuesRef = useRef({ action, focusTarget, passwordVisible, usernameProgress })
	const redrawRef = useRef<(() => void) | null>(null)
	cuesRef.current = { action, focusTarget, passwordVisible, usernameProgress }

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		// The reference was authored with three r128 (no color management, legacy light units).
		// Mirror that so colors and shading match the original.
		const previousColorManagement = THREE.ColorManagement.enabled
		THREE.ColorManagement.enabled = false

		let renderer: THREE.WebGLRenderer
		try {
			renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
		} catch (error) {
			THREE.ColorManagement.enabled = previousColorManagement
			console.error('Unable to initialize the login mascot WebGL renderer.', error)
			return
		}

		renderer.outputColorSpace = THREE.LinearSRGBColorSpace
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
		renderer.setClearColor(0x000000, 0)
		renderer.setSize(192, 192, false)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFShadowMap

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
		camera.position.set(0, 0.55, 8)
		scene.add(new THREE.AmbientLight(0xffffff, 0.85 * Math.PI))

		const light = new THREE.DirectionalLight(0xffffff, 0.45 * Math.PI)
		light.position.set(3, 4, 5)
		light.castShadow = true
		light.shadow.mapSize.set(1024, 1024)
		Object.assign(light.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 20 })
		light.shadow.bias = -0.0015
		light.shadow.normalBias = 0.03
		light.shadow.radius = 2
		scene.add(light)

		// r128 Lambert ignored flatShading (per-vertex lighting), so the reference is smooth-shaded.
		const lambert = (color: number) => new THREE.MeshLambertMaterial({ color })
		const headMaterial = lambert(0xcfcfcf)
		const hatMaterial = lambert(0x262626)
		const strapMaterial = lambert(0x525252)
		const clipMaterial = lambert(0xe5e5e5)
		const earMaterial = lambert(0x404040)
		const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0a0a })

		const head = new THREE.Group()
		scene.add(head)

		const addMesh = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) => {
			const mesh = new THREE.Mesh(geometry, material)
			mesh.position.set(x, y, z)
			head.add(mesh)
			return mesh
		}

		addMesh(new THREE.CylinderGeometry(1, 1, 0.8, 28).scale(1.25, 1, 1.12), headMaterial, 0, -0.05, 0)
		addMesh(new THREE.CylinderGeometry(0.65, 1, 0.3, 28).scale(1.25, 1, 1.12), headMaterial, 0, 0.5, 0)
		addMesh(
			new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2).scale(1.25, 0.5, 1.12),
			headMaterial,
			0,
			-0.45,
			0
		)

		const eyeShape = new THREE.Shape()
		eyeShape.moveTo(-0.13, -0.14)
		eyeShape.lineTo(-0.13, 0.14)
		eyeShape.absarc(0, 0.14, 0.13, Math.PI, 0, true)
		eyeShape.lineTo(0.13, -0.14)
		eyeShape.absarc(0, -0.14, 0.13, 0, Math.PI, true)
		const eyeGeometry = new THREE.ExtrudeGeometry(eyeShape, {
			depth: 0.06,
			bevelEnabled: false,
			curveSegments: 14
		})
		eyeGeometry.translate(0, 0, -0.03)
		const leftEye = addMesh(eyeGeometry, eyeMaterial, -0.5, -0.05, 1.05)
		leftEye.rotation.y = -0.37
		const rightEye = addMesh(eyeGeometry, eyeMaterial, 0.5, -0.05, 1.05)
		rightEye.rotation.y = 0.37

		const earGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.4, 16)
		earGeometry.rotateZ(Math.PI / 2)
		addMesh(earGeometry, earMaterial, -1.3, -0.05, 0)
		addMesh(earGeometry, earMaterial, 1.3, -0.05, 0)

		addMesh(
			new THREE.SphereGeometry(1.5, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 1, 0.97),
			hatMaterial,
			0,
			0.5,
			-0.1
		)
		const ridgePoints: THREE.Vector3[] = []
		for (let index = 0; index <= 24; index++) {
			const angle = -Math.PI / 2 + (index * Math.PI) / 24
			ridgePoints.push(new THREE.Vector3(0, 0.5 + 1.5 * Math.cos(angle), -0.1 + 1.455 * Math.sin(angle)))
		}
		addMesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ridgePoints), 48, 0.06, 8, false), hatMaterial, 0, 0, 0)
		addMesh(new THREE.CylinderGeometry(1, 1, 0.07, 28).scale(1.65, 1, 1.55), hatMaterial, 0, 0.47, -0.1)
		const peak = addMesh(
			new THREE.CylinderGeometry(1, 1, 0.09, 28, 1, false, -Math.PI / 2, Math.PI).scale(1.4, 1, 1),
			hatMaterial,
			0,
			0.49,
			0.7
		)
		peak.rotation.x = 0.1

		const strapPoints = [
			[1.3, 0.46, 0.45],
			[1.22, 0.2, 0.48],
			[1.2, -0.15, 0.5],
			[1.17, -0.5, 0.52],
			[0.82, -0.76, 0.62],
			[0.4, -0.93, 0.55],
			[0, -0.97, 0.56]
		]
		;[1, -1].forEach((side) => {
			const curve = new THREE.CatmullRomCurve3(strapPoints.map(([x, y, z]) => new THREE.Vector3(x * side, y, z)))
			addMesh(new THREE.TubeGeometry(curve, 80, 0.04, 6, false), strapMaterial, 0, 0, 0)
			addMesh(new THREE.BoxGeometry(0.12, 0.15, 0.1), clipMaterial, 0.06 * side, -0.97, 0.56)
			addMesh(new THREE.BoxGeometry(0.1, 0.14, 0.14), clipMaterial, 1.28 * side, 0.4, 0.46)
		})

		// Casters never receive and vice versa, so curved surfaces cannot self-shadow (the source of the stripes).
		const receivers = new Set<THREE.Material>([headMaterial, earMaterial])
		head.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				const receives = receivers.has(object.material as THREE.Material)
				object.castShadow = !receives
				object.receiveShadow = receives
			}
		})

		const applyTheme = () => {
			const isDark = document.documentElement.classList.contains('dark')
			headMaterial.color.setHex(isDark ? 0x9a9a9a : 0xcfcfcf)
			hatMaterial.color.setHex(isDark ? 0xf5f5f5 : 0x262626)
			strapMaterial.color.setHex(isDark ? 0x737373 : 0x525252)
			clipMaterial.color.setHex(isDark ? 0xd4d4d4 : 0xa3a3a3)
			earMaterial.color.setHex(isDark ? 0x6e6e6e : 0x404040)
		}
		applyTheme()

		let animationFrame = 0
		let lastFrameTime = performance.now()
		let blinkTime = 0
		let nextBlink = 2.5
		let actionId: number | null = null
		let activeAction: { type: MascotActionType; startedAt: number } | null = null
		let hasPointer = false
		const pointer = { x: 0, y: 0 }
		const look = { x: 0, y: 0 }
		const closed = { left: 1, right: 1 }
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

		const targetLook = () => {
			const cues = cuesRef.current
			if (cues.focusTarget === 'username') {
				return { x: -0.9 + 1.8 * clamp(cues.usernameProgress, 0, 1), y: 0.8 }
			}
			if (cues.focusTarget === 'password') return { x: 0, y: 0.9 }
			return hasPointer ? pointer : { x: 0, y: 0 }
		}

		const drawStatic = () => {
			const cues = cuesRef.current
			const target = targetLook()
			head.rotation.y = reducedMotion.matches ? 0 : target.x * 0.6
			head.rotation.x = reducedMotion.matches ? 0 : target.y * 0.22
			const covering = cues.focusTarget === 'password'
			closed.left = covering ? 0.05 : 1
			closed.right = covering && !cues.passwordVisible ? 0.05 : 1
			leftEye.scale.y = closed.left
			rightEye.scale.y = closed.right
			renderer.render(scene, camera)
		}
		redrawRef.current = drawStatic
		const resizeObserver = new ResizeObserver(() => {
			const bounds = canvas.getBoundingClientRect()
			const width = bounds.width || 192
			const height = bounds.height || 192
			camera.aspect = width / height
			camera.updateProjectionMatrix()
			renderer.setSize(width, height, false)
			drawStatic()
		})

		const onPointerMove = (event: PointerEvent) => {
			const bounds = canvas.getBoundingClientRect()
			pointer.x = clamp((event.clientX - (bounds.left + bounds.width / 2)) / (window.innerWidth / 2 || 1), -1, 1)
			pointer.y = clamp((event.clientY - (bounds.top + bounds.height / 2)) / (window.innerHeight / 2 || 1), -1, 1)
			hasPointer = true
		}

		const animate = (now: number) => {
			const delta = Math.min((now - lastFrameTime) / 1000, 0.05)
			lastFrameTime = now
			const target = targetLook()
			look.x = lerp(look.x, target.x, Math.min(delta * 18, 1))
			look.y = lerp(look.y, target.y, Math.min(delta * 18, 1))

			nextBlink -= delta
			if (nextBlink <= 0) {
				blinkTime = 0.15
				nextBlink = 2 + Math.random() * 3
			}
			blinkTime = Math.max(0, blinkTime - delta)

			const cues = cuesRef.current
			const isPasswordFocused = cues.focusTarget === 'password'
			const blinkTarget = blinkTime > 0 ? 0.1 : 1
			const leftEyeTarget = isPasswordFocused ? 0.05 : blinkTarget
			const rightEyeTarget = isPasswordFocused && !cues.passwordVisible ? 0.05 : blinkTarget
			const eyeEase = 1 - Math.exp(-delta * 18)
			closed.left = lerp(closed.left, leftEyeTarget, eyeEase)
			closed.right = lerp(closed.right, rightEyeTarget, eyeEase)
			leftEye.scale.y = closed.left
			rightEye.scale.y = closed.right

			head.rotation.y = look.x * 0.6
			head.rotation.x = look.y * 0.22
			head.rotation.z = 0

			if (cues.action && cues.action.id !== actionId) {
				actionId = cues.action.id
				activeAction = { type: cues.action.type, startedAt: now }
			}
			if (activeAction) {
				const elapsed = (now - activeAction.startedAt) / 1000
				const strength = Math.max(0, 1 - elapsed / 0.6)
				if (activeAction.type === 'shake') {
					head.rotation.y += Math.sin(elapsed * 35) * 0.35 * strength
				} else {
					head.rotation.x += Math.sin(elapsed * 10) * 0.3 * strength
				}
				if (elapsed >= 0.6) activeAction = null
			}

			head.position.y = Math.sin(now / 600) * 0.05
			renderer.render(scene, camera)
			animationFrame = window.requestAnimationFrame(animate)
		}

		const startAnimation = () => {
			if (animationFrame || reducedMotion.matches || document.hidden) return
			lastFrameTime = performance.now()
			animationFrame = window.requestAnimationFrame(animate)
		}
		const stopAnimation = () => {
			if (!animationFrame) return
			window.cancelAnimationFrame(animationFrame)
			animationFrame = 0
		}
		const onMotionPreferenceChange = () => {
			stopAnimation()
			if (reducedMotion.matches) drawStatic()
			else startAnimation()
		}
		const onVisibilityChange = () => {
			if (document.hidden) stopAnimation()
			else startAnimation()
		}
		const themeObserver = new MutationObserver(() => {
			applyTheme()
			if (reducedMotion.matches) drawStatic()
		})

		resizeObserver.observe(canvas)
		window.addEventListener('pointermove', onPointerMove, { passive: true })
		window.addEventListener('resize', drawStatic)
		document.addEventListener('visibilitychange', onVisibilityChange)
		reducedMotion.addEventListener('change', onMotionPreferenceChange)
		themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

		const geometries = new Set<THREE.BufferGeometry>()
		const materials = new Set<THREE.Material>()
		scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				geometries.add(object.geometry)
				const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
				objectMaterials.forEach((material) => materials.add(material))
			}
		})

		drawStatic()
		startAnimation()

		return () => {
			stopAnimation()
			window.removeEventListener('pointermove', onPointerMove)
			window.removeEventListener('resize', drawStatic)
			document.removeEventListener('visibilitychange', onVisibilityChange)
			reducedMotion.removeEventListener('change', onMotionPreferenceChange)
			resizeObserver.disconnect()
			themeObserver.disconnect()
			redrawRef.current = null
			geometries.forEach((geometry) => geometry.dispose())
			materials.forEach((material) => material.dispose())
			light.dispose()
			renderer.dispose()
			THREE.ColorManagement.enabled = previousColorManagement
		}
	}, [])

	useEffect(() => {
		redrawRef.current?.()
	}, [focusTarget, passwordVisible, usernameProgress, action?.id])

	return <canvas aria-hidden='true' className='mx-auto -mb-8 block size-48 max-sm:size-40' ref={canvasRef} />
}

export default LoginMascot
