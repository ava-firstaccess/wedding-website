'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import styles from './page.module.css'

export default function Bach() {
  const contentRef = useRef(null)
  const [rsvp, setRsvp] = useState('')
  const [knowBy, setKnowBy] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = e.target.name.value.trim()
    if (!name || !rsvp) return
    if (rsvp === 'maybe' && !knowBy) return
    setSubmitting(true)
    try {
      await fetch('/api/bach-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rsvp, knowBy }),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
          <h1 className={styles.heading}>You Are Cordially Invited</h1>
          <hr className={styles.rule} />

          <div className={styles.menu}>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Occasion</span>
              <span className={styles.menuValue}>Bachelorette / Bachelor — Riviera Maya, Mexico</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Dates</span>
              <span className={styles.menuValue}>3 to 4 nights — TBD based on headcount</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Cost</span>
              <div className={styles.menuValueStack}>
                <p>$750 per person</p>
                <p className={styles.sub}>Villa, your own bed, breakfast &amp; lunch — included</p>
                <p className={styles.sub}>Dinner available — pay groceries + 20% chef fee<br />(near Tulum, so groceries are cheap)</p>
                <p className={styles.sub}>Bar service — add-on, split among drinkers only</p>
                <p className={styles.sub}>Flights — ~$500–600 round trip from Philly, DC, or LA</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Your Bed</span>
              <span className={styles.menuValue}>Singles share a room, own bed.<br />Couples get their own room.</span>
            </div>
          </div>

          <hr className={styles.rule} />

          {submitted ? (
            <p className={styles.thanks}>We got you. See you there.</p>
          ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required placeholder="Your name" />
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Are you in?</legend>
              {['in', 'out', 'maybe'].map((val) => (
                <label key={val} className={styles.radio}>
                  <input
                    type="radio"
                    name="rsvp"
                    value={val}
                    required
                    checked={rsvp === val}
                    onChange={() => setRsvp(val)}
                  />
                  <span>
                    {val === 'in' ? 'I Am In' : val === 'out' ? 'I Am Out' : 'I Am a Maybe'}
                  </span>
                </label>
              ))}
            </fieldset>

            {rsvp === 'maybe' && (
              <div className={`${styles.field} ${styles.fadeIn}`}>
                <label htmlFor="knowBy">I will know by</label>
                <input
                  id="knowBy"
                  name="knowBy"
                  type="date"
                  required
                  value={knowBy}
                  onChange={(e) => setKnowBy(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className={styles.button} disabled={submitting}>
              {submitting ? '...' : 'Send It'}
            </button>
          </form>
          )}
        </div>
      </main>
    </>
  )
}
