import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { finalePhotos, site } from '../data/content'
import { LazyImage } from './ui'

function SparkBurst({ active }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        id: i,
        left: `${(i * 11.3) % 100}%`,
        delay: (i % 12) * 0.08,
        duration: 2.8 + (i % 6) * 0.35,
        color: i % 4 === 0 ? '#c4a574' : i % 4 === 1 ? '#f5f0e8' : i % 4 === 2 ? '#d4b896' : '#9a7b4f',
        size: 4 + (i % 5),
      })),
    []
  )

  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {sparks.map((s) => (
        <span
          key={s.id}
          className="luck-spark absolute top-[-8%] rounded-sm"
          style={{
            left: s.left,
            width: s.size,
            height: s.size * 1.4,
            backgroundColor: s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: `0 0 12px ${s.color}`,
          }}
        />
      ))}
    </div>
  )
}

function OrbitalPhotos() {
  const ring = finalePhotos.slice(0, 6)
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="luck-orbit relative h-[min(70vw,420px)] w-[min(70vw,420px)]">
        {ring.map((photo, i) => {
          const angle = (i / ring.length) * 360
          return (
            <div
              key={photo.id}
              className="absolute left-1/2 top-1/2 h-16 w-12 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-accent/30 shadow-lg sm:h-20 sm:w-16"
              style={{
                transform: `rotate(${angle}deg) translateY(-160px) rotate(${-angle}deg)`,
              }}
            >
              <LazyImage src={photo.src} alt="" className="h-full w-full object-cover opacity-80" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const titleWords = ['Best', 'of', 'luck']

export default function BestOfLuck() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (!inView) return
    setBurst(true)
    const t = setTimeout(() => setBurst(false), 7000)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <section
      id="best-of-luck"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-[var(--spacing-section)] md:px-8"
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,165,116,0.18)_0%,transparent_55%)]" />
      <div className="luck-rays absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

      <SparkBurst active={burst} />
      <OrbitalPhotos />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          className="text-[10px] uppercase text-accent md:text-xs"
        >
          One last wish · {site.batchLabel}
        </motion.p>

        <h2 className="mt-8 font-display text-5xl font-medium leading-[1.05] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
          {titleWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 48, rotateX: 40 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="mr-[0.22em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 1 }}
            className="luck-shimmer mt-2 inline-block bg-gradient-to-r from-accent-deep via-accent-soft to-accent-deep bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            for the future
          </motion.span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="mx-auto mt-10 h-px w-40 origin-center bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.25, duration: 0.9 }}
          className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-cream-muted md:text-2xl"
        >
          {site.bestOfLuckLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          <p className="text-sm tracking-[0.28em] uppercase text-accent">
            Go brilliantly · {site.collegeShort} CSE {site.batchYear}
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full border border-accent/60 bg-accent/10 px-10 py-4 text-sm tracking-[0.2em] uppercase text-accent transition hover:bg-accent hover:text-ink"
          >
            Begin again
          </motion.button>
        </motion.div>
      </div>

      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(10,10,11,0.85)]" />
    </section>
  )
}
