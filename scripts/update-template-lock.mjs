// Regenerates template/package-lock.json.
//
// The template is installed with pnpm in this monorepo, but users install it with npm, so it ships
// an npm lockfile. npm cannot generate it from pnpm's node_modules: it runs in a temporary folder.

import { execSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const template = join(import.meta.dirname, '..', 'template')
const temp = mkdtempSync(join(tmpdir(), 'template-lock-'))

try {
  copyFileSync(join(template, 'package.json'), join(temp, 'package.json'))
  execSync('npm install --package-lock-only --ignore-scripts --no-audit --no-fund', {
    cwd: temp,
    stdio: 'inherit'
  })
  copyFileSync(join(temp, 'package-lock.json'), join(template, 'package-lock.json'))
} finally {
  rmSync(temp, { recursive: true, force: true })
}
