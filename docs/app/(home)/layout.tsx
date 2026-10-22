import type { ReactNode } from 'react'
import '../globals.css'

export { metadata } from '../metadata'

// The landing page and the docs have separate root layouts, so navigating between them does a
// full page load and the docs theme script is rendered on the server
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body style={{ margin: 0, background: '#09090b' }}>{children}</body>
    </html>
  )
}
