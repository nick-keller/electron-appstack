---
"electron-app": minor
---

Protect the source code of production builds: the main process is compiled to V8 bytecode, and the packaged app is locked down with Electron fuses and ASAR integrity validation so it only runs its own signed code. This is automatic, with no change to the development workflow.
