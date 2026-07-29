/**
 * Cloudinary helpers for community memory uploads.
 *
 * Public cloud name + unsigned preset are safe in the browser.
 * Hardcoded fallbacks avoid Vercel "Sensitive" env vars being omitted from Vite builds.
 */

const cloudName =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'zdsvkmo7'
const uploadPreset =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tint_memories_unsigned'
const galleryTag =
  import.meta.env.VITE_CLOUDINARY_TAG || 'tint_cse_memories'

export function isCloudinaryConfigured() {
  return Boolean(cloudName && uploadPreset)
}

export function cloudinaryDeliveryUrl(publicId, { width = 1200 } = {}) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`
}

function mapResource(r) {
  const caption =
    r.context?.custom?.caption ||
    r.context?.caption ||
    r.original_filename?.replace(/[_-]/g, ' ') ||
    r.filename?.replace(/[_-]/g, ' ') ||
    'A memory from the batch'
  const publicId = r.public_id
  const src = r.secure_url
    ? r.secure_url.replace('/upload/', '/upload/f_auto,q_auto,c_limit,w_1200/')
    : cloudinaryDeliveryUrl(publicId)

  return {
    id: `cld-${publicId}`,
    src,
    caption,
    tags: ['community', 'candid'],
    year: '4',
    polaroid: false,
    createdAt: r.created_at || null,
    fromCloudinary: true,
  }
}

/** Fetch community uploads (server API first, then public tag list). */
export async function fetchCommunityMemories() {
  if (!cloudName) return []

  try {
    const apiRes = await fetch('/api/memories', { cache: 'no-store' })
    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data.configured === false) {
        // fall through to public list
      } else if (Array.isArray(data.resources) && data.resources.length > 0) {
        return data.resources.map(mapResource)
      } else if (!data.error && Array.isArray(data.resources)) {
        // Valid empty result — still try public list as backup
      }
    }
  } catch {
    // fall through
  }

  try {
    const listRes = await fetch(
      `https://res.cloudinary.com/${cloudName}/image/list/${encodeURIComponent(galleryTag)}.json`,
      { cache: 'no-store' }
    )
    if (!listRes.ok) return []
    const data = await listRes.json()
    return (data.resources || [])
      .slice()
      .reverse()
      .map((r) =>
        mapResource({
          ...r,
          public_id: r.public_id,
          secure_url: `https://res.cloudinary.com/${cloudName}/image/upload/${r.public_id}.${r.format}`,
        })
      )
  } catch {
    return []
  }
}

/**
 * Unsigned client upload.
 * Preset is unsigned; tags are required so /api/memories can find the image.
 */
export function uploadMemory(file, { caption = '', onProgress } = {}) {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error('Cloudinary is not configured yet.'))
  }

  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)
    form.append('tags', `${galleryTag},community`)
    const cleanCaption = caption.trim().replace(/[=|]/g, ' ')
    if (cleanCaption) {
      form.append('context', `caption=${cleanCaption}`)
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(
            mapResource({
              ...data,
              context: {
                custom: {
                  caption: cleanCaption || data.original_filename || 'A memory from the batch',
                },
              },
            })
          )
        } else {
          reject(new Error(data.error?.message || `Upload failed (${xhr.status})`))
        }
      } catch {
        reject(new Error('Upload failed'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(form)
  })
}
