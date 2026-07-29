import { useEffect, useMemo, useState } from 'react'
import Masonry from 'react-masonry-css'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { gallery, galleryFilters } from '../data/content'
import { fetchCommunityMemories } from '../lib/cloudinary'
import { LazyImage, SectionHeading } from './ui'

const PAGE_SIZE = 12

const breakpoints = {
  default: 3,
  1024: 3,
  768: 2,
  0: 1,
}

const filters = galleryFilters

export default function Gallery() {
  const [filter, setFilter] = useState('all')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [index, setIndex] = useState(-1)
  const [community, setCommunity] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchCommunityMemories().then((photos) => {
      // Keep only group-looking community uploads (skip tiny / test assets)
      if (!cancelled) {
        setCommunity(
          photos.filter((p) => !p.src.includes('qfsqt3vtueo2a4pdg4fg') && !p.src.includes('rzwaviavdtpjmffdqllr'))
        )
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const allPhotos = useMemo(() => {
    const ids = new Set(gallery.map((p) => p.id))
    const extras = community.filter((p) => !ids.has(p.id))
    // Featured farewell frames first, then the rest of the archive
    return [...gallery.filter((g) => g.id.startsWith('f')), ...extras, ...gallery.filter((g) => !g.id.startsWith('f'))]
  }, [community])

  const filtered = useMemo(() => {
    if (filter === 'all') return allPhotos
    return allPhotos.filter((p) => p.tags.includes(filter))
  }, [filter, allPhotos])

  const shown = filtered.slice(0, visible)

  const slides = useMemo(
    () =>
      filtered.map((p) => ({
        src: p.src,
        alt: p.caption,
        description: p.caption,
      })),
    [filtered]
  )

  return (
    <section id="memories" className="book-perspective px-5 py-[var(--spacing-section)] md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Archive"
          title="Memories"
          subtitle="An editorial collage of the moments that refuse to fade. Filter, wander, open, remember."
        />

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id)
                setVisible(PAGE_SIZE)
              }}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs tracking-wide transition ${
                filter === f.id
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-ink-border text-cream-muted hover:border-accent/40 hover:text-cream'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Masonry
          breakpointCols={breakpoints}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {shown.map((photo, i) => (
            <motion.button
              key={photo.id}
              type="button"
              initial={{ opacity: 0, rotateY: -12, y: 20 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setIndex(i)}
              className={`book-page group relative w-full overflow-hidden text-left ${
                photo.polaroid
                  ? 'rounded-sm bg-cream p-2.5 shadow-lg'
                  : 'rounded-lg bg-ink-elevated'
              }`}
              style={
                photo.rotate
                  ? { transform: `rotate(${photo.rotate}deg)` }
                  : undefined
              }
            >
              {photo.fromCloudinary && (
                <span className="absolute left-3 top-3 z-10 rounded-full border border-accent/40 bg-ink/75 px-2 py-0.5 text-[9px] tracking-[0.18em] uppercase text-accent backdrop-blur-sm">
                  Batch upload
                </span>
              )}
              <LazyImage
                src={photo.src}
                alt={photo.caption}
                className={`w-full object-contain transition duration-700 group-hover:scale-[1.03] ${
                  photo.polaroid ? 'rounded-[2px]' : ''
                }`}
              />
              <div
                className={
                  photo.polaroid
                    ? 'px-1 pt-2 pb-1 text-center'
                    : 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-4 opacity-0 transition group-hover:opacity-100'
                }
              >
                <p
                  className={`text-sm ${
                    photo.polaroid
                      ? 'font-display italic text-ink/85'
                      : 'font-light text-cream'
                  }`}
                >
                  {photo.caption}
                </p>
              </div>
            </motion.button>
          ))}
        </Masonry>

        {visible < filtered.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full border border-ink-border px-8 py-3 text-sm tracking-wide text-cream-muted transition hover:border-accent hover:text-accent"
            >
              Load more memories
            </button>
          </div>
        )}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(10,10,11,0.96)' },
        }}
      />
    </section>
  )
}
