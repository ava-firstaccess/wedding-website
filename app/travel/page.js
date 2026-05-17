'use client'

import Nav from '../components/Nav'
import styles from './page.module.css'

export default function Travel() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.content}>
          <p className={styles.date}>December 31, 2026</p>
          <h1 className={styles.kicker}>A New Year&apos;s Eve Reception</h1>

          <div className={styles.spacer} />

          <h2 className={styles.statement}>
            Ciera &amp; Zach request your company as we celebrate our marriage with family and friends.
          </h2>
        </div>
      </main>
    </>
  )
}
