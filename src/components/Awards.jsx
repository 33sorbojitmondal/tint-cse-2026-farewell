import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { awards } from '../data/content'
import { LazyImage, SectionHeading } from './ui'

export default function Awards() {
  const [active, setActive] = useState(null)

  return (
    <section className="px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Batch Awards"
          title="The unofficial honors"
          subtitle="Voted by chaos, certified by friendship. Tap an award to reveal the champion."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, i) => {
            const isOpen = active === award.id
            return (
              <motion.button
                key={award.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActive(isOpen ? null : award.id)}
                className={`group overflow-hidden rounded-xl border text-left transition ${
                  isOpen
                    ? 'border-accent/50 bg-ink-elevated'
                    : 'border-ink-border bg-ink-soft/60 hover:border-accent/30'
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-accent">
                      Superlative
                    </p>
                    <h3 className="mt-1 font-display text-xl text-cream">{award.title}</h3>
                  </div>
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
                      <div className="flex gap-4 border-t border-ink-border/60 p-5 pt-4">
                        <LazyImage
                          src={award.photo}
                          alt={award.name}
                          className="h-24 w-20 shrink-0 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-display text-lg text-cream">{award.name}</p>
                          <p className="mt-1 text-sm font-light leading-relaxed text-cream-muted">
                            {award.description}
                          </p>
                        </div>
                      </div>
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
