import { useState } from 'react'

/**
 * Displays a photo using its natural orientation (landscape vs portrait)
 * instead of forcing a fixed crop that can make sideways shots look wrong.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  onClick,
  prefer = 'auto', // 'auto' | 'landscape' | 'portrait'
}) {
  const [orientation, setOrientation] = useState(
    prefer === 'auto' ? null : prefer
  )

  const resolved = orientation || 'landscape'
  const frameClass =
    resolved === 'portrait'
      ? 'aspect-[3/4] max-h-[520px]'
      : 'aspect-[16/10] w-full'

  return (
    <div className={`relative overflow-hidden bg-ink-elevated ${frameClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onClick={onClick}
        onLoad={(e) => {
          if (prefer !== 'auto') return
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget
          if (w && h) setOrientation(w >= h ? 'landscape' : 'portrait')
        }}
        onError={(e) => {
          const img = e.currentTarget
          if (img.dataset.fallback === '1') return
          img.dataset.fallback = '1'
          img.src =
            'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="#1a1a1e" width="100%" height="100%"/><text x="50%" y="50%" fill="#c4a574" font-family="Georgia,serif" font-size="28" text-anchor="middle">Memory</text></svg>`
            )
        }}
        className={`h-full w-full object-contain transition duration-700 ${imgClassName}`}
      />
    </div>
  )
}
