import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const RING_Y = 0.05
const RING_RADIUS = 3.35

/**
 * One polaroid on the panorama ring — same eye level, facing the viewer at the center.
 */
function RingMemory({ url, caption, index, total, landscape, orbitRef }) {
  const group = useRef(null)
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  const slot = useMemo(() => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    return {
      angle,
      x: Math.sin(angle) * RING_RADIUS,
      z: -Math.cos(angle) * RING_RADIUS,
    }
  }, [index, total])

  useFrame(() => {
    if (!group.current) return
    // Keep facing the center so turning the camera always reads the photo
    group.current.lookAt(0, RING_Y, 0)
  })

  const frameW = landscape ? 1.55 : 1.2
  const frameH = landscape ? 1.15 : 1.45
  const photoW = landscape ? 1.38 : 1.02
  const photoH = landscape ? 0.88 : 1.1
  const captionY = landscape ? -0.46 : -0.6

  return (
    <group
      ref={group}
      position={[slot.x, RING_Y, slot.z]}
      // Parent orbitRef rotates the whole panorama
    >
      <mesh position={[0.03, -0.04, -0.025]}>
        <planeGeometry args={[frameW + 0.04, frameH + 0.04]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.32} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.01, -0.01]}>
        <planeGeometry args={[frameW, frameH]} />
        <meshBasicMaterial color="#f4efe6" toneMapped={false} depthWrite />
      </mesh>
      <mesh position={[0, landscape ? 0.05 : 0.08, 0.02]}>
        <planeGeometry args={[photoW, photoH]} />
        <meshBasicMaterial map={texture} toneMapped={false} depthWrite side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, captionY, 0.03]}
        fontSize={0.04}
        maxWidth={frameW - 0.14}
        color="#1f1a12"
        anchorX="center"
        anchorY="middle"
        fillOpacity={1}
      >
        {caption.length > 34 ? `${caption.slice(0, 32)}…` : caption}
      </Text>
    </group>
  )
}

function SoftDust() {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(48 * 3)
    for (let i = 0; i < 48; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 1.2 + Math.random() * 4
      arr[i * 3] = Math.sin(a) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.2
      arr[i * 3 + 2] = -Math.cos(a) * r
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#c4a574"
        transparent
        opacity={0.15}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * Circular panorama of memories at one shared eye level.
 * The ring slowly turns; the user looks around from the center.
 */
export default function MemoryScene({ photos }) {
  const orbit = useRef(null)
  const items = useMemo(() => photos.slice(0, 10), [photos])

  useFrame((_, delta) => {
    if (orbit.current) orbit.current.rotation.y += delta * 0.045
  })

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[2, 3, 2]} intensity={0.4} />
      <SoftDust />
      <group ref={orbit}>
        {items.map((photo, i) => (
          <RingMemory
            key={`${photo.id}-${i}`}
            url={photo.src}
            caption={photo.caption}
            index={i}
            total={items.length}
            landscape={photo.landscape !== false}
            orbitRef={orbit}
          />
        ))}
      </group>
    </>
  )
}
