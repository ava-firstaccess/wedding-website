'use client'

import { useEffect, useRef, useState } from 'react'

const ACCESS_CODE_KEY = 'wedding-access-code'
import Image from 'next/image'
import Nav from '../components/Nav'
import styles from './page.module.css'

const EVENT_DETAILS = {
  venueName: 'Topside at Hotel Revival',
  address: '101 W Monument St, Baltimore, MD 21201',
  welcomeCocktails: 'Welcome Cocktails at 7:00PM',
  dinnerTime: 'Dinner 7:30pm',
  partyTime: 'NYE Celebration at 9:00PM',
  dressCode: 'New Year’s Eve formal',
  rsvpDeadline: 'July 31',
  hotelBlockUrl: 'Hotel block link coming soon',
}

export function InvitePage({ guest, code, onBack, onSubmitSuccess }) {
  const existing = guest.existingRsvp || null
  const [editing, setEditing] = useState(!existing)
  const [attendance, setAttendance] = useState(existing?.response || '')
  const [attendanceMode, setAttendanceMode] = useState(existing?.attendanceMode || '')
  const [singleAttendeeName, setSingleAttendeeName] = useState(existing?.singleAttendeeName || '')
  const [partyGuestComing, setPartyGuestComing] = useState(existing?.partyGuestName ? 'yes' : '')
  const [partyGuestName, setPartyGuestName] = useState(existing?.partyGuestName || '')
  const [dinnerGuestComing, setDinnerGuestComing] = useState(existing?.dinnerGuestName ? 'yes' : '')
  const [dinnerGuestName, setDinnerGuestName] = useState(existing?.dinnerGuestName || '')
  const [dietary, setDietary] = useState(existing?.dietary || '')
  const [notes, setNotes] = useState(existing?.notes || '')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const nextExisting = guest.existingRsvp || null
    setEditing(!nextExisting)
    setAttendance(nextExisting?.response || '')
    setAttendanceMode(nextExisting?.attendanceMode || '')
    setSingleAttendeeName(nextExisting?.singleAttendeeName || '')
    setPartyGuestComing(nextExisting?.partyGuestName ? 'yes' : '')
    setPartyGuestName(nextExisting?.partyGuestName || '')
    setDinnerGuestComing(nextExisting?.dinnerGuestName ? 'yes' : '')
    setDinnerGuestName(nextExisting?.dinnerGuestName || '')
    setDietary(nextExisting?.dietary || '')
    setNotes(nextExisting?.notes || '')
    setSubmitted(false)
  }, [guest])

  const isFullInvite = guest.inviteType === 'full'
  const partySize = Number(guest.partySize || 1)
  const dinnerQuantity = Number(guest.dinnerQuantity || 0)
  const partyQuantity = Number(guest.partyQuantity || 1)
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
  const canBringPartyOnlyGuest = !isFullInvite && partySize === 1 && partyQuantity === 2

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!attendance) return
    if (needsPartyPairChoice && attendance !== 'decline' && !attendanceMode) return
    if (attendanceMode === 'one' && !singleAttendeeName) return
    if ((canBringPartyGuestAfterDinner || canBringPartyOnlyGuest) && attendance !== 'decline' && partyGuestComing === 'yes' && !partyGuestName.trim()) return
    if (canBringGuestToDinnerAndParty && attendance !== 'decline' && dinnerGuestComing === 'yes' && !dinnerGuestName.trim()) return

    const guestCount =
      attendance === 'decline'
        ? 0
        : attendanceMode === 'both'
          ? 2
          : attendanceMode === 'one'
            ? 1
            : ((canBringPartyGuestAfterDinner || canBringPartyOnlyGuest) && partyGuestComing === 'yes') || (canBringGuestToDinnerAndParty && dinnerGuestComing === 'yes')
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
      if (onSubmitSuccess) await onSubmitSuccess()
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
          <span className={styles.menuValue}>{EVENT_DETAILS.venueName}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Address</span>
          <span className={styles.menuValueBlock}>
            <span>{EVENT_DETAILS.address}</span>
            <span>{EVENT_DETAILS.welcomeCocktails}</span>
            <span>{EVENT_DETAILS.dinnerTime}</span>
          </span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Dinner</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.dinnerTime}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Party</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.partyTime}</span>
        </div>
        <div className={styles.menuRow}>
          <span className={styles.menuLabel}>Dress</span>
          <span className={styles.menuValue}>{EVENT_DETAILS.dressCode}</span>
        </div>
      </div>

      <div className={styles.sectionSpacer} />
      <hr className={styles.rule} />

      {submitted ? null : existing && !editing ? (
        <div className={styles.form}>
          <div className={styles.summaryCard}>
            <p className={styles.pillGroupLabel}>We already have your RSVP</p>
            <div className={styles.summaryList}>
              <p><strong>Response:</strong> {existing.response === 'both' ? 'Yes' : existing.response === 'party-only' ? 'Party Only' : existing.response === 'party' ? 'Yes' : existing.response === 'decline' ? 'Can’t Make It' : (existing.response || '—')}</p>
              {existing.attendanceMode ? <p><strong>Who’s coming:</strong> {existing.attendanceMode === 'both' ? 'We both can make it' : existing.attendanceMode === 'one' ? 'Only one of us can make it' : existing.attendanceMode}</p> : null}
              {existing.singleAttendeeName ? <p><strong>Single attendee:</strong> {existing.singleAttendeeName}</p> : null}
              {existing.partyGuestName ? <p><strong>Party guest:</strong> {existing.partyGuestName}</p> : null}
              {existing.dinnerGuestName ? <p><strong>Dinner guest:</strong> {existing.dinnerGuestName}</p> : null}
              {existing.dietary ? <p><strong>Dietary:</strong> {existing.dietary}</p> : null}
              {existing.notes ? <p><strong>Notes:</strong> {existing.notes}</p> : null}
              {existing.submittedAt ? <p><strong>Submitted:</strong> {existing.submittedAt}</p> : null}
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.secondaryButton} onClick={onBack}>Back</button>
            <button type="button" className={styles.button} onClick={() => setEditing(true)}>Change My RSVP</button>
          </div>
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
                {guest2 ? <option value={guest2}>Just {guest2}</option> : null}
              </select>
            </div>
          ) : null}

          {(canBringPartyGuestAfterDinner || canBringPartyOnlyGuest) && attendance && attendance !== 'decline' ? (
            <div className={`${styles.pillGroup} ${styles.fadeIn}`}>
              <span className={styles.pillGroupLabel}>{canBringPartyGuestAfterDinner ? 'You’re invited to bring a guest to the party at 9 PM' : 'You’re invited to bring a guest to the party'}</span>
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.pill} ${styles.pillBorderless} ${partyGuestComing === opt.value ? styles.pillActive : ''}`}
                  onClick={() => {
                    setPartyGuestComing(opt.value)
                    if (opt.value === 'no') setPartyGuestName('')
                  }}
                >
                  {opt.label}
                </button>
              ))}
              {partyGuestComing === 'yes' ? (
                <div className={styles.field}>
                  <label htmlFor="partyGuestName">Guest Name</label>
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
            </div>
          ) : null}

          {canBringGuestToDinnerAndParty && attendance && attendance !== 'decline' ? (
            <div className={`${styles.pillGroup} ${styles.fadeIn}`}>
              <span className={styles.pillGroupLabel}>You’re invited to bring a guest to dinner and the party</span>
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.pill} ${styles.pillBorderless} ${dinnerGuestComing === opt.value ? styles.pillActive : ''}`}
                  onClick={() => {
                    setDinnerGuestComing(opt.value)
                    if (opt.value === 'no') setDinnerGuestName('')
                  }}
                >
                  {opt.label}
                </button>
              ))}
              {dinnerGuestComing === 'yes' ? (
                <div className={styles.field}>
                  <label htmlFor="dinnerGuestName">Guest Name</label>
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
            <button type="button" className={styles.secondaryButton} onClick={existing ? () => setEditing(false) : onBack}>{existing ? 'Cancel' : 'Back'}</button>
            <button type="submit" className={styles.button} disabled={submitting}>{submitting ? '...' : existing ? 'Update RSVP' : 'Submit'}</button>
          </div>
        </form>
      )}
    </>
  )
}

export default function RsvpExperience({
  showNav = true,
  showLionIntro = true,
  gateTitle = 'Enter Code To Party',
  codePlaceholder = 'Code',
  initialView = 'gate',
  initialGuest = null,
  initialCode = '',
  onLookup,
  tabs,
  activeTab,
  onTabChange,
  helperContent,
}) {
  const [phase, setPhase] = useState(showLionIntro ? 'overlay' : 'form-in')
  const [view, setView] = useState(initialGuest ? 'invite' : initialView)
  const [codeInput, setCodeInput] = useState(initialCode)
  const [guest, setGuest] = useState(initialGuest)
  const [activeCode, setActiveCode] = useState(initialCode)
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (!showLionIntro) return
    const revealTimer = setTimeout(() => setPhase('lions-in'), 100)
    const fadeOutTimer = setTimeout(() => setPhase('lions-out'), 3100)
    const formTimer = setTimeout(() => setPhase('form-in'), 4600)
    return () => {
      clearTimeout(revealTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(formTimer)
    }
  }, [showLionIntro])

  useEffect(() => {
    setGuest(initialGuest)
    setActiveCode(initialCode)
    setCodeInput(initialCode)
    setView(initialGuest ? 'invite' : initialView)
    setCodeError('')
  }, [initialGuest, initialCode, initialView])

  useEffect(() => {
    if (initialGuest || initialCode || initialView === 'invite') return
    if (typeof window === 'undefined') return

    const savedCode = window.localStorage.getItem(ACCESS_CODE_KEY)
    if (!savedCode) return

    setCodeInput(savedCode)

    ;(async () => {
      setLoading(true)
      try {
        const data = onLookup
          ? await onLookup(savedCode)
          : await (async () => {
              const res = await fetch(`/api/rsvp?code=${encodeURIComponent(savedCode)}`)
              if (!res.ok) throw new Error('Code not found')
              return await res.json()
            })()

        setGuest(data.guest)
        setActiveCode(savedCode)
        setCodeError('')
        setView('invite')
      } catch {
        window.localStorage.removeItem(ACCESS_CODE_KEY)
      } finally {
        setLoading(false)
      }
    })()
  }, [initialGuest, initialCode, initialView, onLookup])

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    const normalized = codeInput.trim().toUpperCase()
    if (!normalized) return

    setLoading(true)
    try {
      const data = onLookup
        ? await onLookup(normalized)
        : await (async () => {
            const res = await fetch(`/api/rsvp?code=${encodeURIComponent(normalized)}`)
            if (!res.ok) throw new Error('Code not found')
            return await res.json()
          })()

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACCESS_CODE_KEY, normalized)
      }

      setGuest(data.guest)
      setActiveCode(normalized)
      setCodeError('')
      setView('fading')
      setTimeout(() => setView('invite'), 380)
    } catch {
      setCodeError('Code not found.')
      setGuest(null)
      setActiveCode('')
    } finally {
      setLoading(false)
    }
  }

  const resetGate = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ACCESS_CODE_KEY)
    }
    setView('gate')
    setGuest(null)
    setActiveCode('')
    setCodeInput('')
    setCodeError('')
  }

  return (
    <>
      {showLionIntro && (phase === 'overlay' || phase === 'lions-in') && (
        <div className={phase === 'overlay' ? styles.overlay : styles.overlayFading} />
      )}
      {showNav ? <Nav /> : null}
      <main className={styles.main}>
        {showLionIntro ? (
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
        ) : null}

        <div ref={formRef} className={`${styles.content} ${phase === 'form-in' ? styles.visible : ''}`}>
          {tabs?.length ? (
            <div className={styles.pillGroup} style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`${styles.pill} ${styles.pillBorderless} ${activeTab === tab.key ? styles.pillActive : ''}`}
                  onClick={() => onTabChange?.(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}

          {helperContent ? <div style={{ marginBottom: '1.5rem' }}>{helperContent}</div> : null}

          {view !== 'invite' ? (
            <div className={`${styles.transitionPane} ${styles.gatePane} ${view === 'fading' ? styles.transitionOut : styles.transitionIn} ${view === 'invite' ? styles.hiddenPane : ''}`}>
              <h1 className={styles.heading}>{gateTitle}</h1>
              <hr className={styles.rule} />

              <form className={styles.form} onSubmit={handleCodeSubmit}>
                <div className={`${styles.field} ${styles.codeField}`}>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder={codePlaceholder}
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck="false"
                    required
                  />
                </div>

                {codeError ? <p className={styles.error}>{codeError}</p> : null}

                <button type="submit" className={styles.button} disabled={loading}>{loading ? '...' : 'Enter'}</button>
              </form>
            </div>
          ) : guest ? (
            <div className={`${styles.transitionPane} ${styles.transitionIn} ${styles.absolutePane}`}>
              <InvitePage guest={guest} code={activeCode} onBack={resetGate} onSubmitSuccess={async () => {
                if (!activeCode) return
                const data = onLookup
                  ? await onLookup(activeCode)
                  : await (async () => {
                      const res = await fetch(`/api/rsvp?code=${encodeURIComponent(activeCode)}`)
                      if (!res.ok) throw new Error('Code not found')
                      return await res.json()
                    })()
                setGuest(data.guest)
              }} />
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
