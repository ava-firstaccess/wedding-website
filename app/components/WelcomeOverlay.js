'use client'

import { useEffect, useState } from 'react'
import styles from './WelcomeOverlay.module.css'

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return <div className={styles.overlay} />
}
