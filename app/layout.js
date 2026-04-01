import './globals.css'
import { Lora, Newsreader } from 'next/font/google'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata = {
  title: 'Zach & Ciera Bosson',
  description: 'New Years Eve Reception — Baltimore, MD',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lora.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  )
}
