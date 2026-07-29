import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Loader2, Upload, X } from 'lucide-react'
import { isCloudinaryConfigured, uploadMemory } from '../lib/cloudinary'

export default function MemoryUpload({ onUploaded }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const inputRef = useRef(null)
  const titleId = useId()
  const configured = isCloudinaryConfigured()

  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const reset = () => {
    setFile(null)
    setCaption('')
    setProgress(0)
    setError('')
    setDone(false)
    setBusy(false)
  }

  const close = () => {
    if (busy) return
    setOpen(false)
    reset()
  }

  const onPick = (e) => {
    const next = e.target.files?.[0]
    if (!next) return
    if (!next.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(next.name)) {
      setError('Please choose an image (JPG, PNG, WEBP, or HEIC).')
      return
    }
    if (next.size > 10 * 1024 * 1024) {
      setError('Keep images under 10MB (Cloudinary free plan limit).')
      return
    }
    setError('')
    setFile(next)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!file || busy) return
    setBusy(true)
    setError('')
    setProgress(0)
    try {
      const photo = await uploadMemory(file, {
        caption: caption || 'A memory from the batch',
        onProgress: setProgress,
      })
      setDone(true)
      onUploaded?.(photo)
      setTimeout(() => {
        setOpen(false)
        reset()
      }, 900)
    } catch (err) {
      setError(err.message || 'Upload failed. Try again.')
      setBusy(false)
    }
  }

  if (!configured) {
    return (
      <p className="mb-8 text-center text-xs text-cream-dim">
        Community uploads unlock once Cloudinary is connected.
      </p>
    )
  }

  return (
    <>
      <div className="mb-10 flex justify-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-6 py-3 text-sm tracking-wide text-accent transition hover:bg-accent hover:text-ink"
        >
          <ImagePlus size={16} />
          Add your memory
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-ink-border bg-ink-elevated shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-ink-border/70 px-5 py-4">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-accent">From the batch</p>
                  <h3 id={titleId} className="font-display text-2xl text-cream">
                    Upload a memory
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-ink-border p-2 text-cream-muted hover:text-cream"
                  aria-label="Close upload"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4 p-5">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink-border bg-ink-soft/80 transition hover:border-accent/40"
                >
                  {preview ? (
                    <img src={preview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex flex-col items-center gap-2 text-cream-dim">
                      <Upload size={22} />
                      <span className="text-xs tracking-wide">Tap to choose a photo</span>
                    </span>
                  )}
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPick}
                />

                <label className="block">
                  <span className="mb-1.5 block text-[10px] tracking-[0.2em] uppercase text-cream-dim">
                    Caption
                  </span>
                  <input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={80}
                    placeholder="What made this moment special?"
                    className="w-full rounded-lg border border-ink-border bg-ink px-3 py-2.5 text-sm text-cream outline-none placeholder:text-cream-dim focus:border-accent/50"
                  />
                </label>

                {busy && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-border">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {error && <p className="text-sm text-red-300">{error}</p>}
                {done && <p className="text-sm text-accent">Added to Memories. Thank you.</p>}

                <button
                  type="submit"
                  disabled={!file || busy}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm tracking-wide text-ink transition enabled:hover:bg-accent-soft disabled:opacity-40"
                >
                  {busy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading… {progress}%
                    </>
                  ) : (
                    <>
                      <ImagePlus size={16} />
                      Share with the batch
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
