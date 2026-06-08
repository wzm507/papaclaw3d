'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 检查用户是否偏好减少动画
function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// 平滑插值函数
function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}

// 相机控制器 - 基于 GSAP ScrollTrigger 的 Z 轴移动和旋转摆动
function CameraController({ prefersReducedMotion, scrollProgressRef }: { prefersReducedMotion: boolean; scrollProgressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const targetZ = useRef(10)
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)

  useFrame((state) => {
    if (prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // 相机 Z 轴从 10 移动到 2
    const desiredZ = lerp(10, 2, scrollProgress)
    targetZ.current = lerp(targetZ.current, desiredZ, 0.05)
    camera.position.z = targetZ.current

    // 轻微的相机旋转摆动
    const time = state.clock.elapsedTime
    const wobbleX = Math.sin(time * 0.5) * 0.02 * (1 - scrollProgress * 0.5)
    const wobbleY = Math.cos(time * 0.3) * 0.015 * (1 - scrollProgress * 0.5)

    targetRotX.current = lerp(targetRotX.current, wobbleX, 0.05)
    targetRotY.current = lerp(targetRotY.current, wobbleY, 0.05)

    camera.rotation.x = targetRotX.current
    camera.rotation.y = targetRotY.current
  })

  return null
}

// 闪电形状组件 - 带滚动动画
function LightningShape({
  position,
  rotation,
  side,
  prefersReducedMotion,
  scrollProgressRef,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  side: 'left' | 'right'
  prefersReducedMotion: boolean
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  const targetX = useRef(position[0])
  const targetScale = useRef(1)
  const targetRotY = useRef(rotation?.[1] ?? 0)

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 2)
    s.lineTo(-0.5, 0.5)
    s.lineTo(-0.2, 0.5)
    s.lineTo(-0.8, -1)
    s.lineTo(-0.3, -1)
    s.lineTo(-1, -2)
    s.lineTo(0.3, -0.5)
    s.lineTo(0, -0.5)
    s.lineTo(0.5, 1)
    s.lineTo(0.2, 1)
    s.lineTo(0.8, 2)
    s.closePath()
    return s
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    // 基础动画 - 始终运行
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

    if (prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // X 轴偏移 - 根据滚动进度向外移动
    const baseX = side === 'left' ? -4 : 4
    const xOffset = side === 'left' ? -scrollProgress * 2 : scrollProgress * 2
    const desiredX = baseX + xOffset
    targetX.current = lerp(targetX.current, desiredX, 0.05)

    // 缩放效果
    const desiredScale = 1 + scrollProgress * 0.3
    targetScale.current = lerp(targetScale.current, desiredScale, 0.05)

    // Y 轴旋转
    const baseRotY = rotation?.[1] ?? 0
    const rotYProgress = scrollProgress * Math.PI * 0.25
    const desiredRotY = side === 'left' ? baseRotY - rotYProgress : baseRotY + rotYProgress
    targetRotY.current = lerp(targetRotY.current, desiredRotY, 0.05)

    meshRef.current.position.x = targetX.current
    meshRef.current.scale.setScalar(targetScale.current)
    meshRef.current.rotation.y = targetRotY.current
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <extrudeGeometry
        args={[shape, { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 }]}
      />
      <meshStandardMaterial
        color="#db3c8a"
        transparent
        opacity={0.3}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  )
}

// 3D 文字组件 - 使用几何体创建文字效果
function FloatingText({
  text,
  position,
  color = '#00522d',
  prefersReducedMotion,
  scrollProgressRef,
}: {
  text: string
  position: [number, number, number]
  color?: string
  prefersReducedMotion: boolean
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const targetZ = useRef(position[2])
  const targetOpacity = useRef(1)

  useFrame(() => {
    if (!groupRef.current || prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // Z 空间移动 - 文字向前移动
    const desiredZ = position[2] + scrollProgress * 3
    targetZ.current = lerp(targetZ.current, desiredZ, 0.05)
    groupRef.current.position.z = targetZ.current

    // 透明度变化 - 滚动到末尾时淡出
    const desiredOpacity = scrollProgress > 0.8 ? 1 - (scrollProgress - 0.8) * 5 : 1
    targetOpacity.current = lerp(targetOpacity.current, desiredOpacity, 0.05)

    // 更新材质透明度
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial
        material.transparent = true
        material.opacity = targetOpacity.current
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {/* 使用简单的几何体组合来表示文字 - 这里用发光的球体阵列 */}
      {text.split('').map((char, i) => (
        <mesh key={i} position={[(i - text.length / 2) * 0.8, 0, 0]}>
          <boxGeometry args={[0.6, 0.8, 0.2]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.9}
            roughness={0.3}
            metalness={0.7}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// 多层粒子场组件 - 视差效果
function ParticleField({
  layer,
  prefersReducedMotion,
  scrollProgressRef,
}: {
  layer: 'near' | 'mid' | 'far'
  prefersReducedMotion: boolean
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const points = useRef<THREE.Points>(null)

  // 根据层级设置参数
  const config = useMemo(() => {
    switch (layer) {
      case 'near':
        return { count: 100, zRange: [-2, 2], size: 0.08, opacity: 0.8, speed: 0.5 }
      case 'mid':
        return { count: 150, zRange: [-5, -2], size: 0.05, opacity: 0.6, speed: 0.3 }
      case 'far':
        return { count: 200, zRange: [-10, -5], size: 0.03, opacity: 0.4, speed: 0.1 }
    }
  }, [layer])

  const positions = useMemo(() => {
    const pos = new Float32Array(config.count * 3)
    for (let i = 0; i < config.count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = config.zRange[0] + Math.random() * (config.zRange[1] - config.zRange[0])
    }
    return pos
  }, [config])

  const originalPositions = useMemo(() => positions.slice(), [positions])

  useFrame((state) => {
    if (!points.current) return

    // 基础旋转动画
    points.current.rotation.y = state.clock.elapsedTime * 0.02 * (layer === 'near' ? 1.5 : layer === 'mid' ? 1 : 0.5)
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1

    if (prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // 视差效果 - 不同层级以不同速度移动
    const parallaxOffset = scrollProgress * config.speed * 5

    const positionsArray = points.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3
      // Z 轴视差移动
      positionsArray[i3 + 2] = originalPositions[i3 + 2] + parallaxOffset
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={config.count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={config.size}
        color="#db3c8a"
        transparent
        opacity={config.opacity}
        sizeAttenuation
      />
    </points>
  )
}

// 场景内容组件
function SceneContent({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <>
      <CameraController prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#db3c8a" />

      <LightningShape
        position={[-4, 0, -2]}
        side="left"
        prefersReducedMotion={prefersReducedMotion}
        scrollProgressRef={scrollProgressRef}
      />
      <LightningShape
        position={[4, 0, -2]}
        rotation={[0, Math.PI, 0]}
        side="right"
        prefersReducedMotion={prefersReducedMotion}
        scrollProgressRef={scrollProgressRef}
      />

      <FloatingText text="FRAPPER" position={[0, 1, 0]} color="#db3c8a" prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
      <FloatingText text="FORT." position={[0, -1, 0]} color="#00522d" prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />

      {/* 多层粒子场 - 视差效果 */}
      <ParticleField layer="far" prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
      <ParticleField layer="mid" prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
      <ParticleField layer="near" prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
    </>
  )
}

// 检查 WebGL 支持
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function Manifest3D() {
  const scrollProgressRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    setWebglSupported(isWebGLSupported())
  }, [])

  useEffect(() => {
    if (!containerRef.current || !webglSupported) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
        },
      })
    })

    return () => ctx.revert()
  }, [webglSupported])

  if (!webglSupported) {
    return null
  }

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <SceneContent scrollProgressRef={scrollProgressRef} />
      </Canvas>
    </div>
  )
}
