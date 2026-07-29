import { Component, useEffect, useMemo, useState } from 'react'

/** True when the device can create a WebGL context. */
export function canUseWebGL() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

/** Map a gallery path to a smaller AR-optimized copy when available. */
export function toArPhotoUrl(src) {
  if (!src) return src
  const name = src.split('/').pop()
  if (!name) return src
  return `/photos/ar/${name}`
}

/**
 * getUserMedia with vendor prefixes + constraint fallbacks.
 * Works on older Safari / Chrome Android builds.
 */
export async function openCameraStream() {
  const md = navigator.mediaDevices
  const legacy =
    navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices) ||
    navigator.webkitGetUserMedia?.bind(navigator) ||
    navigator.mozGetUserMedia?.bind(navigator)

  if (!md?.getUserMedia && !legacy) {
    throw new Error('Camera API unavailable')
  }

  const getUserMedia = (constraints) => {
    if (md?.getUserMedia) return md.getUserMedia(constraints)
    return new Promise((resolve, reject) => {
      legacy(constraints, resolve, reject)
    })
  }

  const attempts = [
    { video: { facingMode: { ideal: 'environment' } }, audio: false },
    { video: { facingMode: 'environment' }, audio: false },
    { video: { facingMode: 'user' }, audio: false },
    { video: true, audio: false },
  ]

  let lastError
  for (const constraints of attempts) {
    try {
      return await getUserMedia(constraints)
    } catch (err) {
      lastError = err
    }
  }
  throw lastError || new Error('Camera unavailable')
}

export class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.setState({ failed: true })
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])
  return reduced
}

export function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)')
    const sync = () => setCoarse(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])
  return coarse
}
