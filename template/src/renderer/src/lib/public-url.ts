/**
 * URL of a file in `src/renderer/public/`, e.g. `publicUrl('images/logo.svg')`.
 *
 * Do not write `/images/logo.svg`: in production the page is loaded from `file://`, where a
 * leading slash points to the root of the disk.
 */
export function publicUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
