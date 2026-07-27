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
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    />
  )
}
