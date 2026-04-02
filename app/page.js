'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Nav from './components/Nav'
import WelcomeOverlay from './components/WelcomeOverlay'
import styles from './page.module.css'

export default function Home() {
  const heroRef = useRef(null)

  useEffect(() => {
    // Fade in after welcome overlay starts fading (2s delay)
    const timer = setTimeout(() => {
      if (heroRef.current) heroRef.current.classList.add(styles.visible)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <WelcomeOverlay />
      <Nav />
      <main className={styles.main}>
        <div ref={heroRef} className={styles.hero}>
          <div className={styles.imageWrap}>
            <Image
              src="/lion-lioness.png"
              alt="Lion and Lioness"
              width={500}
              height={500}
              priority
              className={styles.image}
            />
          </div>
          <h1 className={styles.title}>Zach & Ciera</h1>
          <p className={styles.subtitle}>New Years Eve Reception</p>
          <p className={styles.location}>Baltimore, MD</p>
          <p className={styles.details}>Details to follow with RSVP</p>
        </div>
      </main>
    </>
  )
}
