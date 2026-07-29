import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function FloatingMemory({ url, caption, index, total }) {
  const group = useRef(null)
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  // Spawn just ahead of the camera so cards are immediately readable
  const startZ = useMemo(() => -7.5 - (index % 6) * 1.35, [index])
  const lane = useMemo(() => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    const ring = 0.85 + (index % 3) * 0.45
    return {
      x: Math.cos(angle) * ring,
      y: Math.sin(angle * 0.9) * 0.55 + (index % 2 === 0 ? 0.15 : -0.1),
      speed: 0.55 + (index % 5) * 0.08,
      spin: ((index % 2) * 2 - 1) * 0.03,
    }
  }, [index, total])

  const z = useRef(startZ)

  useFrame((_, delta) => {
    if (!group.current) return
    z.current += lane.speed * delta
    if (z.current > 1.2) z.current = startZ - 1.5

    group.current.position.set(
      lane.x,
      lane.y + Math.sin(z.current * 0.45 + index) * 0.06,
      z.current
    )
    group.current.rotation.z = Math.sin(z.current * 0.22 + index) * lane.spin
    // Soft scale-up as they approach so they feel solid and close
    const near = THREE.MathUtils.clamp((-z.current - 0.5) / 7, 0.55, 1)
    const scale = THREE.MathUtils.lerp(1.35, 0.85, near)
    group.current.scale.setScalar(scale)
  })

  return (
    <group ref={group}>
      <Billboard follow>
        {/* Drop shadow — only this layer uses transparency */}
        <mesh position={[0.05, -0.07, -0.04]}>
          <planeGeometry args={[1.55, 1.85]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.45} depthWrite={false} />
        </mesh>

        {/* Polaroid frame — fully opaque (no transparent blending) */}
        <mesh position={[0, -0.02, -0.01]}>
          <planeGeometry args={[1.48, 1.78]} />
          <meshBasicMaterial color="#f7f2ea" toneMapped={false} depthWrite />
        </mesh>

        {/* Photo — fully opaque so it reads clearly over the camera */}
        <mesh position={[0, 0.1, 0.02]}>
          <planeGeometry args={[1.28, 1.36]} />
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
            depthWrite
            side={THREE.FrontSide}
          />
        </mesh>

        <Text
          position={[0, -0.78, 0.04]}
          fontSize={0.058}
          maxWidth={1.25}
          color="#1f1a12"
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
          outlineWidth={0}
        >
          {caption.length > 34 ? `${caption.slice(0, 32)}…` : caption}
        </Text>
      </Billboard>
    </group>
  )
}

function Dust() {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(60 * 3)
    for (let i = 0; i < 60; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = -1 - Math.random() * 12
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#c4a574"
        transparent
        opacity={0.22}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export default function MemoryScene({ photos }) {
  const items = useMemo(() => photos.slice(0, 12), [photos])

  return (
    <>
      <ambientLight intensity={1.85} />
      <directionalLight position={[2, 3, 4]} intensity={0.55} />
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
