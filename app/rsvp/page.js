'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import styles from './page.module.css'

const MOCK_GUESTS = {
  DINNER1: {
    code: 'DINNER1',
    firstName: 'Ava',
    secondGuest: 'Zach',
    inviteType: 'full',
    plusOneAllowed: false,
  },
  PARTY1: {
    code: 'PARTY1',
    firstName: 'Zach',
    secondGuest: '',
    inviteType: 'party',
    plusOneAllowed: false,
  },
}

function InvitePage({ guest, onBack }) {
  const [attendance, setAttendance] = useState('')
  const [dietary, setDietary] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isFullInvite = guest.inviteType === 'full'
  const greeting = guest.secondGuest
    ? `Hi ${guest.firstName} & ${guest.secondGuest}`
    : `Hi ${guest.firstName}`

  const attendanceOptions = isFullInvite
    ? [
        { value: 'both', label: 'We’ll Be There For Both' },
        { value: 'party-only', label: 'We’ll Join For New Year’s Eve Only' },
        { value: 'decline', label: 'Sadly, We Can’t Make It' },
      ]
    : [
        { value: 'party', label: 'I’ll Be There' },
        { value: 'decline', label: 'Sadly, I Can’t Make It' },
      ]

  const details = isFullInvite
    ? [
        ['The Invitation', 'Before dinner celebration + New Year’s Eve party'],
        ['Your Evening', 'An intimate dinner, then a beautiful long night into midnight'],
        ['Your RSVP', 'Tell us if you’re joining both or just the party'],
      ]
    : [
        ['The Invitation', 'New Year’s Eve party'],
        ['Your Evening', 'Drinks, music, and midnight with us'],
        ['Your RSVP', 'Let us know if we get to celebrate together'],
      ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!attendance) return
    setSubmitted(true)
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <p className={styles.greeting}>{greeting}</p>
        <h1 className={styles.heading}>You’re Invited.</h1>
        <p className={styles.subheading}>
          {isFullInvite ? 'Before Dinner + New Year’s Eve Party' : 'New Year’s Eve Party'}
        </p>
      </div>

      <hr className={styles.rule} />

      <div className={styles.menu}>
        {details.map(([label, value]) => (
          <div className={styles.menuRow} key={label}>
            <span className={styles.menuLabel}>{label}</span>
            <span className={styles.menuValue}>{value}</span>
          </div>
        ))}
      </div>

      <hr className={styles.rule} />

      {submitted ? (
        <div className={styles.thanksWrap}>
          <p className={styles.thanks}>Perfect. We’ve got you.</p>
          <p className={styles.sub}>This RSVP flow is mocked for now, real response saving comes next.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.pillGroup}>
            <span className={styles.pillGroupLabel}>Will you join us?</span>
            {attendanceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.pill} ${styles.pillBorderless} ${attendance === opt.value ? styles.pillActive : ''}`}
                onClick={() => setAttendance(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className={styles.field}>
            <label htmlFor="dietary">Dietary Restrictions</label>
            <input
              id="dietary"
              name="dietary"
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              placeholder="Anything we should know?"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="A note, song request, or anything else"
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.secondaryButton} onClick={onBack}>Back</button>
            <button type="submit" className={styles.button}>Send It</button>
          </div>
        </form>
      )}
    </>
  )
}

export default function RSVP() {
  const [phase, setPhase] = useState('overlay')
  const [codeInput, setCodeInput] = useState('')
  const [guest, setGuest] = useState(null)
  const [codeError, setCodeError] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    const revealTimer = setTimeout(() => setPhase('lions-in'), 100)
    const fadeOutTimer = setTimeout(() => setPhase('lions-out'), 3100)
    const formTimer = setTimeout(() => setPhase('form-in'), 4600)
    return () => {
      clearTimeout(revealTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(formTimer)
    }
  }, [])

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    const normalized = codeInput.trim().toUpperCase()
    if (!normalized) return

    const match = MOCK_GUESTS[normalized]
    if (!match) {
      setCodeError('That code didn’t match our guest list. Try again.')
      setGuest(null)
      return
    }

    setCodeError('')
    setGuest(match)
  }

  const resetGate = () => {
    setGuest(null)
    setCodeInput('')
    setCodeError('')
  }

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

        <div ref={formRef} className={`${styles.content} ${phase === 'form-in' ? styles.visible : ''}`}>
          {!guest ? (
            <>
              <h1 className={styles.heading}>RSVP</h1>
              <hr className={styles.rule} />

              <div className={styles.menu}>
                <div className={styles.menuRow}>
                  <span className={styles.menuLabel}>The Evening</span>
                  <span className={styles.menuValue}>Enter your invitation code to begin.</span>
                </div>
                <div className={styles.menuRow}>
                  <span className={styles.menuLabel}>The Flow</span>
                  <span className={styles.menuValue}>Your code opens the correct RSVP page for your invitation.</span>
                </div>
              </div>

              <hr className={styles.rule} />

              <form className={styles.form} onSubmit={handleCodeSubmit}>
                <div className={styles.field}>
                  <label htmlFor="inviteCode">Invitation Code</label>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter your code"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck="false"
                    required
                  />
                </div>

                {codeError ? <p className={styles.error}>{codeError}</p> : null}

                <button type="submit" className={styles.button}>Enter</button>
              </form>
            </>
          ) : (
            <InvitePage guest={guest} onBack={resetGate} />
          )}
        </div>
      </main>
    </>
  )
}
