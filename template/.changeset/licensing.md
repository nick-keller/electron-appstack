---
"electron-app": minor
---

Add licensing with licensemanager.dev. Once a product id and public key are set in `src/main/license/config.ts`, the app asks for a license key on first launch, explains every license problem (expired, too many computers, version not included, offline for too long) in an activation window, and only downloads the updates the license includes. A new About window shows the license key, its status and the offline time left. Licensing stays disabled until it is configured.
