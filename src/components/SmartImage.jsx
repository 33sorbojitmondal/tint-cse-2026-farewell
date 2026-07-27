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
        className={`h-full w-full object-contain transition duration-700 ${imgClassName}`}
      />
    </div>
  )
}
