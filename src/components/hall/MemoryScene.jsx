import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { toArPhotoUrl } from '../../lib/device'

const RING_Y = 0.05
const RING_RADIUS = 3.35

/** Load a texture without Suspense so one failed URL cannot blank the whole hall. */
function useSafeTexture(url) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!url) return undefined
    let alive = true
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')

    loader.load(
      url,
      (tex) => {
        if (!alive) {
          tex.dispose()
          return
        }
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.needsUpdate = true
        setMap(tex)
      },
      undefined,
      () => {
        if (alive) setMap(null)
      }
    )

    return () => {
      alive = false
      setMap((prev) => {
        prev?.dispose?.()
        return null
      })
    }
  }, [url])

  return map
}

function RingMemory({ url, caption, index, total, landscape }) {
  const group = useRef(null)
  const texture = useSafeTexture(url)

  const slot = useMemo(() => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    return {
      x: Math.sin(angle) * RING_RADIUS,
      z: -Math.cos(angle) * RING_RADIUS,
    }
  }, [index, total])

  useFrame(() => {
    if (!group.current) return
    group.current.lookAt(0, RING_Y, 0)
  })

  const frameW = landscape ? 1.55 : 1.2
  const frameH = landscape ? 1.15 : 1.45
  const photoW = landscape ? 1.38 : 1.02
  const photoH = landscape ? 0.88 : 1.1

  return (
    <group ref={group} position={[slot.x, RING_Y, slot.z]}>
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
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} depthWrite side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color="#d8cfc0" toneMapped={false} depthWrite side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  )
}

function SoftDust({ enabled }) {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const count = enabled ? 32 : 0
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 1.2 + Math.random() * 4
      arr[i * 3] = Math.sin(a) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.2
      arr[i * 3 + 2] = -Math.cos(a) * r
    }
    return arr
  }, [enabled])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  if (!enabled) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#c4a574"
        transparent
        opacity={0.14}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/**
 * Circular panorama at one eye level.
 * Uses lightweight AR assets + safe texture loading (no CDN fonts / no Suspense hang).
 */
export default function MemoryScene({ photos, lowPower = false }) {
  const orbit = useRef(null)
  const items = useMemo(
    () =>
      photos.slice(0, lowPower ? 6 : 10).map((p) => ({
        ...p,
        arSrc: toArPhotoUrl(p.src),
      })),
    [photos, lowPower]
  )

  useFrame((_, delta) => {
    if (orbit.current) orbit.current.rotation.y += delta * (lowPower ? 0.03 : 0.045)
  })

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[2, 3, 2]} intensity={0.35} />
      <SoftDust enabled={!lowPower} />
      <group ref={orbit}>
        {items.map((photo, i) => (
          <RingMemory
            key={`${photo.id}-${i}`}
            url={photo.arSrc}
            caption={photo.caption}
            index={i}
            total={items.length}
            landscape={photo.landscape !== false}
          />
        ))}
      </group>
    </>
  )
}
