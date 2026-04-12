'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import styles from './page.module.css'

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

function InvitePage({ guest, code, onBack }) {
  const [attendance, setAttendance] = useState('')
  const [attendanceMode, setAttendanceMode] = useState('')
  const [singleAttendeeName, setSingleAttendeeName] = useState('')
  const [partyGuestName, setPartyGuestName] = useState('')
  const [dinnerGuestName, setDinnerGuestName] = useState('')
  const [dietary, setDietary] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isFullInvite = guest.inviteType === 'full'
  const partySize = Number(guest.partySize || 1)
  const dinnerQuantity = Number(guest.dinnerQuantity || 0)
  const guest1 = guest.firstName
  const guest2 = guest.secondGuest
  const hasNamedSecondGuest = Boolean(guest2)

  const greeting = hasNamedSecondGuest
    ? `Hi ${guest1} & ${guest2}`
    : partySize === 1
      ? `Hi ${guest1} & Guest`
      : `Hi ${guest1}`

  const attendanceOptions = isFullInvite
    ? [
        { value: 'both', label: 'Yes' },
        { value: 'party-only', label: 'Party Only' },
        { value: 'decline', label: 'Can’t Make It' },
      ]
    : [
        { value: 'party', label: 'Yes' },
        { value: 'decline', label: 'Can’t Make It' },
      ]

  const needsPartyPairChoice = partySize === 2
  const canBringPartyGuestAfterDinner = isFullInvite && dinnerQuantity === 1 && partySize === 1
  const canBringGuestToDinnerAndParty = isFullInvite && dinnerQuantity === 2 && partySize === 1

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!attendance) return
    if (needsPartyPairChoice && attendance !== 'decline' && !attendanceMode) return
    if (attendanceMode === 'one' && !singleAttendeeName) return
    if (canBringPartyGuestAfterDinner && attendance !== 'decline' && !partyGuestName.trim()) return
    if (canBringGuestToDinnerAndParty && attendance !== 'decline' && !dinnerGuestName.trim()) return

    const guestCount =
      attendance === 'decline'
        ? 0
        : attendanceMode === 'both'
          ? 2
          : attendanceMode === 'one'
            ? 1
            : canBringPartyGuestAfterDinner || canBringGuestToDinnerAndParty
              ? 2
              : partySize

    setSubmitting(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          response: attendance,
          attendanceMode,
          singleAttendeeName,
          guestCount,
          partyGuestName: partyGuestName.trim(),
          dinnerGuestName: dinnerGuestName.trim(),
          dietary: isFullInvite ? dietary.trim() : '',
          notes: notes.trim(),
        }),
      })

      if (!res.ok) throw new Error('Submit failed')
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
                    setAttendanceMode('')
                    setSingleAttendeeName('')
                    setPartyGuestName('')
                    setDinnerGuestName('')
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {needsPartyPairChoice && attendance && attendance !== 'decline' ? (
            <div className={`${styles.pillGroup} ${styles.fadeIn}`}>
              <span className={styles.pillGroupLabel}>Who’s Coming?</span>
              {[
                { value: 'both', label: 'We Both Can Make It' },
                { value: 'one', label: 'Only One Of Us Can Make It' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.pill} ${styles.pillBorderless} ${attendanceMode === opt.value ? styles.pillActive : ''}`}
                  onClick={() => setAttendanceMode(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}

          {needsPartyPairChoice && attendanceMode === 'one' ? (
            <div className={`${styles.field} ${styles.fadeIn}`}>
              <label htmlFor="singleAttendeeName">Who’s Coming?</label>
              <select
                id="singleAttendeeName"
                name="singleAttendeeName"
                value={singleAttendeeName}
                onChange={(e) => setSingleAttendeeName(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select one</option>
                <option value={guest1}>Just {guest1}</option>
                <option value={guest2}>Just {guest2}</option>
              </select>
            </div>
          ) : null}

          {canBringPartyGuestAfterDinner && attendance && attendance !== 'decline' ? (
            <div className={`${styles.field} ${styles.fadeIn}`}>
              <label htmlFor="partyGuestName">Party Guest Name</label>
              <p className={styles.helper}>You’re also invited to bring a guest to meet you at the party after dinner at 9 PM.</p>
              <input
                id="partyGuestName"
                name="partyGuestName"
                type="text"
                value={partyGuestName}
                onChange={(e) => setPartyGuestName(e.target.value)}
                placeholder="Guest name"
                required
              />
            </div>
          ) : null}

          {canBringGuestToDinnerAndParty && attendance && attendance !== 'decline' ? (
            <div className={`${styles.field} ${styles.fadeIn}`}>
              <label htmlFor="dinnerGuestName">Guest Name</label>
              <p className={styles.helper}>Your guest is invited to join you for both dinner and the party.</p>
              <input
                id="dinnerGuestName"
                name="dinnerGuestName"
                type="text"
                value={dinnerGuestName}
                onChange={(e) => setDinnerGuestName(e.target.value)}
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
            <button type="submit" className={styles.button} disabled={submitting}>{submitting ? '...' : 'Submit'}</button>
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
  const [activeCode, setActiveCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading] = useState(false)
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

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    const normalized = codeInput.trim().toUpperCase()
    if (!normalized) return

    setLoading(true)
    try {
      const res = await fetch(`/api/rsvp?code=${encodeURIComponent(normalized)}`)
      if (!res.ok) {
        setCodeError('Code not found.')
        setGuest(null)
        setActiveCode('')
        return
      }
      const data = await res.json()
      setGuest(data.guest)
      setActiveCode(normalized)
      setCodeError('')
    } catch {
      setCodeError('Code not found.')
      setGuest(null)
      setActiveCode('')
    } finally {
      setLoading(false)
    }
  }

  const resetGate = () => {
    setGuest(null)
    setActiveCode('')
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

                <button type="submit" className={styles.button} disabled={loading}>{loading ? '...' : 'Enter'}</button>
              </form>
            </>
          ) : (
            <InvitePage guest={guest} code={activeCode} onBack={resetGate} />
          )}
        </div>
      </main>
    </>
  )
}
