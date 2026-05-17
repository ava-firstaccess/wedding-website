'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import Nav from './components/Nav'
import WelcomeOverlay from './components/WelcomeOverlay'
import styles from './page.module.css'

export default function Home() {
  const heroRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (heroRef.current) heroRef.current.classList.add(styles.visible)
    }, 800)
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
        </div>
      </main>
    </>
  )
}
