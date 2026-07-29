/**
 * Lists Cloudinary images tagged for the farewell Memories gallery.
 * Env (Vercel): CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Optional: CLOUDINARY_GALLERY_TAG (default tint_cse_memories)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const tag = process.env.CLOUDINARY_GALLERY_TAG || process.env.VITE_CLOUDINARY_TAG || 'tint_cse_memories'

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(200).json({ configured: false, resources: [] })
  }

  try {
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/by_tag/${encodeURIComponent(tag)}`)
    url.searchParams.set('max_results', '100')
    url.searchParams.set('context', 'true')
    url.searchParams.set('tags', 'true')

    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({
        configured: true,
        error: data.error?.message || 'Cloudinary error',
        resources: [],
      })
    }

    const resources = (data.resources || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((r) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        created_at: r.created_at,
        format: r.format,
        width: r.width,
        height: r.height,
        context: r.context,
        tags: r.tags,
        filename: r.filename || r.public_id.split('/').pop(),
      }))

    return res.status(200).json({ configured: true, resources })
  } catch (err) {
    return res.status(500).json({
      configured: true,
      error: err.message || 'Failed to load memories',
      resources: [],
    })
  }
}
