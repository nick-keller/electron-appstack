/**
 * Toggles the `dark` class on <html> to match `prefers-color-scheme`.
 *
 * The theme chosen in the menu or the settings sets `nativeTheme.themeSource` in the main
 * process, which Chromium exposes as `prefers-color-scheme`: the renderer only has to follow it.
 */
export function syncColorScheme(): void {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const apply = () => document.documentElement.classList.toggle('dark', query.matches)
  apply()
  query.addEventListener('change', apply)
}
