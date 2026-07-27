import { useEffect, useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

export default function PhotoLightbox({ request, onClose }) {
  const [index, setIndex] = useState(-1)

  const slides = useMemo(() => {
    if (!request?.collection?.length) return []
    return request.collection.map((p) => ({
      src: p.src,
      alt: p.caption,
      description: p.caption,
    }))
  }, [request])

  useEffect(() => {
    if (!request?.photo || !request.collection) {
      setIndex(-1)
      return
    }
    const idx = request.collection.findIndex((p) => p.id === request.photo.id)
    setIndex(idx >= 0 ? idx : 0)
  }, [request])

  return (
    <Lightbox
      open={index >= 0}
      close={() => {
        setIndex(-1)
        onClose?.()
      }}
      index={index}
      slides={slides}
      plugins={[Zoom]}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: { backgroundColor: 'rgba(10,10,11,0.96)' },
      }}
    />
  )
}
