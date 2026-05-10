'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import baseStyles from '../rsvp/page.module.css'
import styles from './page.module.css'

export default function SaveTheDate() {
  const [phase, setPhase] = useState('overlay')

  useEffect(() => {
    const revealTimer = setTimeout(() => setPhase('lions-in'), 100)
    const fadeOutTimer = setTimeout(() => setPhase('lions-out'), 3100)
    const contentTimer = setTimeout(() => setPhase('form-in'), 4600)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <>
      {(phase === 'overlay' || phase === 'lions-in') && (
        <div className={phase === 'overlay' ? baseStyles.overlay : baseStyles.overlayFading} />
      )}
      <Nav />
      <main className={baseStyles.main}>
        <div className={`${baseStyles.lionsWrap} ${
          phase === 'overlay' || phase === 'lions-in'
            ? baseStyles.lionsVisible
            : phase === 'lions-out'
              ? baseStyles.lionsFading
              : baseStyles.lionsGone
        }`}>
          <Image
            src="/lion-lioness.png"
            alt="Lion and Lioness"
            width={500}
            height={500}
            priority
            className={baseStyles.lionsImage}
          />
        </div>

        <div className={`${baseStyles.content} ${phase === 'form-in' ? baseStyles.visible : ''}`}>
          <div className={styles.contentWrap}>
            <p className={styles.kicker}>Save the Date</p>
            <h1 className={styles.date}>12.31.2026</h1>
            <p className={styles.title}>New Year&apos;s Eve Reception</p>
            <p className={styles.location}>Baltimore, MD</p>
            <p className={styles.note}>Details to follow with RSVP</p>
          </div>
        </div>
      </main>
    </>
  )
}
