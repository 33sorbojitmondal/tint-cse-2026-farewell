import { useCallback, useState } from 'react'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import AudioControl from './components/AudioControl'
import Hero from './components/Hero'
import Story from './components/Story'
import Stats from './components/Stats'
import Awards from './components/Awards'
import Gallery from './components/Gallery'
import HallOfMemory from './components/HallOfMemory'
import VideoSection from './components/VideoSection'
import Creators from './components/Creators'
import Finale from './components/Finale'
import BestOfLuck from './components/BestOfLuck'
import EasterEggs from './components/EasterEggs'
import PhotoLightbox from './components/PhotoLightbox'
import { useScrollProgress } from './hooks/useScrollProgress'
import { creators, site } from './data/content'

export default function App() {
  const progress = useScrollProgress()
  const [logoTrigger, setLogoTrigger] = useState(0)
  const [lightboxRequest, setLightboxRequest] = useState(null)

  const handlePhotoClick = useCallback((photo, collection) => {
    setLightboxRequest({ photo, collection, ts: Date.now() })
  }, [])

  return (
    <div className="film-grain relative min-h-screen bg-ink">
      <ProgressBar progress={progress} />
      <Header onLogoClick={() => setLogoTrigger((n) => n + 1)} />
      <AudioControl />
      <EasterEggs logoTrigger={logoTrigger} />
      <PhotoLightbox
        request={lightboxRequest}
        onClose={() => setLightboxRequest(null)}
      />

      <main>
        <Hero />
        <Story onPhotoClick={handlePhotoClick} />
        <Stats />
        <Awards />
        <Gallery />
        <HallOfMemory />
        <VideoSection />
        <Creators />
        <Finale />
        <BestOfLuck />
      </main>

      <footer className="border-t border-ink-border/50 px-5 py-10 text-center">
        <p className="font-display text-lg text-cream-muted">
          A digital time capsule for {site.collegeName}
        </p>
        <p className="mt-2 text-xs tracking-wide text-cream-dim">
          {site.batchLabel}
        </p>
        <p className="mt-4 text-xs text-cream-dim">
          Created by{' '}
          {creators.map((c, i) => (
            <span key={c.id}>
              {i > 0 && (i === creators.length - 1 ? ' & ' : ', ')}
              <span className="text-accent">{c.name}</span>
            </span>
          ))}
        </p>
      </footer>
    </div>
  )
}
