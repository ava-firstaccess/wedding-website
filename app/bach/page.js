'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import styles from './page.module.css'

export default function Bach() {
  const contentRef = useRef(null)
  const [rsvp, setRsvp] = useState('')
  const [solo, setSolo] = useState('')
  const [knowBy, setKnowBy] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) contentRef.current.classList.add(styles.visible)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div ref={contentRef} className={styles.content}>
          <h1 className={styles.heading}>YOU ARE CORDIALLY INVITED</h1>
          <hr className={styles.rule} />

          <div className={styles.menu}>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>THE OCCASION</span>
              <span className={styles.menuValue}>Bachelorette / Bachelor — Riviera Maya, Mexico</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>THE DATES</span>
              <span className={styles.menuValue}>3 to 4 nights, TBD based on headcount</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>THE COST</span>
              <div className={styles.menuValue}>
                <p>$750 per person — villa, bed, breakfast &amp; lunch included</p>
                <p className={styles.sub}>Chef service: groceries + 20% — dinner available</p>
                <p className={styles.sub}>Bar service: add-on, split among drinkers only</p>
                <p className={styles.sub}>Flights: ~$500–600 round trip from Philly, DC, or LA</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>YOUR BED</span>
              <span className={styles.menuValue}>Singles share a room, own bed. Couples get their own room.</span>
            </div>
          </div>

          <hr className={styles.rule} />

          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required />
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Are you in?</legend>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="rsvp"
                  value="in"
                  checked={rsvp === 'in'}
                  onChange={() => setRsvp('in')}
                />
                <span>I AM IN</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="rsvp"
                  value="out"
                  checked={rsvp === 'out'}
                  onChange={() => setRsvp('out')}
                />
                <span>I AM OUT</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="rsvp"
                  value="maybe"
                  checked={rsvp === 'maybe'}
                  onChange={() => setRsvp('maybe')}
                />
                <span>I AM A MAYBE</span>
              </label>
            </fieldset>

            {rsvp === 'in' && (
              <fieldset className={`${styles.fieldset} ${styles.fadeIn}`}>
                <legend>Solo or with a partner?</legend>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="solo"
                    value="solo"
                    checked={solo === 'solo'}
                    onChange={() => setSolo('solo')}
                  />
                  <span>SOLO</span>
                </label>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="solo"
                    value="partner"
                    checked={solo === 'partner'}
                    onChange={() => setSolo('partner')}
                  />
                  <span>WITH A PARTNER</span>
                </label>
              </fieldset>
            )}

            {rsvp === 'maybe' && (
              <div className={`${styles.field} ${styles.fadeIn}`}>
                <label htmlFor="knowBy">I will know by</label>
                <input
                  id="knowBy"
                  name="knowBy"
                  type="date"
                  value={knowBy}
                  onChange={(e) => setKnowBy(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className={styles.button}>SEND IT</button>
          </form>
        </div>
      </main>
    </>
  )
}
