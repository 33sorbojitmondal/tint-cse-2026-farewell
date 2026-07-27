import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function FloatingMemory({ url, caption, index, total }) {
  const group = useRef(null)
  const matRefs = useRef([])
  const texture = useTexture(url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  const startZ = useMemo(() => -11 - (index % 8) * 2.6, [index])
  const lane = useMemo(() => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    return {
      x: Math.cos(angle) * (1.2 + (index % 3) * 0.55),
      y: Math.sin(angle * 0.85) * 0.7 + (index % 2 === 0 ? 0.2 : -0.12),
      speed: 0.48 + (index % 5) * 0.07,
      spin: ((index % 2) * 2 - 1) * 0.04,
    }
  }, [index, total])

  const z = useRef(startZ)

  useFrame((_, delta) => {
    if (!group.current) return
    z.current += lane.speed * delta
    if (z.current > 2.8) z.current = startZ - 2.5

    // Stay mostly opaque in the viewing zone; only soft fade at far/near edges
    let target = 1
    if (z.current < -9) target = THREE.MathUtils.smoothstep(z.current, -12, -8.5)
    else if (z.current > 1.6) target = 1 - THREE.MathUtils.smoothstep(z.current, 1.6, 2.7)
    target = THREE.MathUtils.clamp(target, 0.15, 1)

    group.current.position.set(
      lane.x,
      lane.y + Math.sin(z.current * 0.4 + index) * 0.08,
      z.current
    )
    group.current.rotation.z = Math.sin(z.current * 0.2 + index) * lane.spin

    matRefs.current.forEach((mat) => {
      if (!mat) return
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, target * (mat.userData.mul ?? 1), 0.12)
    })
  })

  const register = (mul = 1) => (mat) => {
    if (!mat) return
    mat.userData.mul = mul
    if (!matRefs.current.includes(mat)) matRefs.current.push(mat)
  }

  return (
    <group ref={group}>
      <Billboard follow>
        {/* Soft shadow card behind */}
        <mesh position={[0.04, -0.06, -0.03]}>
          <planeGeometry args={[1.32, 1.6]} />
          <meshBasicMaterial
            ref={register(0.35)}
            color="#000000"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
        {/* Polaroid frame — fully solid */}
        <mesh position={[0, -0.02, -0.01]}>
          <planeGeometry args={[1.32, 1.58]} />
          <meshBasicMaterial ref={register(1)} color="#f5f0e8" transparent opacity={1} />
        </mesh>
        {/* Photo — fully opaque */}
        <mesh position={[0, 0.08, 0.02]}>
          <planeGeometry args={[1.14, 1.22]} />
          <meshBasicMaterial
            ref={register(1)}
            map={texture}
            transparent
            opacity={1}
            toneMapped={false}
            depthWrite
          />
        </mesh>
        <Text
          position={[0, -0.7, 0.03]}
          fontSize={0.052}
          maxWidth={1.12}
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
    const arr = new Float32Array(80 * 3)
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7
      arr[i * 3 + 2] = -Math.random() * 22
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
        size={0.022}
        color="#c4a574"
        transparent
        opacity={0.28}
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
      <ambientLight intensity={1.5} />
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
