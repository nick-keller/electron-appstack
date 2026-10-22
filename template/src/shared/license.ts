import type { LicenseErrorCode, LicenseState, OfflineState } from '@licenseman/electron'

// License types shared by the main process (src/main/license) and the renderer (activation and
// About windows). Only types are imported from the SDK: it runs in the main process only.

export type { LicenseErrorCode, LicenseState, OfflineState }

/** What the renderer knows about the license. The full key never leaves the main process. */
export type LicenseInfo =
  | {
      /** Licensing is off: the product id or public key is not set in src/main/license/config.ts */
      enabled: false
    }
  | {
      enabled: true
      state: LicenseState
      /** The stored key with its end hidden, e.g. `7KQ2M-X9•••-•••••-•••••-•••••`, or null */
      maskedKey: string | null
      offline: OfflineState
      /** In `VERSION_NOT_ALLOWED`: latest version the license allows, null if none */
      latestAllowedVersion: string | null | undefined
      clockTampered: boolean
      /** True in development builds, which use the test product */
      testProduct: boolean
      /** Where to buy or renew a license, null if not set */
      purchaseUrl: string | null
    }

/** Result of an activation. Errors are returned, not thrown: IPC would only keep their message. */
export type ActivationResult =
  | { ok: true; state: LicenseState }
  | {
      ok: false
      /** `unknown` for an error that is not a `LicenseError` (e.g. a custom fingerprint failing) */
      code: LicenseErrorCode | 'unknown'
      latestAllowedVersion?: string | null
    }

/** The states in which the app is unlocked. */
export function isUnlocked(info: LicenseInfo): boolean {
  return !info.enabled || info.state === 'ACTIVE'
}

/**
 * Hides the end of a license key, keeping the separators: `7KQ2M-X9ZPA-H4TRC-WN6EY-B3JDF`
 * becomes `7KQ2M-X9•••-•••••-•••••-•••••`. Enough to recognize a key, not to use it.
 */
export function maskLicenseKey(key: string): string {
  const visible = Math.min(8, Math.ceil(key.length / 3))
  return key.slice(0, visible) + key.slice(visible).replace(/[^-\s]/g, '•')
}

/**
 * Compares two `major.minor.patch` versions: negative if `a` is older, positive if newer.
 * Pre-release suffixes and a leading `v` are ignored.
 */
export function compareVersions(a: string, b: string): number {
  const parse = (version: string) =>
    version
      .replace(/^v/, '')
      .split(/[-+]/)[0]
      .split('.')
      .map((part) => Number.parseInt(part, 10) || 0)
  const [left, right] = [parse(a), parse(b)]
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}
