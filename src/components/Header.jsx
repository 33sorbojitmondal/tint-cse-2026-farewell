import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navigation, site } from '../data/content'

export default function Header({ onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/80 backdrop-blur-xl border-b border-ink-border/60'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={onLogoClick}
          className="group flex items-center gap-3 text-left"
          aria-label="College logo — click for a secret"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 transition group-hover:border-accent group-hover:bg-accent/10">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="hidden sm:block">
            <span className="font-display text-lg font-medium tracking-wide text-cream">
              {site.collegeShort || site.collegeName.split(' ')[0]}
            </span>
            <span className="ml-2 text-xs tracking-[0.2em] uppercase text-cream-dim">
              {site.batchYear}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className="px-3 py-2 text-sm font-light tracking-wide text-cream-muted transition hover:text-cream"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-ink-border text-cream"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden border-t border-ink-border bg-ink/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col px-5 py-6" aria-label="Mobile">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className="border-b border-ink-border/50 py-4 text-left font-display text-2xl text-cream"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
