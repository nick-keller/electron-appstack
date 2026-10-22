'use client'

import { useState } from 'react'

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
