import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { easterEggs, site } from '../data/content'
import { LazyImage } from './ui'

export default function EasterEggs({ logoTrigger, onLogoHandled }) {
  const [secretPhoto, setSecretPhoto] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [hint, setHint] = useState('')

  useEffect(() => {
    if (!logoTrigger) return
    setSecretPhoto(true)
    onLogoHandled?.()
  }, [logoTrigger, onLogoHandled])

  // Konami-ish: press "S" three times quickly to open secret code panel
  useEffect(() => {
    let count = 0
    let timer
    const onKey = (e) => {
      if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        count += 1
        clearTimeout(timer)
        timer = setTimeout(() => {
          count = 0
        }, 800)
        if (count >= 3) {
          setCodeOpen(true)
          count = 0
        }
      }
      if (e.key === 'Escape') {
        setSecretPhoto(false)
        setCodeOpen(false)
        setUnlocked(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [])

  const tryUnlock = (e) => {
    e.preventDefault()
    if (code.trim().toLowerCase() === site.secretCode.toLowerCase()) {
      setUnlocked(true)
      setHint('')
    } else {
      setHint('Not quite. Think of a familiar ritual…')
    }
  }

  return (
    <>
      {/* Floating hint for explorers */}
      <button
        type="button"
        onClick={() => setCodeOpen(true)}
        className="fixed bottom-5 left-5 z-40 text-[10px] tracking-[0.2em] uppercase text-cream-dim/40 transition hover:text-accent"
        aria-label="Open secret code"
      >
        ···
      </button>

      <AnimatePresence>
        {secretPhoto && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSecretPhoto(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl"
            >
              <button
                type="button"
                className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream"
                onClick={() => setSecretPhoto(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <LazyImage
                src={easterEggs.logoPhoto}
                alt={easterEggs.logoCaption}
                className="rounded-xl border border-accent/30 shadow-2xl"
              />
              <p className="mt-4 text-center font-display text-lg italic text-cream-muted">
                {easterEggs.logoCaption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {codeOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setCodeOpen(false)
              setUnlocked(false)
              setCode('')
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-ink-border bg-ink-elevated p-8"
            >
              {!unlocked ? (
                <form onSubmit={tryUnlock}>
                  <p className="text-xs tracking-[0.25em] uppercase text-accent">Secret</p>
                  <h3 className="mt-2 font-display text-2xl text-cream">
                    Enter the inside joke
                  </h3>
                  <p className="mt-2 text-sm text-cream-dim">
                    Hint: our favorite exam-week ritual (two words).
                  </p>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-5 w-full rounded-lg border border-ink-border bg-ink px-4 py-3 text-cream outline-none focus:border-accent"
                    placeholder="········"
                    autoFocus
                  />
                  {hint && <p className="mt-2 text-xs text-accent">{hint}</p>}
                  <button
                    type="submit"
                    className="mt-5 w-full rounded-full bg-accent py-3 text-sm font-medium text-ink"
                  >
                    Unlock
                  </button>
                </form>
              ) : (
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-accent">Unlocked</p>
                  <p className="mt-4 font-display text-xl leading-relaxed text-cream">
                    {site.secretMessage}
                  </p>
                  <p className="mt-6 text-xs text-cream-dim">{easterEggs.audioClipNote}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
