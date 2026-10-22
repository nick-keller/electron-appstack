export type UpdateStatus =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'not-available' }
  | { state: 'available'; version: string }
  | { state: 'downloading'; percent: number }
  | { state: 'downloaded'; version: string }
  | { state: 'error'; message: string }
  /** Licensing is enabled and the license is not active: updates are not checked */
  | { state: 'license-required' }
  /** A newer version exists, but the license does not include it (nor any newer than this one) */
  | { state: 'not-allowed'; version: string; latestAllowedVersion: string | null }
