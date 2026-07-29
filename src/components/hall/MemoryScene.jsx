import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

/**
 * One memory card — landscape polaroid for group farewell frames.
 * Slow approach toward camera so each shot reads like a beat drop.
 */
function FloatingMemory({ url, caption, index, total }) {
  const group = useRef(null)
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  // Staggered lanes in a soft arc — not a chaotic swarm
  const lane = useMemo(() => {
    const t = index / Math.max(total - 1, 1)
    const spread = (t - 0.5) * 2.4
    return {
      x: spread + (index % 2 === 0 ? -0.15 : 0.15),
      y: (index % 3) * 0.28 - 0.28,
      startZ: -9.5 - (index % 4) * 1.8,
      speed: 0.32 + (index % 3) * 0.04,
      sway: 0.04 + (index % 2) * 0.02,
    }
  }, [index, total])

  const z = useRef(lane.startZ)

  useFrame((_, delta) => {
    if (!group.current) return
    z.current += lane.speed * delta
    if (z.current > 0.9) z.current = lane.startZ - 1.2

    const depth = -z.current
    const scale = THREE.MathUtils.clamp(1.15 + (8 - depth) * 0.08, 0.85, 1.55)

    group.current.position.set(
      lane.x + Math.sin(z.current * 0.35 + index) * lane.sway,
      lane.y + Math.cos(z.current * 0.28 + index) * 0.05,
      z.current
    )
    group.current.rotation.z = Math.sin(z.current * 0.15 + index) * 0.025
    group.current.scale.setScalar(scale)
  })

  // Landscape polaroid proportions for batch group shots
  const frameW = 1.72
  const frameH = 1.28
  const photoW = 1.52
  const photoH = 0.98

  return (
    <group ref={group}>
      <Billboard follow>
        <mesh position={[0.05, -0.05, -0.035]}>
          <planeGeometry args={[frameW + 0.04, frameH + 0.04]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
        </mesh>
        <mesh position={[0, -0.02, -0.01]}>
          <planeGeometry args={[frameW, frameH]} />
          <meshBasicMaterial color="#f4efe6" toneMapped={false} depthWrite />
        </mesh>
        <mesh position={[0, 0.06, 0.02]}>
          <planeGeometry args={[photoW, photoH]} />
          <meshBasicMaterial map={texture} toneMapped={false} depthWrite side={THREE.FrontSide} />
        </mesh>
        <Text
          position={[0, -0.52, 0.03]}
          fontSize={0.048}
          maxWidth={1.5}
          color="#1f1a12"
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
        >
          {caption.length > 40 ? `${caption.slice(0, 38)}…` : caption}
        </Text>
      </Billboard>
    </group>
  )
}

function SoftDust() {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(40 * 3)
    for (let i = 0; i < 40; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5
      arr[i * 3 + 2] = -2 - Math.random() * 10
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#c4a574"
        transparent
        opacity={0.18}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function MemoryScene({ photos }) {
  // Fewer, stronger frames — like a setlist, not a pile
  const items = useMemo(() => photos.slice(0, 8), [photos])

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[1.5, 2.5, 3]} intensity={0.45} />
      <SoftDust />
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
