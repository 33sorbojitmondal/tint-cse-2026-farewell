import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { Scan, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import { gallery, playlist, site } from '../data/content'
import { SectionHeading } from './ui'
import MemoryScene from './hall/MemoryScene'

function useHallMusic(active) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const track = playlist[trackIndex] || playlist[0]

  useEffect(() => {
    if (!active) {
      audioRef.current?.pause()
      if (audioRef.current) audioRef.current.currentTime = 0
      return
    }

    const audio = new Audio(track.src)
    audio.volume = 0.34
    audioRef.current = audio

    const onEnded = () => {
      setTrackIndex((i) => (i + 1) % playlist.length)
    }
    audio.addEventListener('ended', onEnded)

    audio.play().catch(() => {})

    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      audio.src = ''
    }
  }, [active, track?.src])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  return { muted, setMuted, track }
}

export default function HallOfMemory() {
  const [open, setOpen] = useState(false)
  const [arReady, setArReady] = useState(false)
  const [arError, setArError] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const photos = useMemo(
    () =>
      gallery.filter(
        (g) =>
          g.tags.includes('friends') ||
          g.tags.includes('farewell') ||
          g.tags.includes('college-fest')
      ),
    []
  )
  const { muted, setMuted, track } = useHallMusic(open)

  useEffect(() => {
    if (!open) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      setArReady(false)
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    let cancelled = false

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setArReady(true)
        setArError('')
      } catch {
        setArError('Camera unavailable — immersive hall mode is still on.')
        setArReady(false)
      }
    })()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <section id="hall" className="relative overflow-hidden px-5 py-[var(--spacing-section)] md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,165,116,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <SectionHeading
          eyebrow="Augmented Memory"
          title="Hall of Memory"
          subtitle="Step into an AR hall where batch photographs drift toward you — with soft music in the background."
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
          Allows camera for AR view · Music starts when you enter · Drag to look around
        </p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] bg-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Hall of Memory AR experience"
          >
            {/* AR camera layer */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                arReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!arReady && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a1814_0%,#0a0a0b_70%)]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/70" />

            {/* 3D memory layer */}
            <div className="absolute inset-0">
              <Canvas
                camera={{ position: [0, 0, 0.1], fov: 60, near: 0.1, far: 60 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
              >
                <Suspense fallback={null}>
                  <MemoryScene photos={photos} />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI * 0.72}
                    minPolarAngle={Math.PI * 0.28}
                    rotateSpeed={0.55}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* HUD */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 md:p-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-accent">Hall of Memory</p>
                <p className="mt-1 font-display text-xl text-cream md:text-2xl">{site.collegeShort} · {site.batchYear}</p>
                {arError && <p className="mt-2 max-w-xs text-xs text-cream-muted">{arError}</p>}
              </div>
              <div className="pointer-events-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-border/80 bg-ink/70 text-cream backdrop-blur-md"
                  aria-label={muted ? 'Unmute music' : 'Mute music'}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-border/80 bg-ink/70 text-cream backdrop-blur-md"
                  aria-label="Exit Hall of Memory"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 text-center md:p-8">
              <p className="font-display text-lg italic text-cream/90 md:text-xl">
                Memories are walking toward you…
              </p>
              {track && (
                <p className="mt-2 text-xs tracking-wide text-accent">♪ {track.title}</p>
              )}
              <p className="mt-2 text-xs tracking-wide text-cream-dim">
                Drag or swipe to look around · Tap ✕ to leave
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
