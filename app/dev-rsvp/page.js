'use client'

import { useEffect, useMemo, useState } from 'react'
import RsvpExperience from '../rsvp/RsvpExperience'

const DEV_PASSWORD_KEY = 'dev-rsvp-password'
const DEV_PASSWORD = 'bunches!'

const MOCK_GUESTS = {
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
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f0e7', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, padding: '2rem' }}>
          <h1 style={{ margin: 0, textAlign: 'center' }}>Dev RSVP Pages</h1>
          <p style={{ textAlign: 'center', opacity: 0.7 }}>Protected for quick testing</p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="Password"
              autoFocus
              style={{ padding: '0.95rem 1rem', borderRadius: 14, border: '1px solid rgba(0,0,0,0.15)', font: 'inherit' }}
            />
            {error ? <p style={{ color: '#b42318', margin: 0 }}>{error}</p> : null}
            <button type="submit" style={{ padding: '0.95rem 1rem', borderRadius: 999, border: '1px solid #1f1a17', background: '#1f1a17', color: 'white', font: 'inherit', cursor: 'pointer' }}>Enter</button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function DevRsvpPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [activeTab, setActiveTab] = useState('full-pair')
  const [liveGuest, setLiveGuest] = useState(null)
  const [liveCode, setLiveCode] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(DEV_PASSWORD_KEY) === DEV_PASSWORD) {
      setUnlocked(true)
    }
  }, [])

  const tabs = useMemo(() => ([
    { key: 'full-pair', label: 'Dinner + Party, Couple' },
    { key: 'full-solo-party-guest', label: 'Dinner + Party, Solo + Party Guest' },
    { key: 'full-solo-dinner-guest', label: 'Dinner + Party, Solo + Dinner Guest' },
    { key: 'party-solo', label: 'Party Only, Solo' },
    { key: 'party-pair', label: 'Party Only, Couple' },
    { key: 'party-solo-plus-guest', label: 'Party Only, Solo + Guest' },
  ]), [])

  if (!unlocked) return <DevGate onUnlock={() => setUnlocked(true)} />

  return (
    <RsvpExperience
      showNav={false}
      showLionIntro={false}
      gateTitle="Enter Code To Party"
      codePlaceholder="Code"
      initialView="invite"
      initialGuest={liveGuest || MOCK_GUESTS[activeTab] || MOCK_GUESTS['full-pair']}
      initialCode={liveCode || 'DEVMOCK'}
      onLookup={async (code) => {
        const res = await fetch(`/api/rsvp?code=${encodeURIComponent(code)}`)
        if (!res.ok) throw new Error('Code not found')
        const data = await res.json()
        setLiveGuest(data.guest)
        setLiveCode(code)
        return data
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab)
        setLiveGuest(null)
        setLiveCode('')
      }}
      helperContent={(
        <div style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
          <p style={{ margin: 0, opacity: 0.72, textAlign: 'center' }}>This mirrors the live RSVP design 1:1. Tabs swap RSVP variants. Enter a real code anytime to preview a real guest record.</p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(DEV_PASSWORD_KEY)
              setUnlocked(false)
            }}
            style={{ padding: '0.8rem 1rem', borderRadius: 999, border: '1px solid #1f1a17', background: 'transparent', color: '#1f1a17', font: 'inherit', cursor: 'pointer' }}
          >
            Lock
          </button>
        </div>
      )}
    />
  )
}
