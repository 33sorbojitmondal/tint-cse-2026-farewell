import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { slamEntries, slamPrompts } from '../data/content'
import { SectionHeading } from './ui'

const STORAGE_KEY = 'farewell-slam-local'

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function SlamBook() {
  const [promptId, setPromptId] = useState(slamPrompts[0].id)
  const [localEntries, setLocalEntries] = useState(loadLocal)
  const [form, setForm] = useState({ author: '', answer: '' })
  const [submitted, setSubmitted] = useState(false)

  const allEntries = useMemo(
    () => [...slamEntries, ...localEntries],
    [localEntries]
  )

  const filtered = allEntries.filter((e) => e.promptId === promptId)
  const activePrompt = slamPrompts.find((p) => p.id === promptId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.author.trim() || !form.answer.trim()) return

    const entry = {
      id: `local-${Date.now()}`,
      author: form.author.trim(),
      promptId,
      answer: form.answer.trim(),
    }
    const next = [...localEntries, entry]
    setLocalEntries(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setForm({ author: '', answer: '' })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <section id="slam-book" className="px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Time Capsule"
          title="Digital Slam Book"
          subtitle="Leave a piece of yourself behind. Answer a prompt — create a collective archive for years from now."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {slamPrompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPromptId(p.id)}
              className={`rounded-full border px-4 py-2 text-xs transition ${
                promptId === p.id
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-ink-border text-cream-muted hover:border-accent/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            {filtered.map((entry, i) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-ink-border bg-ink-soft/70 p-5 md:p-6"
              >
                <p className="font-display text-xl leading-relaxed text-cream md:text-2xl">
                  “{entry.answer}”
                </p>
                <p className="mt-4 text-xs tracking-[0.15em] uppercase text-accent">
                  — {entry.author}
                </p>
              </motion.article>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-cream-dim">No entries yet for this prompt. Be the first.</p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-xl border border-ink-border bg-ink-elevated p-6 lg:col-span-2"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-cream-dim">Your turn</p>
            <h3 className="mt-2 font-display text-2xl text-cream">{activePrompt?.label}</h3>

            <label className="mt-6 block">
              <span className="text-xs text-cream-dim">Name</span>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-ink-border bg-ink px-3 py-2.5 text-sm text-cream outline-none transition focus:border-accent"
                placeholder="Your name"
                required
              />
            </label>

            <label className="mt-4 block">
              <span className="text-xs text-cream-dim">Answer</span>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={4}
                className="mt-1.5 w-full resize-none rounded-lg border border-ink-border bg-ink px-3 py-2.5 text-sm text-cream outline-none transition focus:border-accent"
                placeholder="Write from the heart…"
                required
              />
            </label>

            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-ink transition hover:bg-accent-soft"
            >
              Add to time capsule
            </button>

            {submitted && (
              <p className="mt-3 text-center text-xs text-accent" role="status">
                Saved locally on this device.
              </p>
            )}

            <p className="mt-4 text-[11px] leading-relaxed text-cream-dim">
              Entries are stored in your browser for now. Connect Firebase or Supabase later for shared submissions.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
