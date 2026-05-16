'use client'

import { useState } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import styles from './page.module.css'

const VILLA_IMAGES = [
  'https://www.mayaluxe.com/wp-content/uploads/2026/03/entrada-del-mar-hero-2.jpg',
  'https://www.mayaluxe.com/wp-content/uploads/2026/03/Maya_Luxe_Luxury_Villas_Experiences_Soliman_Bay_Tulum_Amaite_1HERO-2.jpg',
  'https://www.mayaluxe.com/wp-content/uploads/2026/03/Maya_Luxe_Luxury_Villas_Experiences_Soliman_Bay_Tulum_Amaite_10-2.jpg',
  'https://www.mayaluxe.com/wp-content/uploads/2026/03/Maya_Luxe_Luxury_Villas_Experiences_Soliman_Bay_Tulum_Amaite_41.jpg',
]

export default function Bach() {
  const [name, setName] = useState('')
  const [flightInfo, setFlightInfo] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !flightInfo.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/bach-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flight',
          name: name.trim(),
          flightInfo: flightInfo.trim(),
        }),
      })

      if (!res.ok) throw new Error('Submit failed')
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.photoCollage}>
          {VILLA_IMAGES.map((src, index) => (
            <div key={src} className={`${styles.photoTile} ${styles[`photoTile${index + 1}`]}`}>
              <Image src={src} alt="Villa Entrada del Mar" fill sizes="(max-width: 900px) 100vw, 33vw" className={styles.photoImage} priority={index === 0} unoptimized />
            </div>
          ))}
          <div className={styles.photoOverlay} />
        </div>

        <div className={styles.content}>
          <h1 className={styles.heading}>Riviera Maya Details</h1>
          <hr className={styles.rule} />

          <div className={styles.menu}>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Villa</span>
              <div className={styles.menuValueStack}>
                <p>Villa Entrada del Mar</p>
                <p className={styles.sub}>Big ocean views, beachfront energy, and a stacked setup for the group.</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Dates</span>
              <span className={styles.menuValue}>Thursday, Nov 12 to Sunday, Nov 15</span>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Airport</span>
              <div className={styles.menuValueStack}>
                <p>Cancún International Airport</p>
                <p className={styles.sub}>Airport code: CUN</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Lodging</span>
              <div className={styles.menuValueStack}>
                <p>$550 per person</p>
                <p className={styles.sub}>Includes villa, chef, and bartender.</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Additional</span>
              <div className={styles.menuValueStack}>
                <p>Groceries</p>
                <p>Alcohol, if participating</p>
              </div>
            </div>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Transport</span>
              <span className={styles.menuValue}>We’ll coordinate group airport transport once flights are in.</span>
            </div>
          </div>

          <hr className={styles.rule} />

          <div className={styles.menu}>
            <div className={styles.menuRow}>
              <span className={styles.menuLabel}>Flight Info</span>
              <div className={styles.menuValueStack}>
                <p>Once you have your flight and flight number, submit it here.</p>
                <p className={styles.sub}>We’ll use it to coordinate arrivals and group transport.</p>
              </div>
            </div>
          </div>

          <hr className={styles.rule} />

          {submitted ? (
            <p className={styles.thanks}>Got it. Flight info saved.</p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
              </div>

              <div className={styles.field}>
                <label htmlFor="flightInfo">Flight Info</label>
                <textarea
                  id="flightInfo"
                  name="flightInfo"
                  rows={4}
                  value={flightInfo}
                  onChange={(e) => setFlightInfo(e.target.value)}
                  required
                  placeholder="Example: Southwest 1234, BWI to CUN, arrives Thursday 2:15 PM"
                />
              </div>

              <button type="submit" className={styles.button} disabled={submitting}>
                {submitting ? '...' : 'Submit Flight Info'}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
