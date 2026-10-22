'use client'

import { type MouseEvent, type ReactNode, useRef } from 'react'
import styles from './landing.module.css'

// Distance in px over which neighbouring icons are magnified, and the scale of the hovered icon
const range = 140
const maxScale = 1.6

export function Dock({
  items,
  label
}: {
  items: { name: string; icon: ReactNode }[]
  label: string
}) {
  const listRef = useRef<HTMLUListElement>(null)

  // Scale each icon from its distance to the cursor, like the macOS dock
  function magnify(event: MouseEvent<HTMLUListElement>) {
    for (const item of listRef.current?.children ?? []) {
      const rect = item.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / range)
      ;(item as HTMLElement).style.setProperty(
        '--scale',
        String(1 + (maxScale - 1) * proximity ** 2)
      )
    }
  }

  function reset() {
    for (const item of listRef.current?.children ?? []) {
      ;(item as HTMLElement).style.removeProperty('--scale')
    }
  }

  return (
    <ul
      ref={listRef}
      className={`${styles.tile} ${styles.heroLogos}`}
      aria-label={label}
      onMouseMove={magnify}
      onMouseLeave={reset}
    >
      {items.map(({ name, icon }) => (
        <li key={name}>
          <span className={styles.dockIcon}>{icon}</span>
          <span className={styles.dockTooltip} role="tooltip">
            {name}
          </span>
        </li>
      ))}
    </ul>
  )
}
