import { LicenseError, LicenseManager, type LicenseState } from '@licenseman/electron'
import { type ActivationResult, type LicenseInfo, maskLicenseKey } from '@shared/license'
import { app, clipboard, powerMonitor, shell } from 'electron'
import { appEvents } from '../events'
import { PRODUCT_ID, PUBLIC_KEY, PURCHASE_URL, TEST_PRODUCT_ID } from './config'

// License activation and validation with licensemanager.dev.
// https://licensemanager.dev/docs/electron
//
// The SDK validates the stored key on launch and renews it in the background. The app is unlocked
// only in the `ACTIVE` state: src/main/window.ts shows the main window or the activation window
// depending on it, and src/main/updater.ts only downloads the versions the license includes.

// Development builds use the test product, so `TEST-` keys work and release builds refuse them
const productId = app.isPackaged ? PRODUCT_ID : TEST_PRODUCT_ID || PRODUCT_ID

let license: LicenseManager | null = null

/** Creates the license manager. Call it once, when the app is ready. */
export function setupLicense(): void {
  if (!productId || !PUBLIC_KEY.trim()) {
    console.warn(
      'Licensing is disabled: set PRODUCT_ID and PUBLIC_KEY in src/main/license/config.ts'
    )
    return
  }

  license = new LicenseManager({ productId, publicKey: PUBLIC_KEY })
  license.onStateChange(emitChange)

  // Timers are paused during sleep: validate again on wake up
  powerMonitor.on('resume', () => void license?.refresh())
  app.on('will-quit', () => license?.dispose())
}

function emitChange(): void {
  appEvents.emit('licenseChanged', getLicenseInfo())
}

export function isLicensingEnabled(): boolean {
  return license !== null
}

/** True when the app can be used: the license is active, or licensing is disabled. */
export function isLicenseActive(): boolean {
  return !license || license.getState() === 'ACTIVE'
}

/**
 * Resolves when the startup validation is done, or after `timeoutMs`. With a valid stored token
 * it resolves right away; without one, the SDK may retry the server for up to 30 seconds.
 */
export async function waitForLicense(timeoutMs: number): Promise<void> {
  if (!license) return
  await Promise.race([license.ready(), new Promise((resolve) => setTimeout(resolve, timeoutMs))])
}

export function getLicenseInfo(): LicenseInfo {
  if (!license) return { enabled: false }
  const key = license.getLicenseKey()
  return {
    enabled: true,
    state: license.getState(),
    maskedKey: key ? maskLicenseKey(key) : null,
    offline: license.getOfflineState(),
    latestAllowedVersion: license.getLatestAllowedVersion(),
    clockTampered: license.isClockTampered(),
    testProduct: productId !== PRODUCT_ID,
    purchaseUrl: PURCHASE_URL || null
  }
}

/** Activates a key typed by the user. On failure, nothing changes and the error is returned. */
export async function activateLicense(key: string): Promise<ActivationResult> {
  if (!license) return { ok: true, state: 'ACTIVE' }
  try {
    const state = await license.setLicenseKey(key)
    // The state may not change (e.g. replacing an active key), but the key did
    emitChange()
    return { ok: true, state }
  } catch (error) {
    if (error instanceof LicenseError) {
      return { ok: false, code: error.code, latestAllowedVersion: error.latestAllowedVersion }
    }
    console.error('License activation failed', error)
    return { ok: false, code: 'unknown' }
  }
}

/** Validates the stored key now, e.g. after the customer renewed or freed a machine. */
export async function refreshLicense(): Promise<LicenseState | null> {
  if (!license) return null
  const state = await license.refresh()
  // Even when the state is unchanged, the offline time left may be
  emitChange()
  return state
}

/** Copies the full key to the clipboard, so it never has to be sent to the renderer. */
export function copyLicenseKey(): void {
  const key = license?.getLicenseKey()
  if (key) clipboard.writeText(key)
}

/** Opens the customer portal, where customers see their licenses and deactivate machines. */
export function openLicensePortal(): void {
  if (license) void shell.openExternal(license.getPortalUrl())
}

export function openPurchasePage(): void {
  if (PURCHASE_URL) void shell.openExternal(PURCHASE_URL)
}

export type VersionCheck =
  | { allowed: true }
  | { allowed: false; latestAllowedVersion: string | null }
  /** No definitive answer: the server could not be reached, or refused the license itself */
  | { allowed: null; reason: string }

/**
 * Asks LicenseManager whether the license includes another version of the app, before downloading
 * it. The SDK only validates the running version, so this calls the public validate-key endpoint
 * with the candidate version. A successful answer records that version for this machine in the
 * dashboard. https://licensemanager.dev/docs/integrate/validating-keys
 */
export async function checkVersionAllowed(version: string): Promise<VersionCheck> {
  const key = license?.getLicenseKey()
  if (!license || !key) return { allowed: true }

  try {
    const response = await fetch(
      `https://api.licensemanager.dev/v1/products/${productId}/validate-key`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // `name` and `platform` are left out so the machine keeps its values
        body: JSON.stringify({ key, fingerprint: await license.getFingerprint(), version }),
        signal: AbortSignal.timeout(10_000)
      }
    )
    if (response.ok) return { allowed: true }

    const body = (await response.json().catch(() => null)) as {
      error?: { code?: string; latestAllowedVersion?: string | null }
    } | null
    const code = body?.error?.code ?? `HTTP ${response.status}`
    if (code === 'version_not_allowed') {
      return { allowed: false, latestAllowedVersion: body?.error?.latestAllowedVersion ?? null }
    }
    // The license itself was refused (checked before the version): let the SDK lock the app
    if (['not_found', 'license_expired', 'machine_limit_reached'].includes(code)) {
      void refreshLicense()
    }
    return { allowed: null, reason: code }
  } catch (error) {
    return { allowed: null, reason: error instanceof Error ? error.message : String(error) }
  }
}
