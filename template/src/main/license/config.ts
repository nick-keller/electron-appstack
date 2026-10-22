// License settings, from your LicenseManager organization (https://app.licensemanager.dev).
// See the Licensing page of the documentation for how to get them.
//
// Licensing is disabled while the product id or the public key is empty: the app opens directly
// and updates are not gated. Fill them in to require a license.
//
// Hard-code these values. Never read them from a file or an environment variable at runtime: a
// customer could replace them with their own product and key.

/** Id of your live product, from the Security page (e.g. `x7Kp2QaZ`). Used by packaged builds. */
export const PRODUCT_ID = ''

/**
 * Id of your test product (e.g. `t3Hw9LmB`), used in development so you can activate with
 * `TEST-` keys. Leave empty to use the live product in development too.
 */
export const TEST_PRODUCT_ID = ''

/** Public key of your organization, from the Security page (the whole PEM block). */
export const PUBLIC_KEY = ``

/** Page where customers buy or renew a license. Leave empty to hide the "Buy" and "Renew" links. */
export const PURCHASE_URL = ''
