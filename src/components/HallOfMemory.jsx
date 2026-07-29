import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Scan, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import { gallery, hallSoundtrack, site } from '../data/content'
import {
  WebGLErrorBoundary,
  canUseWebGL,
  openCameraStream,
  toArPhotoUrl,
  useIsCoarsePointer,
} from '../lib/device'
import { LazyImage, SectionHeading } from './ui'
import MemoryScene from './hall/MemoryScene'

function useHallMusic(active) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const track = hallSoundtrack

  useEffect(() => {
    if (!active || !track) {
      audioRef.current?.pause()
      if (audioRef.current) audioRef.current.currentTime = 0
      return
    }

    document.querySelectorAll('audio').forEach((el) => {
      if (el !== audioRef.current) el.pause()
    })

    const audio = new Audio(track.src)
    audio.volume = track.volume ?? 0.36
    audio.loop = true
    audio.setAttribute('playsinline', 'true')
    audioRef.current = audio

    const start = () => {
      audio.play().catch(() => {})
    }

    if (audio.readyState >= 1) start()
    else audio.addEventListener('loadedmetadata', start, { once: true })

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [active, track])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  return { muted, setMuted, track }
}

/** CSS panorama for devices without reliable WebGL. */
function FallbackPanorama({ photos }) {
  return (
    <div className="absolute inset-0 flex items-center overflow-x-auto overflow-y-hidden px-6 snap-x snap-mandatory">
      <div className="mx-auto flex min-w-max items-center gap-5 py-10">
        {photos.map((photo) => (
          <figure
            key={photo.id}
            className="snap-center w-[72vw] max-w-[320px] shrink-0 overflow-hidden rounded-sm bg-[#f4efe6] p-2.5 shadow-xl sm:w-[280px]"
          >
            <LazyImage
              src={toArPhotoUrl(photo.src)}
              alt={photo.caption}
              className="aspect-[16/10] w-full object-cover"
            />
            <figcaption className="mt-2 px-1 text-center font-display text-sm italic text-ink/80">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export default function HallOfMemory() {
  const [open, setOpen] = useState(false)
  const [arReady, setArReady] = useState(false)
  const [arError, setArError] = useState('')
  const [webglOk, setWebglOk] = useState(true)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const isMobile = useIsCoarsePointer()

  const photos = useMemo(() => {
    const featured = gallery
      .filter((g) => g.id.startsWith('f'))
      .map((g) => ({ ...g, landscape: true }))
    const extras = gallery
      .filter(
        (g) =>
          !g.id.startsWith('f') &&
          (g.tags.includes('farewell') || g.tags.includes('friends')) &&
          !g.src.includes('duo')
      )
      .slice(0, 4)
      .map((g) => ({ ...g, landscape: true }))
    return [...featured.slice(0, 6), ...extras].slice(0, isMobile ? 6 : 8)
  }, [isMobile])

  const { muted, setMuted, track } = useHallMusic(open)

  useEffect(() => {
    setWebglOk(canUseWebGL())
  }, [])

  useEffect(() => {
    if (!open) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      setArReady(false)
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.documentElement.style.overflow = 'hidden'

    let cancelled = false

    ;(async () => {
      try {
        const stream = await openCameraStream()
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          video.setAttribute('playsinline', 'true')
          video.setAttribute('webkit-playsinline', 'true')
          video.muted = true
          video.defaultMuted = true
          video.playsInline = true
          const playPromise = video.play()
          if (playPromise?.catch) await playPromise.catch(() => {})
        }
        setArReady(true)
        setArError('')
      } catch {
        setArError('Camera unavailable — memory panorama still works.')
        setArReady(false)
      }
    })()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const use3d = webglOk

  return (
    <section id="hall" className="relative overflow-hidden px-5 py-[var(--spacing-section)] md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,165,116,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <SectionHeading
          eyebrow="Augmented Memory"
          title="Hall of Memory"
          subtitle="Stand in the middle of a circular memory panorama — turn around to see every frame."
        />

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="group relative mx-auto inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent/50 bg-accent/10 px-8 py-4 text-sm tracking-wide text-accent transition hover:bg-accent hover:text-ink"
        >
          <Scan size={18} className="transition group-hover:scale-110" />
          Enter AR Hall of Memory
          <Sparkles size={16} />
        </motion.button>

        <p className="mt-4 text-xs text-cream-dim">
          Allows camera when available · Music starts when you enter · Look around the ring
        </p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] h-[100dvh] w-full bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Hall of Memory AR experience"
          >
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              controls={false}
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                arReady ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transform: 'translateZ(0)' }}
            />
            {!arReady && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2a2418_0%,#0a0a0b_75%)]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/45" />

            <div className="absolute inset-0" style={{ touchAction: use3d ? 'none' : 'pan-x' }}>
              {use3d ? (
                <WebGLErrorBoundary
                  fallback={
                    <FallbackPanorama photos={photos} />
                  }
                >
                  <Canvas
                    camera={{ position: [0, 0.05, 0.01], fov: isMobile ? 68 : 62, near: 0.05, far: 40 }}
                    dpr={isMobile ? [1, 1.15] : [1, 1.5]}
                    gl={{
                      alpha: true,
                      antialias: false,
                      premultipliedAlpha: false,
                      powerPreference: 'default',
                      failIfMajorPerformanceCaveat: false,
                    }}
                    onCreated={({ gl }) => {
                      gl.setClearColor(0x000000, 0)
                      const canvas = gl.domElement
                      canvas.addEventListener('webglcontextlost', (e) => {
                        e.preventDefault()
                        setWebglOk(false)
                      })
                    }}
                    style={{ background: 'transparent', touchAction: 'none' }}
                  >
                    <Suspense fallback={null}>
                      <MemoryScene photos={photos} lowPower={isMobile} />
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.08}
                        target={[0, 0.05, 0]}
                        maxPolarAngle={Math.PI * 0.65}
                        minPolarAngle={Math.PI * 0.35}
                        rotateSpeed={isMobile ? 0.85 : 0.55}
                      />
                    </Suspense>
                  </Canvas>
                </WebGLErrorBoundary>
              ) : (
                <FallbackPanorama photos={photos} />
              )}
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-accent">Hall of Memory</p>
                <p className="mt-1 font-display text-xl text-cream md:text-2xl">
                  {site.collegeShort} · {site.batchYear}
                </p>
                {arError && <p className="mt-2 max-w-xs text-xs text-cream-muted">{arError}</p>}
                {!use3d && (
                  <p className="mt-2 max-w-xs text-xs text-cream-muted">
                    Swipe sideways through the memory strip.
                  </p>
                )}
              </div>
              <div className="pointer-events-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-border/80 bg-ink/70 text-cream backdrop-blur-md"
                  aria-label={muted ? 'Unmute music' : 'Mute music'}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-border/80 bg-ink/70 text-cream backdrop-blur-md"
                  aria-label="Exit Hall of Memory"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center md:p-8">
              <p className="font-display text-base italic text-cream/90 md:text-xl">
                {use3d ? 'Turn around — memories circle you…' : 'Swipe through the farewell frames…'}
              </p>
              {track && (
                <p className="mt-2 text-xs tracking-wide text-accent">♪ {track.title}</p>
              )}
              <p className="mt-2 text-xs tracking-wide text-cream-dim">
                {use3d
                  ? isMobile
                    ? 'Swipe to look around · Tap ✕ to leave'
                    : 'Drag to look around · Tap ✕ to leave'
                  : 'Swipe the strip · Tap ✕ to leave'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
