import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Angled polaroid — fixed tilt (no billboard) so cards sit in space
 * with clear gaps instead of stacking face-on over each other.
 */
function FloatingMemory({ url, caption, index, total, landscape }) {
  const group = useRef(null)
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  const lane = useMemo(() => {
    // Fan across a wide arc so neighbors barely kiss
    const t = index / Math.max(total - 1, 1)
    const fan = (t - 0.5) * Math.PI * 0.95
    const ring = 2.85 + (index % 3) * 0.35
    const yaw = fan * 0.55 + ((index % 2) * 2 - 1) * 0.12
    const roll = ((index % 2) * 2 - 1) * (0.1 + (index % 3) * 0.05)
    return {
      baseX: Math.sin(fan) * ring,
      baseY: ((index % 3) - 1) * 0.55,
      startZ: -5.5 - Math.cos(fan) * 2.2 - (index % 4) * 1.6,
      speed: 0.28 + (index % 3) * 0.035,
      yaw,
      roll,
    }
  }, [index, total])

  const z = useRef(lane.startZ)

  useFrame((_, delta) => {
    if (!group.current) return
    z.current += lane.speed * delta
    if (z.current > 0.4) z.current = lane.startZ - 2

    // Soft approach scale — never huge enough to eat the whole view
    const depth = Math.max(-z.current, 0.5)
    const scale = THREE.MathUtils.clamp(0.72 + (6.5 - depth) * 0.05, 0.65, 1.05)

    group.current.position.set(
      lane.baseX + Math.sin(z.current * 0.25 + index) * 0.06,
      lane.baseY + Math.cos(z.current * 0.2 + index) * 0.04,
      z.current
    )
    group.current.rotation.set(0, lane.yaw, lane.roll)
    group.current.scale.setScalar(scale)
  })

  const frameW = landscape ? 1.58 : 1.22
  const frameH = landscape ? 1.18 : 1.48
  const photoW = landscape ? 1.4 : 1.04
  const photoH = landscape ? 0.9 : 1.12
  const captionY = landscape ? -0.48 : -0.62

  return (
    <group ref={group}>
      <mesh position={[0.04, -0.045, -0.03]}>
        <planeGeometry args={[frameW + 0.04, frameH + 0.04]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.015, -0.01]}>
        <planeGeometry args={[frameW, frameH]} />
        <meshBasicMaterial color="#f4efe6" toneMapped={false} depthWrite />
      </mesh>
      <mesh position={[0, landscape ? 0.05 : 0.08, 0.02]}>
        <planeGeometry args={[photoW, photoH]} />
        <meshBasicMaterial map={texture} toneMapped={false} depthWrite side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, captionY, 0.03]}
        fontSize={0.042}
        maxWidth={frameW - 0.16}
        color="#1f1a12"
        anchorX="center"
        anchorY="middle"
        fillOpacity={1}
      >
        {caption.length > 36 ? `${caption.slice(0, 34)}…` : caption}
      </Text>
    </group>
  )
}

function SoftDust() {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(36 * 3)
    for (let i = 0; i < 36; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5
      arr[i * 3 + 2] = -2 - Math.random() * 11
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        color="#c4a574"
        transparent
        opacity={0.16}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function MemoryScene({ photos }) {
  const items = useMemo(() => photos.slice(0, 9), [photos])

  return (
    <>
      <ambientLight intensity={1.65} />
      <directionalLight position={[2, 2.5, 3]} intensity={0.4} />
      <SoftDust />
      {items.map((photo, i) => (
        <FloatingMemory
          key={`${photo.id}-${i}`}
          url={photo.src}
          caption={photo.caption}
          index={i}
          total={items.length}
          landscape={photo.landscape !== false}
        />
      ))}
    </>
  )
}
