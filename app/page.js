'use client'

import { useState } from 'react'
import Nav from './components/Nav'
import styles from './page.module.css'

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

      window.location.href = `/rsvp?code=${encodeURIComponent(normalized)}`
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase())
                if (error) setError('')
              }}
              placeholder="Enter Password"
              className={styles.input}
              required
            />
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? '...' : 'Enter'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
