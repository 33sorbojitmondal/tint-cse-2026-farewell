import { motion } from 'framer-motion'

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignClass =
    align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 flex max-w-2xl flex-col gap-3 md:mb-16 ${alignClass}`}
    >
      {eyebrow && (
        <p className="text-xs font-medium tracking-[0.28em] uppercase text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl font-medium leading-tight text-cream text-balance md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-base font-light leading-relaxed text-cream-muted md:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

export function LazyImage({ src, alt, className = '', style, onClick, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={style}
      onClick={onClick}
      onError={(e) => {
        const img = e.currentTarget
        if (img.dataset.fallback === '1') return
        img.dataset.fallback = '1'
        // Soft cream placeholder so a broken path never blanks a whole section
        img.src =
          'data:image/svg+xml;charset=utf-8,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="#1a1a1e" width="100%" height="100%"/><text x="50%" y="50%" fill="#c4a574" font-family="Georgia,serif" font-size="28" text-anchor="middle">Memory</text></svg>`
          )
      }}
      {...props}
    />
  )
}
