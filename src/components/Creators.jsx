import { motion } from 'framer-motion'
import { creators } from '../data/content'
import { LazyImage, SectionHeading } from './ui'

export default function Creators() {
  return (
    <section
      id="creators"
      className="border-t border-ink-border/40 bg-ink-soft px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Made With Love"
          title="Creators"
          subtitle="Crafted by two friends from the batch."
        />

        <div className="flex flex-wrap items-start justify-center gap-10 sm:gap-14">
          {creators.map((person, i) => (
            <motion.article
              key={person.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex w-[140px] flex-col items-center text-center sm:w-[160px]"
            >
              <div className="h-20 w-20 overflow-hidden rounded-full border border-accent/40 p-0.5 sm:h-24 sm:w-24">
                <LazyImage
                  src={person.photo}
                  alt={person.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <p className="mt-4 text-[9px] tracking-[0.28em] uppercase text-accent">
                {person.role}
              </p>
              <h3 className="mt-1.5 font-display text-lg leading-tight text-cream sm:text-xl">
                {person.name}
              </h3>
              <p className="mt-2 text-[11px] font-light leading-relaxed text-cream-dim">
                {person.bio}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
