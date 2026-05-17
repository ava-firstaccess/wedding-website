'use client'

import { useState } from 'react'
import Nav from './components/Nav'
import styles from './page.module.css'
import gateStyles from './rsvp/page.module.css'

const ACCESS_CODE_KEY = 'wedding-access-code'

export default function Home() {
  const [code, setCode] = useState('')
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
        return
      }

      window.localStorage.setItem(ACCESS_CODE_KEY, normalized)
      window.location.href = '/rsvp'
    } catch {
      setError('Code not found.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Zach & Ciera</h1>
          <p className={styles.subtitle}>New Years Eve Reception</p>
          <p className={styles.location}>Baltimore, MD</p>

          <form className={gateStyles.form} onSubmit={handleSubmit}>
            <div className={`${gateStyles.field} ${gateStyles.codeField}`}>
              <input
                id="homeCode"
                name="homeCode"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  if (error) setError('')
                }}
                placeholder="Code"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
                required
              />
            </div>
            {error ? <p className={gateStyles.error}>{error}</p> : null}
            <button type="submit" className={gateStyles.button} disabled={loading}>
              {loading ? '...' : 'Enter'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
