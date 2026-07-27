import { motion } from 'framer-motion'

/**
 * Yearbook-style book page that flips open as it enters the viewport.
 */
export default function BookPage({ children, side = 'right', className = '', delay = 0 }) {
  const from = side === 'left' ? 28 : -28

  return (
    <div className={`book-perspective ${className}`}>
      <motion.div
        className="book-page relative origin-left"
        initial={{ opacity: 0, rotateY: from, y: 36 }}
        whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.95,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="book-page-sheen pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12" />
        {children}
      </motion.div>
    </div>
  )
}

export function BookDivider({ label }) {
  return (
    <motion.div
      className="book-perspective relative mx-auto my-10 flex max-w-md items-center justify-center py-6 md:my-14"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="book-page relative z-10 rounded-sm border border-accent/25 bg-ink-elevated px-5 py-2 shadow-lg"
        initial={{ rotateY: -70, opacity: 0 }}
        whileInView={{ rotateY: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <p className="font-display text-sm tracking-[0.2em] uppercase text-accent">
          {label}
        </p>
      </motion.div>
    </motion.div>
  )
}
