'use client'

import { useState } from 'react'
import Nav from '../components/Nav'
import styles from './page.module.css'
import baseStyles from '../rsvp/page.module.css'

function WeddingStory() {
  return (
    <section className={styles.storySection}>
      <div className={styles.storyContent}>
        <h1 className={styles.storyTitle}>Our Wedding</h1>
        <p className={styles.storyTagline}>A Summer Day in Mt. Washington, Baltimore</p>
        <p className={styles.storyCopy}>
          We’ll ring in the new year overlooking the same square where we said “I Do”. On August 1, 2025, we were
          intimately joined by our parents to exchange our vows. An afternoon that took our breath away and an
          evening of laughter, that we now want to celebrate with you.
        </p>

        <div className={styles.photoPlaceholder} aria-label="Wedding photo placeholder" />

        <h2 className={styles.storyInvitation}>We hope you’ll join our celebration.</h2>

        <a href="/rsvp" className={styles.rsvpButton}>RSVP</a>
      </div>
    </section>
  )
}

function TravelContent({ guest }) {
  const isFullInvite = guest?.inviteType === 'full'

  return (
    <>
      <section className={styles.detailsSection}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailsColumn}>
            <p className={styles.eyebrow}>When</p>

            <div className={styles.detailBlock}>
              <h2 className={styles.detailHeading}>Thursday,<br />December 31, 2026</h2>
              <div className={styles.detailSpacer} />
              {isFullInvite ? (
                <>
                  <p className={styles.detailCopy}>Dinner: 7:00pm—9:00pm</p>
                  <p className={styles.detailCopy}>Party: 9:00pm—1:30am</p>
                </>
              ) : (
                <p className={styles.detailCopy}>Party: 9:00pm—1:30am</p>
              )}
            </div>
          </div>

          <div className={styles.detailsColumn}>
            <p className={styles.eyebrow}>Where</p>

            <div className={styles.detailBlock}>
              <h2 className={styles.detailHeading}>Topside &amp; Garden Room<br />at Hotel Revival</h2>
              <div className={styles.detailSpacer} />
              <p className={styles.detailCopy}>101 W Monument St,</p>
              <p className={styles.detailCopy}>Baltimore, MD 21201</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.accommodationsSection}>
        <div className={styles.accommodationsContent}>
          <p className={styles.accommodationsEyebrow}>Accommodations</p>
          <h2 className={styles.accommodationsTitle}>Hotel Revival</h2>
          <p className={styles.accommodationsBody}>We&apos;ve reserved a block of rooms for Thursday, December 31st at Hotel Revival in Mt. Washington, Baltimore.</p>
          <p className={styles.accommodationsBody}>If you&apos;re planning to extend your stay beyond Thursday evening, call Hotel Revival and mention the Bosson New Years Eve Reception when you reserve.</p>
          <p className={styles.accommodationsMeta}>101 W Monument St,<br />Baltimore, MD 21201</p>
          <p className={styles.accommodationsMeta}>(410) 727-7101</p>
          <p className={styles.accommodationsLinkWrap}><a href="https://hotelrevivalbaltimore.com/" className={styles.accommodationsLink}>Book Online +</a></p>
        </div>
      </section>

      <WeddingStory />
    </>
  )
}

export default function Travel() {
  const [view, setView] = useState('gate')
  const [code, setCode] = useState('')
  const [guest, setGuest] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setView('invite')
    } catch {
      setError('Code not found.')
      setGuest(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main className={styles.main}>
        {view !== 'invite' ? (
          <>
            <WeddingStory />
            <section className={styles.travelGateSection}>
              <div className={styles.travelGateContent}>
                <div className={`${baseStyles.transitionPane} ${baseStyles.transitionIn}`}>
                  <h1 className={baseStyles.heading}>Travel</h1>
                  <hr className={baseStyles.rule} />
                  <form className={baseStyles.form} onSubmit={handleSubmit}>
                    <div className={`${baseStyles.field} ${baseStyles.codeField}`}>
                      <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Code" required />
                    </div>
                    {error ? <p className={baseStyles.error}>{error}</p> : null}
                    <button type="submit" className={baseStyles.button} disabled={loading}>{loading ? '...' : 'Enter'}</button>
                  </form>
                </div>
              </div>
            </section>
          </>
        ) : (
          <TravelContent guest={guest} />
        )}
      </main>
    </>
  )
}
