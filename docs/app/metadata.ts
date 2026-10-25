import type { Metadata } from 'next'

// One share image for every page. Pages that set their own `openGraph` or `twitter` replace the
// inherited object entirely, so they must spread these back in
export const openGraphImages = [
  { url: '/opengraph-image.png', width: 1200, height: 630, type: 'image/png' }
]

export const metadata: Metadata = {
  metadataBase: new URL('https://electron-appstack.com'),
  title: {
    default: 'Electron AppStack',
    template: '%s – Electron AppStack'
  },
  description:
    'A complete Electron + TypeScript starter: React, tRPC, SQLite, auto update and signed releases.',
  openGraph: { images: openGraphImages },
  twitter: { card: 'summary_large_image', images: openGraphImages }
}
