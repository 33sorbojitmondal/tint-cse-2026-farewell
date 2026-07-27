import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { friends } from '../data/content'
import { LazyImage, SectionHeading } from './ui'

export default function Friends() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="friends" className="book-perspective border-t border-ink-border/40 bg-ink-soft px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Cast"
          title="Friends"
          subtitle="Every person who made the story worth telling. Open a card to step into their page of the yearbook."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {friends.map((friend, i) => (
            <motion.button
              key={friend.id}
              type="button"
              initial={{ opacity: 0, rotateY: i % 2 === 0 ? -22 : 22, y: 28 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelected(friend)}
              className="book-page group text-left"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <LazyImage
                  src={friend.photo}
                  alt={friend.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-accent">
                    {friend.nickname}
                  </p>
                  <h3 className="font-display text-2xl text-cream">{friend.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs font-light text-cream-muted">
                    {friend.personality}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-md sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="friend-modal-title"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink-border bg-ink-elevated shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-cream"
                aria-label="Close profile"
              >
                <X size={16} />
              </button>

              <div className="aspect-[16/11] overflow-hidden">
                <LazyImage
                  src={selected.photo}
                  alt={selected.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-5 p-6 md:p-8">
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-accent">
                    {selected.nickname}
                  </p>
                  <h3
                    id="friend-modal-title"
                    className="font-display text-3xl text-cream"
                  >
                    {selected.name}
                  </h3>
                  <p className="mt-2 text-sm text-cream-muted">{selected.personality}</p>
                </div>

                <blockquote className="border-l border-accent/40 pl-4 font-display text-lg italic text-cream-muted">
                  {selected.dialogue}
                </blockquote>

                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-cream-dim">
                    Funniest memory
                  </p>
                  <p className="mt-1 text-sm font-light text-cream">{selected.funniest}</p>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-cream-dim">
                    A message
                  </p>
                  <p className="mt-1 text-sm font-light leading-relaxed text-cream">
                    {selected.message}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
