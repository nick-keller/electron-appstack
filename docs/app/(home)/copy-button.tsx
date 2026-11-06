'use client'

import { useState } from 'react'

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Record<string, unknown>) => void
  }
}

// `event` is sent to Google Analytics on copy, to measure installs (mark it as a key event in GA4)
export function CopyButton({
  text,
  event,
  className
}: {
  text: string
  event?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    if (event) window.gtag?.('event', event)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
