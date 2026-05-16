'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './page.module.css'
import rsvpStyles from '../rsvp/page.module.css'

const DEV_PASSWORD_KEY = 'dev-rsvp-password'
const DEV_PASSWORD = 'bunches!'

const EVENT_DETAILS = {
  venueName: 'Topside at Hotel Revival',
  address: '101 W Monument St, Baltimore, MD 21201',
  welcomeCocktails: 'Welcome Cocktails at 7:00PM',
  dinnerTime: 'Dinner 7:30pm',
  partyTime: 'NYE Celebration at 9:00PM',
  dressCode: 'New Year’s Eve formal',
}

function DevGate({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== DEV_PASSWORD) {
      setError('Wrong password')
      return
    }
    localStorage.setItem(DEV_PASSWORD_KEY, DEV_PASSWORD)
    onUnlock()
  }

  return (
    <div className={styles.shell}>
      <div className={styles.gateCard}>
        <h1 className={styles.title}>Dev RSVP Pages</h1>
        <p className={styles.subtitle}>Protected for quick testing</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            placeholder="Password"
            className={styles.input}
            autoFocus
          />
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="submit" className={styles.button}>Enter</button>
        </form>
      </div>
    </div>
  )
}

function InvitePreview({ guest, code, refreshGuest }) {
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
  const [submitting, setSubmitting] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState('')

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
    setSubmittedMessage('')
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
      setSubmittedMessage('Saved')
      await refreshGuest(code)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className={rsvpStyles.pageHeader}>
        <p className={rsvpStyles.greeting}>{greeting}</p>
        <h1 className={rsvpStyles.heading}>{isFullInvite ? 'Dinner + Party' : 'Party'}</h1>
      </div>

      <hr className={rsvpStyles.rule} />

      <div className={rsvpStyles.menu}>
        <div className={rsvpStyles.menuRow}>
          <span className={rsvpStyles.menuLabel}>Venue</span>
          <span className={rsvpStyles.menuValue}>{EVENT_DETAILS.venueName}</span>
        </div>
        <div className={rsvpStyles.menuRow}>
          <span className={rsvpStyles.menuLabel}>Address</span>
          <span className={rsvpStyles.menuValueBlock}>
            <span>{EVENT_DETAILS.address}</span>
            <span>{EVENT_DETAILS.welcomeCocktails}</span>
            <span>{EVENT_DETAILS.dinnerTime}</span>
          </span>
        </div>
        <div className={rsvpStyles.menuRow}>
          <span className={rsvpStyles.menuLabel}>Dinner</span>
          <span className={rsvpStyles.menuValue}>{EVENT_DETAILS.dinnerTime}</span>
        </div>
        <div className={rsvpStyles.menuRow}>
          <span className={rsvpStyles.menuLabel}>Party</span>
          <span className={rsvpStyles.menuValue}>{EVENT_DETAILS.partyTime}</span>
        </div>
        <div className={rsvpStyles.menuRow}>
          <span className={rsvpStyles.menuLabel}>Dress</span>
          <span className={rsvpStyles.menuValue}>{EVENT_DETAILS.dressCode}</span>
        </div>
      </div>

      <div className={rsvpStyles.sectionSpacer} />
      <hr className={rsvpStyles.rule} />

      {submittedMessage ? <p className={styles.savedFlag}>{submittedMessage}</p> : null}

      {existing && !editing ? (
        <div className={rsvpStyles.form}>
          <div className={rsvpStyles.summaryCard}>
            <p className={rsvpStyles.pillGroupLabel}>We already have your RSVP</p>
            <div className={rsvpStyles.summaryList}>
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
          <div className={rsvpStyles.buttonRow}>
            <button type="button" className={rsvpStyles.button} onClick={() => setEditing(true)}>Change My RSVP</button>
          </div>
        </div>
      ) : (
        <form className={rsvpStyles.form} onSubmit={handleSubmit}>
          <div className={rsvpStyles.pillGroup}>
            <span className={rsvpStyles.pillGroupLabel}>RSVP</span>
            {attendanceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${rsvpStyles.pill} ${rsvpStyles.pillBorderless} ${attendance === opt.value ? rsvpStyles.pillActive : ''}`}
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
            <div className={`${rsvpStyles.pillGroup} ${rsvpStyles.fadeIn}`}>
              <span className={rsvpStyles.pillGroupLabel}>Who’s Coming?</span>
              {[
                { value: 'both', label: 'We Both Can Make It' },
                { value: 'one', label: 'Only One Of Us Can Make It' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${rsvpStyles.pill} ${rsvpStyles.pillBorderless} ${attendanceMode === opt.value ? rsvpStyles.pillActive : ''}`}
                  onClick={() => setAttendanceMode(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}

          {needsPartyPairChoice && attendanceMode === 'one' ? (
            <div className={`${rsvpStyles.field} ${rsvpStyles.fadeIn}`}>
              <label htmlFor="singleAttendeeName">Who’s Coming?</label>
              <select
                id="singleAttendeeName"
                name="singleAttendeeName"
                value={singleAttendeeName}
                onChange={(e) => setSingleAttendeeName(e.target.value)}
                className={rsvpStyles.select}
                required
              >
                <option value="">Select one</option>
                <option value={guest1}>Just {guest1}</option>
                <option value={guest2}>Just {guest2}</option>
              </select>
            </div>
          ) : null}

          {(canBringPartyGuestAfterDinner || canBringPartyOnlyGuest) && attendance && attendance !== 'decline' ? (
            <div className={`${rsvpStyles.pillGroup} ${rsvpStyles.fadeIn}`}>
              <span className={rsvpStyles.pillGroupLabel}>{canBringPartyGuestAfterDinner ? 'You’re invited to bring a guest to the party at 9 PM' : 'You’re invited to bring a guest to the party'}</span>
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${rsvpStyles.pill} ${rsvpStyles.pillBorderless} ${partyGuestComing === opt.value ? rsvpStyles.pillActive : ''}`}
                  onClick={() => {
                    setPartyGuestComing(opt.value)
                    if (opt.value === 'no') setPartyGuestName('')
                  }}
                >
                  {opt.label}
                </button>
              ))}
              {partyGuestComing === 'yes' ? (
                <div className={rsvpStyles.field}>
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
            <div className={`${rsvpStyles.pillGroup} ${rsvpStyles.fadeIn}`}>
              <span className={rsvpStyles.pillGroupLabel}>You’re invited to bring a guest to dinner and the party</span>
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${rsvpStyles.pill} ${rsvpStyles.pillBorderless} ${dinnerGuestComing === opt.value ? rsvpStyles.pillActive : ''}`}
                  onClick={() => {
                    setDinnerGuestComing(opt.value)
                    if (opt.value === 'no') setDinnerGuestName('')
                  }}
                >
                  {opt.label}
                </button>
              ))}
              {dinnerGuestComing === 'yes' ? (
                <div className={rsvpStyles.field}>
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
            <div className={rsvpStyles.field}>
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

          <div className={rsvpStyles.field}>
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

          <div className={rsvpStyles.buttonRow}>
            {existing ? <button type="button" className={rsvpStyles.secondaryButton} onClick={() => setEditing(false)}>Cancel</button> : null}
            <button type="submit" className={rsvpStyles.button} disabled={submitting}>{submitting ? '...' : existing ? 'Update RSVP' : 'Submit'}</button>
          </div>
        </form>
      )}
    </>
  )
}

export default function DevRsvpPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [activeTab, setActiveTab] = useState('rsvp')
  const [codeInput, setCodeInput] = useState('')
  const [activeCode, setActiveCode] = useState('')
  const [guest, setGuest] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(DEV_PASSWORD_KEY) === DEV_PASSWORD) {
      setUnlocked(true)
    }
  }, [])

  const refreshGuest = async (codeOverride) => {
    const codeToUse = (codeOverride || activeCode || '').trim().toUpperCase()
    if (!codeToUse) return

    const res = await fetch(`/api/rsvp?code=${encodeURIComponent(codeToUse)}`)
    if (!res.ok) throw new Error('Code not found')
    const data = await res.json()
    setGuest(data.guest)
    setActiveCode(codeToUse)
    setCodeInput(codeToUse)
  }

  const handleLookup = async (e) => {
    e.preventDefault()
    const normalized = codeInput.trim().toUpperCase()
    if (!normalized) return
    setLoading(true)
    try {
      await refreshGuest(normalized)
      setError('')
    } catch {
      setGuest(null)
      setActiveCode('')
      setError('Code not found.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = useMemo(() => ([
    { key: 'full-pair', label: 'Dinner + Party, Couple' },
    { key: 'full-solo-party-guest', label: 'Dinner + Party, Solo + Party Guest' },
    { key: 'full-solo-dinner-guest', label: 'Dinner + Party, Solo + Dinner Guest' },
    { key: 'party-solo', label: 'Party Only, Solo' },
    { key: 'party-pair', label: 'Party Only, Couple' },
    { key: 'party-solo-plus-guest', label: 'Party Only, Solo + Guest' },
  ]), [])

  if (!unlocked) {
    return <DevGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Dev RSVP Pages</h1>
          <p className={styles.subtitle}>Tabbed preview, no public nav link, no lion intro</p>
        </div>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem(DEV_PASSWORD_KEY)
            setUnlocked(false)
          }}
        >
          Lock
        </button>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.lookupCard}>
        <form className={styles.lookupForm} onSubmit={handleLookup}>
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="Optional real invite code"
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>{loading ? '...' : 'Load Real Code'}</button>
        </form>
        <p className={styles.codeLabel}>Or just click tabs below to preview each unique RSVP experience.</p>
        {activeCode ? <p className={styles.codeLabel}>Loaded code: {activeCode}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
      </div>

      <div className={styles.previewCard}>
        {guest ? <InvitePreview guest={guest} code={activeCode} refreshGuest={refreshGuest} /> : (() => {
          const mockGuestByTab = {
            'full-pair': {
              firstName: 'Zach',
              secondGuest: 'Ciera',
              inviteType: 'full',
              partySize: 2,
              dinnerQuantity: 2,
              partyQuantity: 2,
              existingRsvp: null,
            },
            'full-solo-party-guest': {
              firstName: 'Zach',
              secondGuest: '',
              inviteType: 'full',
              partySize: 1,
              dinnerQuantity: 1,
              partyQuantity: 2,
              existingRsvp: null,
            },
            'full-solo-dinner-guest': {
              firstName: 'Zach',
              secondGuest: '',
              inviteType: 'full',
              partySize: 1,
              dinnerQuantity: 2,
              partyQuantity: 2,
              existingRsvp: null,
            },
            'party-solo': {
              firstName: 'Zach',
              secondGuest: '',
              inviteType: 'party',
              partySize: 1,
              dinnerQuantity: 0,
              partyQuantity: 1,
              existingRsvp: null,
            },
            'party-pair': {
              firstName: 'Zach',
              secondGuest: 'Ciera',
              inviteType: 'party',
              partySize: 2,
              dinnerQuantity: 0,
              partyQuantity: 2,
              existingRsvp: null,
            },
            'party-solo-plus-guest': {
              firstName: 'Zach',
              secondGuest: '',
              inviteType: 'party',
              partySize: 1,
              dinnerQuantity: 0,
              partyQuantity: 2,
              existingRsvp: null,
            },
          }

          return <InvitePreview guest={mockGuestByTab[activeTab]} code="DEVMOCK" refreshGuest={async () => {}} />
        })()}
      </div>
    </main>
  )
}
