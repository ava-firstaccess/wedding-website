'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import styles from './page.module.css'

export default function Bach() {
  const contentRef = useRef(null)
  const [rsvp, setRsvp] = useState('')
  const [knowBy, setKnowBy] = useState('')
  const [weekends, setWeekends] = useState([])
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
        body: JSON.stringify({ name, rsvp, knowBy, weekends: weekends.join(', ') }),
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
              <span className={styles.menuValue}>Thursday – Sunday, October 2026 — see below for available weekends</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>The Cost</span>
              <div className={styles.menuValueStack}>
                <p>Approx $750 per person</p>
                <p className={styles.sub}>Chef included for breakfast &amp; lunch — Cost: groceries + 20%</p>
                <p className={styles.sub}>Bartender — cost of alcohol + 20% split among drinkers only</p>
                <p className={styles.sub}>Flights — ~$500–600 round trip from Philly, DC, or LA</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Your Bed</span>
              <span className={styles.menuValue}>Singles share a room, own bed.</span>
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
              <legend>Which weekends work for you? <span className={styles.sub}>(select all that apply)</span></legend>
              {[
                { value: 'Weekend 1', label: 'Weekend 1 — Thu Oct 1 – Sun Oct 4' },
                { value: 'Weekend 2', label: 'Weekend 2 — Thu Oct 8 – Sun Oct 11' },
                { value: 'Weekend 3', label: 'Weekend 3 — Thu Oct 15 – Sun Oct 18' },
              ].map((opt) => (
                <label key={opt.value} className={styles.radio}>
                  <input
                    type="checkbox"
                    name="weekends"
                    value={opt.value}
                    checked={weekends.includes(opt.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWeekends([...weekends, opt.value])
                      } else {
                        setWeekends(weekends.filter((w) => w !== opt.value))
                      }
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </fieldset>

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
