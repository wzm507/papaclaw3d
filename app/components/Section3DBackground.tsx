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

export type SectionTheme = 'pink' | 'green' | 'blue' | 'orange'

const themeColors: Record<SectionTheme, { primary: string; secondary: string; accent: string }> = {
  pink: {
    primary: '#db3c8a',
    secondary: '#ff85c0',
    accent: '#ffc4e1',
  },
  green: {
    primary: '#00522d',
    secondary: '#2d8a5e',
    accent: '#7bc49a',
  },
  blue: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#93c5fd',
  },
  orange: {
    primary: '#c2410c',
    secondary: '#f97316',
    accent: '#fdba74',
  },
}

// 相机控制器 - 基于 GSAP ScrollTrigger 的轻微移动和旋转
function CameraController({
  prefersReducedMotion,
  scrollProgressRef,
}: {
  prefersReducedMotion: boolean
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const { camera } = useThree()
  const targetZ = useRef(8)
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)

  useFrame((state) => {
    if (prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // 相机 Z 轴轻微移动
    const desiredZ = lerp(8, 5, scrollProgress)
    targetZ.current = lerp(targetZ.current, desiredZ, 0.05)
    camera.position.z = targetZ.current

    // 轻微的相机旋转摆动
    const time = state.clock.elapsedTime
    const wobbleX = Math.sin(time * 0.4) * 0.015 * (1 - scrollProgress * 0.5)
    const wobbleY = Math.cos(time * 0.25) * 0.01 * (1 - scrollProgress * 0.5)

    targetRotX.current = lerp(targetRotX.current, wobbleX, 0.05)
    targetRotY.current = lerp(targetRotY.current, wobbleY, 0.05)

    camera.rotation.x = targetRotX.current
    camera.rotation.y = targetRotY.current
  })

  return null
}

// 浮动几何体 - 响应滚动
function FloatingShape({
  geometry,
  position,
  color,
  scale = 1,
  speed = 1,
  prefersReducedMotion,
  scrollProgressRef,
}: {
  geometry: 'box' | 'sphere' | 'torus'
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
  prefersReducedMotion: boolean
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const baseY = useRef(position[1])
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)
  const targetZ = useRef(position[2])

  const geometryElement = useMemo(() => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 32]} />
    }
  }, [geometry])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    // 基础浮动动画
    meshRef.current.position.y = baseY.current + Math.sin(time * speed) * 0.3
    meshRef.current.rotation.z = Math.sin(time * speed * 0.5) * 0.05

    if (prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // 滚动驱动的旋转
    const desiredRotX = scrollProgress * Math.PI * 0.5 * speed
    const desiredRotY = scrollProgress * Math.PI * 0.3 * speed
    targetRotX.current = lerp(targetRotX.current, desiredRotX, 0.05)
    targetRotY.current = lerp(targetRotY.current, desiredRotY, 0.05)

    meshRef.current.rotation.x = targetRotX.current
    meshRef.current.rotation.y = targetRotY.current

    // Z 轴轻微视差
    const desiredZ = position[2] + scrollProgress * 2
    targetZ.current = lerp(targetZ.current, desiredZ, 0.05)
    meshRef.current.position.z = targetZ.current
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometryElement}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.25}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  )
}

// 多层粒子场组件 - 视差效果
function ParticleField({
  layer,
  color,
  prefersReducedMotion,
  scrollProgressRef,
}: {
  layer: 'near' | 'mid' | 'far'
  color: string
  prefersReducedMotion: boolean
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const points = useRef<THREE.Points>(null)

  const config = useMemo(() => {
    switch (layer) {
      case 'near':
        return { count: 80, zRange: [-2, 2], size: 0.06, opacity: 0.6, speed: 0.4 }
      case 'mid':
        return { count: 120, zRange: [-5, -2], size: 0.04, opacity: 0.45, speed: 0.25 }
      case 'far':
        return { count: 160, zRange: [-10, -5], size: 0.025, opacity: 0.3, speed: 0.08 }
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
    points.current.rotation.y = state.clock.elapsedTime * 0.015 * (layer === 'near' ? 1.5 : layer === 'mid' ? 1 : 0.5)
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.08

    if (prefersReducedMotion) return

    const scrollProgress = scrollProgressRef.current

    // 视差效果
    const parallaxOffset = scrollProgress * config.speed * 4

    const positionsArray = points.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3
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
        color={color}
        transparent
        opacity={config.opacity}
        sizeAttenuation
      />
    </points>
  )
}

// 场景内容组件
function SceneContent({
  theme,
  scrollProgressRef,
}: {
  theme: SectionTheme
  scrollProgressRef: React.MutableRefObject<number>
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const colors = themeColors[theme]

  // 根据主题生成不同的几何体布局
  const shapes = useMemo(() => {
    const seed = theme.charCodeAt(0)
    const rng = (i: number) => {
      const x = Math.sin(seed + i * 12.9898) * 43758.5453
      return x - Math.floor(x)
    }

    const geometries: Array<'box' | 'sphere' | 'torus'> = ['box', 'sphere', 'torus']
    const result = []

    for (let i = 0; i < 6; i++) {
      const geo = geometries[i % 3]
      const x = (rng(i) - 0.5) * 12
      const y = (rng(i + 10) - 0.5) * 8
      const z = -2 - rng(i + 20) * 4
      const scale = 0.5 + rng(i + 30) * 0.8
      const speed = 0.5 + rng(i + 40) * 0.8
      const color = i % 2 === 0 ? colors.primary : colors.secondary

      result.push({
        geometry: geo,
        position: [x, y, z] as [number, number, number],
        color,
        scale,
        speed,
      })
    }

    return result
  }, [theme, colors])

  return (
    <>
      <CameraController prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color={colors.primary} />

      {shapes.map((shape, i) => (
        <FloatingShape
          key={i}
          geometry={shape.geometry}
          position={shape.position}
          color={shape.color}
          scale={shape.scale}
          speed={shape.speed}
          prefersReducedMotion={prefersReducedMotion}
          scrollProgressRef={scrollProgressRef}
        />
      ))}

      {/* 多层粒子场 - 视差效果 */}
      <ParticleField layer="far" color={colors.accent} prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
      <ParticleField layer="mid" color={colors.secondary} prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
      <ParticleField layer="near" color={colors.primary} prefersReducedMotion={prefersReducedMotion} scrollProgressRef={scrollProgressRef} />
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

interface Section3DBackgroundProps {
  theme: SectionTheme
  className?: string
}

export default function Section3DBackground({ theme, className = '' }: Section3DBackgroundProps) {
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
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <SceneContent theme={theme} scrollProgressRef={scrollProgressRef} />
      </Canvas>
    </div>
  )
}
