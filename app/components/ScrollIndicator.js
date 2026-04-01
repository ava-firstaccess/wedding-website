'use client'

import { useEffect, useState } from 'react'
import styles from './ScrollIndicator.module.css'

export default function ScrollIndicator() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 350)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`${styles.indicator} ${hidden ? styles.hidden : ''}`}>
      <img src="/scroll-indicator.png" alt="Scroll Down" className={styles.image} />
    </div>
  )
}
