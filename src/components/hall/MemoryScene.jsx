import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function FloatingMemory({ url, caption, index, total }) {
  const group = useRef(null)
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace

  const startZ = useMemo(() => -10 - (index % 8) * 2.8, [index])
  const lane = useMemo(() => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    return {
      x: Math.cos(angle) * (1.15 + (index % 3) * 0.5),
      y: Math.sin(angle * 0.85) * 0.65 + (index % 2 === 0 ? 0.15 : -0.1),
      speed: 0.55 + (index % 5) * 0.08,
      spin: ((index % 2) * 2 - 1) * 0.06,
    }
  }, [index, total])

  const z = useRef(startZ)
  const opacity = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    z.current += lane.speed * delta
    if (z.current > 2.6) {
      z.current = startZ - 3
      opacity.current = 0
    }

    const approach = THREE.MathUtils.clamp((z.current + 12) / 12, 0, 1)
    const fadeNear = THREE.MathUtils.clamp((2.1 - z.current) / 1.2, 0, 1)
    opacity.current = THREE.MathUtils.lerp(
      opacity.current,
      approach * (1 - fadeNear * 0.9),
      0.1
    )

    group.current.position.set(
      lane.x,
      lane.y + Math.sin(z.current * 0.45 + index) * 0.1,
      z.current
    )
    group.current.rotation.z = Math.sin(z.current * 0.25 + index) * lane.spin

    group.current.traverse((child) => {
      if (child.material && 'opacity' in child.material) {
        child.material.transparent = true
        child.material.opacity = opacity.current * (child.userData.baseOpacity ?? 1)
      }
    })
  })

  return (
    <group ref={group}>
      <Billboard follow>
        {/* Polaroid frame */}
        <mesh position={[0, -0.02, -0.01]} userData={{ baseOpacity: 0.95 }}>
          <planeGeometry args={[1.28, 1.55]} />
          <meshBasicMaterial color="#f5f0e8" transparent />
        </mesh>
        <mesh position={[0, 0.08, 0.01]} userData={{ baseOpacity: 1 }}>
          <planeGeometry args={[1.12, 1.2]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
        <Text
          position={[0, -0.68, 0.02]}
          fontSize={0.05}
          maxWidth={1.1}
          color="#2a2418"
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
        >
          {caption.length > 36 ? `${caption.slice(0, 34)}…` : caption}
        </Text>
      </Billboard>
    </group>
  )
}

function Dust() {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(100 * 3)
    for (let i = 0; i < 100; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7
      arr[i * 3 + 2] = -Math.random() * 22
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.025
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#c4a574"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function MemoryScene({ photos }) {
  const items = useMemo(() => photos.slice(0, 14), [photos])

  return (
    <>
      <ambientLight intensity={1.35} />
      <Dust />
      {items.map((photo, i) => (
        <FloatingMemory
          key={`${photo.id}-${i}`}
          url={photo.src}
          caption={photo.caption}
          index={i}
          total={items.length}
        />
      ))}
    </>
  )
}
