import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { finaleGroupImage, finalePhotos, site } from '../data/content'
import { LazyImage } from './ui'

function Confetti({ active }) {
  if (!active) return null
  const pieces = Array.from({ length: 40 })

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((_, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-0 h-2 w-2 rounded-sm"
          style={{
            left: `${(i * 7.3) % 100}%`,
            backgroundColor: i % 3 === 0 ? '#c4a574' : i % 3 === 1 ? '#f5f0e8' : '#9a7b4f',
            animationDuration: `${3.5 + (i % 5) * 0.4}s`,
            animationDelay: `${(i % 8) * 0.15}s`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}

export default function Finale() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!inView) return
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 5500)
    return () => clearTimeout(t)
  }, [inView])

  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section
      id="the-end"
      ref={ref}
      className="relative overflow-hidden px-5 py-[var(--spacing-section)] md:px-8"
    >
      <Confetti active={showConfetti} />

      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.35em] uppercase text-accent"
        >
          The End — and After
        </motion.p>

        {/* Slow collage */}
        <div className="relative mx-auto mt-12 h-56 max-w-3xl sm:h-72 md:h-80">
          {finalePhotos.slice(0, 8).map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.8 }}
              className="absolute overflow-hidden rounded-lg border border-cream/10 shadow-xl"
              style={{
                width: `${28 + (i % 3) * 4}%`,
                left: `${8 + (i % 4) * 18}%`,
                top: `${(i % 3) * 22}%`,
                zIndex: i,
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3))}deg)`,
              }}
            >
              <LazyImage
                src={photo.src}
                alt=""
                className="aspect-[4/3] w-full object-cover opacity-80"
              />
            </motion.div>
          ))}

          {/* Final group photo coalescing */}
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="absolute inset-x-[12%] bottom-0 top-[18%] z-20 overflow-hidden rounded-xl border border-accent/30 shadow-2xl"
          >
            <LazyImage
              src={finaleGroupImage}
              alt="Final group photograph"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="mt-16 font-display text-3xl font-medium leading-snug text-cream text-balance md:text-5xl"
        >
          {site.finaleLine1}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mx-auto mt-6 max-w-xl font-display text-lg italic text-cream-muted md:text-xl"
        >
          {site.finaleLine2}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm tracking-[0.3em] uppercase text-accent"
        >
          {site.batchLabel}
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          onClick={replay}
          className="mt-12 rounded-full border border-accent/50 px-8 py-3.5 text-sm tracking-wide text-accent transition hover:bg-accent hover:text-ink"
        >
          Replay Our Story
        </motion.button>
      </div>
    </section>
  )
}
