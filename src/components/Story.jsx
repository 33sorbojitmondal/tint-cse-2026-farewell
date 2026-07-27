import { chapters } from '../data/content'
import { SectionHeading } from './ui'
import SmartImage from './SmartImage'
import BookPage, { BookDivider } from './BookPage'

export default function Story({ onPhotoClick }) {
  return (
    <section id="story" className="relative px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Story"
          title="Four years. One journey."
          subtitle="From the nervous first day to the final farewell — turn the pages of the years we wrote together."
        />

        <div className="space-y-8 md:space-y-10">
          {chapters.map((chapter, index) => (
            <div key={chapter.id}>
              {index > 0 && <BookDivider label={`Turn to ${chapter.year}`} />}

              <BookPage side={index % 2 === 0 ? 'right' : 'left'} delay={0.05}>
                <article
                  id={chapter.id}
                  className="grid items-center gap-8 rounded-sm border border-ink-border/80 bg-ink-soft/40 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:gap-10 md:p-8 lg:grid-cols-12 lg:gap-12"
                >
                  <div
                    className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <p className="mb-3 text-xs tracking-[0.28em] uppercase text-accent">
                      {chapter.year}
                    </p>
                    <h3 className="font-display text-3xl font-medium text-cream md:text-4xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 font-display text-lg italic text-cream-muted">
                      {chapter.subtitle}
                    </p>
                    <p className="mt-5 text-sm font-light leading-relaxed text-cream-dim md:text-base">
                      {chapter.body}
                    </p>
                  </div>

                  <div
                    className={`grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7 ${
                      index % 2 === 1 ? 'lg:order-1' : ''
                    }`}
                  >
                    {chapter.photos.map((photo, i) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => onPhotoClick?.(photo, chapter.photos)}
                        className={`group relative text-left ${
                          i === 0 ? 'col-span-2' : ''
                        } ${
                          photo.polaroid
                            ? 'rounded-sm bg-cream p-2 shadow-xl'
                            : 'overflow-hidden rounded-lg'
                        }`}
                        style={
                          photo.rotate
                            ? { transform: `rotate(${photo.rotate}deg)` }
                            : undefined
                        }
                      >
                        <SmartImage
                          src={photo.src}
                          alt={photo.caption}
                          className={photo.polaroid ? 'rounded-[2px]' : ''}
                          imgClassName="group-hover:scale-105"
                        />
                        {!photo.polaroid && (
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-xs text-cream opacity-0 transition group-hover:opacity-100">
                            {photo.caption}
                          </span>
                        )}
                        {photo.polaroid && (
                          <span className="mt-2 block px-1 pb-1 text-center font-display text-xs italic text-ink/80">
                            {photo.caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </article>
              </BookPage>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
