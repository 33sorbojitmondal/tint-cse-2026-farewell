import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { stats } from '../data/content'
import { SectionHeading } from './ui'

function AnimatedCounter({ value, suffix, active }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    let frame
    const duration = 1600
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value])

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative border-y border-ink-border/50 bg-ink-soft px-5 py-[var(--spacing-section)] md:px-8">
      <div className="pointer-events-none absolute inset-0 paper-texture opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="By The Numbers"
          title="Our College in Numbers"
          subtitle="Proof that we lived these years fully — measured in chai, chaos, and captured moments."
        />

        <div
          ref={ref}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3 lg:gap-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="border-t border-accent/30 pt-5"
            >
              <p className="font-display text-4xl font-medium text-cream md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} active={inView} />
              </p>
              <p className="mt-2 text-xs tracking-wide text-cream-dim md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
