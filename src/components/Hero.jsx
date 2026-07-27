import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { heroImage, site } from '../data/content'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-45 blur-[2px]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0b_75%)]" />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="animate-float absolute h-1 w-1 rounded-full bg-accent/50"
            style={{
              left: `${8 + i * 7.5}%`,
              top: `${15 + (i % 5) * 14}%`,
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-xs font-medium tracking-[0.35em] uppercase text-accent"
        >
          {site.batchLabel}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-medium leading-[1.1] text-cream text-balance sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {site.collegeName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-4 text-sm tracking-[0.2em] uppercase text-cream-muted md:text-base"
        >
          {site.department}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="my-8 h-px w-24 origin-center bg-accent/60"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="max-w-xl font-display text-xl italic font-normal leading-relaxed text-cream-muted md:text-2xl"
        >
          {site.tagline}
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          onClick={() =>
            document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="mt-14 flex flex-col items-center gap-2 text-cream-dim transition hover:text-accent"
          aria-label="Scroll to begin the story"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Begin</span>
          <ChevronDown size={18} className="animate-bounce" />
        </motion.button>
      </div>
    </section>
  )
}
