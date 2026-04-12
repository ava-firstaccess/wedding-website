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
    partySize: 2,
  },
  PARTY1: {
    code: 'PARTY1',
    firstName: 'Zach',
    secondGuest: '',
    inviteType: 'party',
    partySize: 1,
  },
}

const EVENT_DETAILS = {
  venueName: 'Hotel Revival',
  spaceName: 'Topside',
  address: '101 W Monument St, Baltimore, MD 21201',
  dinnerTime: '7:00 PM',
  partyArrival: '9:00 PM',
  dressCode: 'New Year’s Eve formal',
  rsvpDeadline: 'July 31',
  hotelBlockUrl: 'Hotel block link coming soon',
}

function InvitePage({ guest, onBack }) {
  const [attendance, setAttendance] = useState('')
  const [bringingPlusOne, setBringingPlusOne] = useState('')
  const [plusOneName, setPlusOneName] = useState('')
  const [dietary, setDietary] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isFullInvite = guest.inviteType === 'full'
  const canBringPlusOne = guest.partySize === 1
  const greeting = guest.secondGuest
    ? `Hi ${guest.firstName} & ${guest.secondGuest}`
    : canBringPlusOne
      ? `Hi ${guest.firstName} & Guest`
      : `Hi ${guest.firstName}`

  const attendanceOptions = isFullInvite
    ? [
        { value: 'both', label: 'Both' },
        { value: 'party-only', label: 'Party Only' },
        { value: 'decline', label: 'Can’t Make It' },
      ]
    : [
        { value: 'party', label: 'Yes' },
        { value: 'decline', label: 'Can’t Make It' },
      ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!attendance) return
    if (canBringPlusOne && attendance !== 'decline' && bringingPlusOne === 'yes' && !plusOneName.trim()) return
    setSubmitted(true)
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <p className={styles.greeting}>{greeting}</p>
        <h1 className={styles.heading}>{isFullInvite ? 'Dinner + Party' : 'Party'}</h1>
      </div>

      <hr className={styles.rule} />

      <div className={styles.menu}>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Venue</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.spaceName}, {EVENT_DETAILS.venueName}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Address</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.address}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Arrival</span>
          <span className={styles.menuValue}>{isFullInvite ? `Dinner guests arrive at ${EVENT_DETAILS.dinnerTime}. Party guests arrive at ${EVENT_DETAILS.partyArrival}.` : `Please arrive at ${EVENT_DETAILS.partyArrival}.`}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Dress</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.dressCode}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Food</span>
          <span className={styles.menuValue}>{isFullInvite ? 'Dinner, cocktail apps, and midnight pizza.' : 'Cocktail apps, midnight pizza, and an open bar. Please eat dinner before arriving.'}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Parking</span>
          <span className={styles.menuValue}>Parking and valet available at Hotel Revival.</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Hotel</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.hotelBlockUrl}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>RSVP By</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.rsvpDeadline}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Notes</span>
          <span className={styles.menuValue}>Adults only. Indoor event.</span>
        </div>
      </div>

      <hr className={styles.rule} />

      {submitted ? (
        <div className={styles.thanksWrap}>
          <p className={styles.thanks}>Got it.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.pillGroup}>
            <span className={styles.pillGroupLabel}>RSVP</span>
            {attendanceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.pill} ${styles.pillBorderless} ${attendance === opt.value ? styles.pillActive : ''}`}
                onClick={() => {
                  setAttendance(opt.value)
                  if (opt.value === 'decline') {
                    setBringingPlusOne('')
                    setPlusOneName('')
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {canBringPlusOne && attendance && attendance !== 'decline' ? (
            <div className={`${styles.pillGroup} ${styles.fadeIn}`}>
              <span className={styles.pillGroupLabel}>Plus One</span>
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.pill} ${styles.pillBorderless} ${bringingPlusOne === opt.value ? styles.pillActive : ''}`}
                  onClick={() => {
                    setBringingPlusOne(opt.value)
                    if (opt.value === 'no') setPlusOneName('')
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}

          {canBringPlusOne && bringingPlusOne === 'yes' ? (
            <div className={`${styles.field} ${styles.fadeIn}`}>
              <label htmlFor="plusOneName">Guest Name</label>
              <input
                id="plusOneName"
                name="plusOneName"
                type="text"
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                placeholder="Guest name"
                required
              />
            </div>
          ) : null}

          {isFullInvite ? (
            <div className={styles.field}>
              <label htmlFor="dietary">Dietary</label>
              <input
                id="dietary"
                name="dietary"
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="Optional"
              />
            </div>
          ) : null}

          <div className={styles.field}>
            <label htmlFor="notes">Notes / Song Request</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.secondaryButton} onClick={onBack}>Back</button>
            <button type="submit" className={styles.button}>Submit</button>
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
      setCodeError('Code not found.')
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
              <h1 className={styles.heading}>Enter Code To Party</h1>
              <hr className={styles.rule} />

              <form className={styles.form} onSubmit={handleCodeSubmit}>
                <div className={styles.field}>
                  <label htmlFor="inviteCode">Code</label>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Code"
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
