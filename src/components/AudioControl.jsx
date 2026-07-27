import { useEffect, useRef, useState } from 'react'
import { SkipForward, Volume2, VolumeX } from 'lucide-react'
import { playlist } from '../data/content'

/**
 * Ambient farewell playlist — does not autoplay.
 * Tracks live in /public/audio/
 */
export default function AudioControl() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [available, setAvailable] = useState(true)

  const track = playlist[trackIndex] || playlist[0]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    const wasPlaying = !audio.paused
    audio.src = track.src
    audio.load()
    if (wasPlaying || playing) {
      audio.play().catch(() => setAvailable(false))
    }
  }, [trackIndex, track?.src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onError = () => setAvailable(false)
    const onEnded = () => {
      setTrackIndex((i) => (i + 1) % playlist.length)
    }
    audio.addEventListener('error', onError)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('error', onError)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !available) return

    try {
      if (playing) {
        audio.pause()
        setPlaying(false)
      } else {
        audio.volume = 0.35
        await audio.play()
        setPlaying(true)
        setAvailable(true)
      }
    } catch {
      setAvailable(false)
    }
  }

  const next = async () => {
    setTrackIndex((i) => (i + 1) % playlist.length)
    setPlaying(true)
    setAvailable(true)
  }

  return (
    <>
      <audio ref={audioRef} preload="metadata" src={track?.src} />
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {playing && track && (
          <div className="hidden max-w-[160px] truncate rounded-full border border-ink-border bg-ink-elevated/90 px-3 py-2 text-[10px] tracking-wide text-cream-muted backdrop-blur-md sm:block">
            {track.title}
          </div>
        )}
        <button
          type="button"
          onClick={next}
          disabled={!available}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-border bg-ink-elevated/90 text-cream shadow-lg backdrop-blur-md transition hover:border-accent/50 hover:text-accent disabled:opacity-40"
          aria-label="Next track"
          title="Next song"
        >
          <SkipForward size={16} />
        </button>
        <button
          type="button"
          onClick={toggle}
          disabled={!available}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-border bg-ink-elevated/90 text-cream shadow-lg backdrop-blur-md transition hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={playing ? 'Pause music' : 'Play music'}
          title={available ? (playing ? 'Pause' : 'Play farewell playlist') : 'Music unavailable'}
        >
          {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </>
  )
}
