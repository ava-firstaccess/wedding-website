'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import styles from './page.module.css'

export default function Bach() {
  const [phase, setPhase] = useState('overlay')  // overlay → lions-out → form-in
  const [rsvp, setRsvp] = useState('')
  const [knowBy, setKnowBy] = useState('')
  const [weekends, setWeekends] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Black overlay fades out (1.5s), revealing lions behind it
    const revealTimer = setTimeout(() => setPhase('lions-in'), 100)
    // Hold lions, then fade them out
    const fadeOutTimer = setTimeout(() => setPhase('lions-out'), 3100)
    // After lions fade out, show form
    const formTimer = setTimeout(() => setPhase('form-in'), 4600)
    return () => {
      clearTimeout(revealTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(formTimer)
    }
  }, [])

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
        body: JSON.stringify({ name, rsvp, knowBy, weekends: weekends.join(', ') }),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Black overlay that fades away to reveal lions */}
      {(phase === 'overlay' || phase === 'lions-in') && (
        <div className={phase === 'overlay' ? styles.overlay : styles.overlayFading} />
      )}
      <Nav />
      <main className={styles.main}>
        {/* Lion reveal */}
        <div className={`${styles.lionsWrap} ${
          (phase === 'overlay' || phase === 'lions-in') ? styles.lionsVisible :
          phase === 'lions-out' ? styles.lionsFading : styles.lionsGone
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

        {/* Form reveal */}
        <div className={`${styles.content} ${phase === 'form-in' ? styles.visible : ''}`}>
          <h1 className={styles.heading}>You're Invited.</h1>
          <hr className={styles.rule} />

          <div className={styles.menu}>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Occasion</span>
              <span className={styles.menuValue}>Bachelorette / Bachelor — Riviera Maya, Mexico</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Dates</span>
              <div className={styles.menuValueStack}>
                <p>Thursday – Sunday</p>
                <p className={styles.sub}>3 weekend options below — we're gathering availability to find what works best for the group</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Cost</span>
              <div className={styles.menuValueStack}>
                <p>Lodging: Approx $450–$750 per person</p>
                <p className={styles.sub}>The leading contender based on anticipated headcount is at $550.</p>
                <p className={styles.subsectionLabel}>Included:</p>
                <p className={styles.sub}>Chef for breakfast &amp; lunch, bartender (can be prorated for non-drinkers), housekeeping, airport shuttle (if arriving at similar times)</p>
                <p className={styles.subsectionLabel}>Additional costs:</p>
                <p className={styles.sub}>Groceries, alcohol, optional activities — boat day, golf, night out</p>
                <p className={styles.sub}>Flights — $400–500 round trip</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Your Room</span>
              <span className={styles.menuValue}>Singles will have their own bed in a shared 2-person room. Couples will have their own room.</span>
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

            <div className={styles.pillGroup}>
              <span className={styles.pillGroupLabel}>Which weekends work for you?<br /><span className={styles.sub}>(select all that apply)</span></span>
              {[
                { value: 'Weekend 1', label: 'Weekend 1 — Thu Oct 8 – Mon Oct 12' },
                { value: 'Weekend 2', label: 'Weekend 2 — Thu Oct 15 – Sun Oct 18' },
                { value: 'Weekend 3', label: 'Weekend 3 — Thu Nov 12 – Sun Nov 15' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.pill} ${weekends.includes(opt.value) ? styles.pillActive : ''}`}
                  onClick={() => {
                    if (weekends.includes(opt.value)) {
                      setWeekends(weekends.filter((w) => w !== opt.value))
                    } else {
                      setWeekends([...weekends, opt.value])
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Are you in?</legend>
              {[
                { value: 'in', label: 'I Am In' },
                { value: 'maybe', label: 'Depends on Final Cost' },
                { value: 'out', label: 'I Am Out — see you on NYE' },
              ].map((opt) => (
                <label key={opt.value} className={styles.radio}>
                  <input
                    type="radio"
                    name="rsvp"
                    value={opt.value}
                    required
                    checked={rsvp === opt.value}
                    onChange={() => setRsvp(opt.value)}
                  />
                  <span>{opt.label}</span>
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
