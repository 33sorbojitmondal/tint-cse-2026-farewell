import { video } from '../data/content'
import { SectionHeading } from './ui'

export default function VideoSection() {
  return (
    <section className="border-y border-ink-border/40 bg-ink-soft px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="The Reel"
          title={video.title}
          subtitle={video.subtitle}
        />

        <div className="overflow-hidden rounded-2xl border border-ink-border bg-ink shadow-2xl">
          <div className="relative aspect-video">
            <iframe
              src={video.embedUrl}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-cream-dim">
          Replace the embed URL in <code className="text-accent">src/data/content.js</code> with your farewell film.
        </p>
      </div>
    </section>
  )
}
