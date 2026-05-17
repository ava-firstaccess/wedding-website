'use client'

import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import styles from '../rsvp/page.module.css'

const ACCESS_CODE_KEY = 'wedding-access-code'

function DetailsContent({ guest }) {
  const isFullInvite = guest?.inviteType === 'full'

  return (
    <main className={styles.main}>
      <div className={`${styles.content} ${styles.visible}`}>
        <div className={`${styles.transitionPane} ${styles.transitionIn} ${styles.absolutePane}`}>
          <div className={styles.pageHeader}>
            <h1 className={styles.heading}>{isFullInvite ? 'Dinner + Party Details' : 'Party Details'}</h1>
          </div>
          <hr className={styles.rule} />
          <div className={styles.menu}>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Venue</span><span className={styles.menuValue}>Topside, Hotel Revival</span></div>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Address</span><span className={styles.menuValue}>101 W Monument St, Baltimore, MD 21201</span></div>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Arrival</span><span className={styles.menuValue}>{isFullInvite ? 'Dinner 7:00 PM, party 9:00 PM' : 'Party 9:00 PM'}</span></div>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Dress</span><span className={styles.menuValue}>New Year’s Eve formal</span></div>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Food</span><span className={styles.menuValue}>{isFullInvite ? 'Dinner, cocktail apps, and midnight pizza' : 'Cocktail apps, midnight pizza, open bar. Please eat dinner before arriving.'}</span></div>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Parking</span><span className={styles.menuValue}>Parking and valet available at Hotel Revival</span></div>
            <div className={styles.menuRow}><span className={styles.menuLabel}>Hotel</span><span className={styles.menuValue}>Hotel block link coming soon</span></div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Logistics() {
  const [view, setView] = useState('gate')
  const [code, setCode] = useState('')
  const [guest, setGuest] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedCode = window.localStorage.getItem(ACCESS_CODE_KEY)
    if (!savedCode) return

    setCode(savedCode)

    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/rsvp?code=${encodeURIComponent(savedCode)}`)
        if (!res.ok) throw new Error('Code not found')
        const data = await res.json()
        setGuest(data.guest)
        setError('')
        setView('invite')
      } catch {
        window.localStorage.removeItem(ACCESS_CODE_KEY)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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
      window.localStorage.setItem(ACCESS_CODE_KEY, normalized)
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
      {view !== 'invite' ? (
        <main className={styles.main}>
          <div className={`${styles.content} ${styles.visible}`}>
            <div className={`${styles.transitionPane} ${styles.gatePane} ${styles.transitionIn}`}>
              <h1 className={styles.heading}>Details</h1>
              <hr className={styles.rule} />
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={`${styles.field} ${styles.codeField}`}>
                  <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Code" required />
                </div>
                {error ? <p className={styles.error}>{error}</p> : null}
                <button type="submit" className={styles.button} disabled={loading}>{loading ? '...' : 'Enter'}</button>
              </form>
            </div>
          </div>
        </main>
      ) : (
        <DetailsContent guest={guest} />
      )}
    </>
  )
}
