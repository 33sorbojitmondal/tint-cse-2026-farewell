import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { finalePhotos, site } from '../data/content'
import { LazyImage } from './ui'

function SparkBurst({ active }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 13.7) % 100}%`,
        delay: (i % 10) * 0.1,
        duration: 3 + (i % 5) * 0.4,
        color: i % 3 === 0 ? '#c4a574' : i % 3 === 1 ? '#f5f0e8' : '#9a7b4f',
        size: 3 + (i % 4),
      })),
    []
  )

  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {sparks.map((s) => (
        <span
          key={s.id}
          className="luck-spark absolute top-[-6%] rounded-sm"
          style={{
            left: s.left,
            width: s.size,
            height: s.size * 1.5,
            backgroundColor: s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
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
      <div className="luck-orbit relative h-[min(88vw,520px)] w-[min(88vw,520px)]">
        {ring.map((photo, i) => {
          const angle = (i / ring.length) * 360
          return (
            <div
              key={photo.id}
              className="absolute left-1/2 top-1/2 h-[4.25rem] w-[5.5rem] overflow-hidden rounded-md border border-accent/35 shadow-lg sm:h-24 sm:w-32"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * min(42vw, 248px))) rotate(${-angle}deg)`,
              }}
            >
              <LazyImage src={photo.src} alt="" className="h-full w-full object-cover" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function BestOfLuck() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (!inView) return
    setBurst(true)
    const t = setTimeout(() => setBurst(false), 6500)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <section
      id="best-of-luck"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-[var(--spacing-section)] md:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,165,116,0.16)_0%,transparent_55%)]" />
      <div className="luck-rays absolute inset-0 opacity-50" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

      <SparkBurst active={burst} />
      <OrbitalPhotos />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.35em] uppercase text-accent md:text-xs"
        >
          One last wish · {site.batchLabel}
        </motion.p>

        <h2 className="mt-8 font-display text-5xl font-medium leading-[1.08] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
          <motion.span
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            Best of luck
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="luck-shimmer mt-1 inline-block bg-gradient-to-r from-accent-deep via-accent-soft to-accent-deep bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            for the future
          </motion.span>
        </h2>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.95, duration: 0.85 }}
          className="mx-auto mt-10 h-px w-44 origin-center bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.85 }}
          className="mx-auto mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-cream-muted md:text-2xl"
        >
          {site.bestOfLuckLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.35, duration: 0.75 }}
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

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(10,10,11,0.85)]" />
    </section>
  )
}
