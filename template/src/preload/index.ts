import { exposeElectronTRPC } from 'trpc-electron/main'

// The renderer talks to the main process only through tRPC (see src/main/trpc).
// Avoid exposing anything else here: add a tRPC procedure instead.
exposeElectronTRPC()
