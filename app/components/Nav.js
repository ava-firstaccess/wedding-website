'use client'

import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/bach">The Trip</Link>
    </nav>
  )
}
