import './globals.css'

export const metadata = {
  title: 'Zach & Ciera',
  description: 'Our Wedding',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
