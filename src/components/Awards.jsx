import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { awards } from '../data/content'
import { LazyImage, SectionHeading } from './ui'

export default function Awards() {
  const [active, setActive] = useState(null)

  return (
    <section id="honors" className="px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Unofficial Honors"
          title="The Class Representatives"
          subtitle="Six CRs across CSE1, CSE2, and CSE3 — the leaders who carried our voice, our chaos, and our care."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, i) => {
            const isOpen = active === award.id
            return (
              <motion.button
                key={award.id}
                type="button"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.55 }}
                onClick={() => setActive(isOpen ? null : award.id)}
                className={`group overflow-hidden rounded-2xl border text-left transition ${
                  isOpen
                    ? 'border-accent/55 bg-ink-elevated shadow-[0_0_40px_rgba(196,165,116,0.12)]'
                    : 'border-ink-border bg-ink-soft/60 hover:border-accent/35'
                }`}
                aria-expanded={isOpen}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <LazyImage
                    src={award.photo}
                    alt={award.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-accent/40 bg-ink/70 px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-accent backdrop-blur-sm">
                    {award.section}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-accent">{award.tenure}</p>
                    <h3 className="mt-1 font-display text-2xl text-cream">{award.name}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <p className="text-sm text-cream-muted">{award.section} · CR</p>
                  <span className="text-cream-dim transition group-hover:text-accent">
                    {isOpen ? '−' : '+'}
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-ink-border/60 px-5 pb-5 pt-4 text-sm font-light leading-relaxed text-cream-muted">
                        {award.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
