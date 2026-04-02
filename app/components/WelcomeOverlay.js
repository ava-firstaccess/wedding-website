'use client'

import { useEffect, useState } from 'react'
import styles from './WelcomeOverlay.module.css'

export default function WelcomeOverlay() {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    // Remove from DOM after CSS animation completes (2s delay + 1.5s fade)
    const timer = setTimeout(() => setMounted(false), 3600)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return <div className={styles.overlay} />
}
