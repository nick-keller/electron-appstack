import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://electron-appstack.com'),
  title: {
    default: 'Electron AppStack',
    template: '%s – Electron AppStack'
  },
  description:
    'A complete Electron + TypeScript starter: React, tRPC, SQLite, auto update and signed releases.'
}
