'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import styles from '../rsvp/page.module.css'

export default function Logistics() {
  const [phase, setPhase] = useState('overlay')
  const [view, setView] = useState('gate')
  const [code, setCode] = useState('')
  const [guest, setGuest] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const revealTimer = setTimeout(() => setPhase('lions-in'), 100)
    const fadeOutTimer = setTimeout(() => setPhase('lions-out'), 2635)
    const formTimer = setTimeout(() => setPhase('form-in'), 3910)
    return () => {
      clearTimeout(revealTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(formTimer)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalized = code.trim().toUpperCase()
    if (!normalized) return
    setLoading(true)
    try {
      const res = await fetch(`/api/rsvp?code=${encodeURIComponent(normalized)}`)
      if (!res.ok) {
        setError('Code not found.')
        setGuest(null)
        return
      }
      const data = await res.json()
      setGuest(data.guest)
      setError('')
      setView('fading')
      setTimeout(() => setView('invite'), 380)
    } catch {
      setError('Code not found.')
      setGuest(null)
    } finally {
      setLoading(false)
    }
  }

  const isFullInvite = guest?.inviteType === 'full'

  return (
    <>
      {(phase === 'overlay' || phase === 'lions-in') && (
        <div className={phase === 'overlay' ? styles.overlay : styles.overlayFading} />
      )}
      <Nav />
      <main className={styles.main}>
        <div className={`${styles.lionsWrap} ${
          phase === 'overlay' || phase === 'lions-in'
            ? styles.lionsVisible
            : phase === 'lions-out'
              ? styles.lionsFading
              : styles.lionsGone
        }`}>
          <Image
            src="/lion-lioness.png"
            alt="Lion and Lioness"
            width={500}
            height={500}
            priority
            className={styles.lionsImage}
          />
        </div>
        <div className={`${styles.content} ${phase === 'form-in' ? styles.visible : ''}`}>
          {view !== 'invite' ? (
            <div className={`${styles.transitionPane} ${view === 'fading' ? styles.transitionOut : styles.transitionIn}`}>
              <h1 className={styles.heading}>Logistics</h1>
              <hr className={styles.rule} />
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="code">Code</label>
                  <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Code" required />
                </div>
                {error ? <p className={styles.error}>{error}</p> : null}
                <button type="submit" className={styles.button} disabled={loading}>{loading ? '...' : 'Enter'}</button>
              </form>
            </div>
          ) : (
            <div className={`${styles.transitionPane} ${styles.transitionIn} ${styles.absolutePane}`}>
              <h1 className={styles.heading}>{isFullInvite ? 'Dinner + Party Logistics' : 'Party Logistics'}</h1>
              <hr className={styles.rule} />
              <div className={styles.menu}>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Venue</span><span className={styles.menuValue}>Topside, Hotel Revival</span></div>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Address</span><span className={styles.menuValue}>101 W Monument St, Baltimore, MD 21201</span></div>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Arrival</span><span className={styles.menuValue}>{isFullInvite ? 'Dinner 7:00 PM, party 9:00 PM' : 'Party 9:00 PM'}</span></div>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Dress</span><span className={styles.menuValue}>New Year’s Eve formal</span></div>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Food</span><span className={styles.menuValue}>{isFullInvite ? 'Dinner, cocktail apps, and midnight pizza' : 'Cocktail apps, midnight pizza, open bar. Please eat dinner before arriving.'}</span></div>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Parking</span><span className={styles.menuValue}>Parking and valet available at Hotel Revival</span></div>
                <div className={styles.menuRow}><span className={styles.menuLabel}>Hotel</span><span className={styles.menuValue}>Hotel block link coming soon</span></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
