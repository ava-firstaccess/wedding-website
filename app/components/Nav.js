'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

export default function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/rsvp', label: 'RSVP' },
    { href: '/logistics', label: 'Logistics' },
  ]

  return (
    <nav className={styles.nav}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? styles.active : ''}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
