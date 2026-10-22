# build/

Packaging assets used by electron-builder. Nothing in this folder is shipped inside the app.

| File | Size | Used for |
| --- | --- | --- |
| `icon.png` | 1024×1024 | App icon on every platform. electron-builder generates `.icns` (macOS) and `.ico` (Windows) from it |
| `icon.icns` | – | Optional. macOS icon, takes precedence over `icon.png` |
| `icon.ico` | 256×256 (multi-size) | Optional. Windows icon, takes precedence over `icon.png` |
| `icons/<size>x<size>.png` | 16 to 512 | Optional. Linux icons, e.g. `icons/256x256.png` |
| `background.png` | 540×380 | macOS DMG window background |
| `background@2x.png` | 1080×760 | macOS DMG background for Retina displays |
| `installerIcon.ico`, `uninstallerIcon.ico` | 256×256 | Optional. Windows installer icons |
| `entitlements.mac.plist` | – | macOS hardened runtime entitlements |

macOS icons follow the Apple grid: draw the artwork in an 824×824 rounded square centered in the
1024×1024 canvas, with a transparent margin, or the icon looks too big in the Dock.

The DMG layout (icon positions, window size) is set in `electron-builder.ts` under `dmg`.

Files needed at runtime by the main process (tray icons, window icon on Linux, sounds…) go in
`resources/` instead. Images displayed by the renderer go in `src/renderer/public/images/`.
