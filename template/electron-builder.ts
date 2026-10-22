import type { Configuration } from 'electron-builder'

// Packaging, signing and publishing configuration.
// https://www.electron.build/configuration
//
// Signing is enabled only when the matching environment variables are set (see the release
// workflow in .github/workflows/release.yml), so local and unsigned CI builds keep working.

const { env } = process

const config: Configuration = {
  appId: 'com.example.electron-app',
  copyright: `Copyright © ${new Date().getFullYear()} Your Name`,

  directories: {
    buildResources: 'build',
    output: 'dist'
  },
  // Production dependencies (`dependencies` in package.json) are added automatically
  files: [
    'out/**/*',
    'package.json',
    // better-sqlite3 ships its C sources and binaries for every platform: keep only the one needed
    '!node_modules/better-sqlite3/{deps,src,build}/**',
    '!node_modules/better-sqlite3/prebuilds/*',
    // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder macro, not a template
    'node_modules/better-sqlite3/prebuilds/${platform}-${arch}.node'
  ],
  extraResources: [
    { from: 'resources', to: 'resources' },
    { from: 'drizzle', to: 'drizzle' }
  ],
  // Native modules cannot be loaded from inside the asar archive
  asarUnpack: ['**/*.node'],

  // Electron fuses, flipped in the Electron binary at packaging time.
  // https://www.electronjs.org/docs/latest/tutorial/fuses
  // The app only runs the code from its signed app.asar, which is checked for tampering on
  // launch (ASAR integrity), and cannot be started as a plain Node.js runtime or debugger.
  electronFuses: {
    runAsNode: false,
    enableCookieEncryption: true,
    enableNodeOptionsEnvironmentVariable: false,
    enableNodeCliInspectArguments: false,
    enableEmbeddedAsarIntegrityValidation: true,
    onlyLoadAppFromAsar: true,
    // Flipping fuses invalidates the macOS signature. Re-sign ad-hoc so unsigned local builds
    // (`npm run dist:dir`) still launch on Apple Silicon; a real signature layers over it in CI.
    resetAdHocDarwinSignature: true
  },

  publish: {
    provider: 'github',
    owner: 'your-org',
    repo: 'electron-app',
    releaseType: 'draft'
  },

  mac: {
    category: 'public.app-category.productivity',
    target: [
      { target: 'dmg', arch: ['arm64', 'x64'] },
      // The zip is required by the auto updater
      { target: 'zip', arch: ['arm64', 'x64'] }
    ],
    hardenedRuntime: true,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    // Uses APPLE_API_KEY, APPLE_API_KEY_ID and APPLE_API_ISSUER
    notarize: Boolean(env.APPLE_API_KEY_ID)
  },
  dmg: {
    // build/background.png (540x380) and build/background@2x.png (1080x760)
    background: 'build/background.png',
    window: { width: 540, height: 380 },
    iconSize: 96,
    contents: [
      { x: 130, y: 190, type: 'file' },
      { x: 410, y: 190, type: 'link', path: '/Applications' }
    ]
  },

  win: {
    target: [{ target: 'nsis', arch: ['x64', 'arm64'] }],
    // Azure Trusted Signing, authenticated with AZURE_TENANT_ID, AZURE_CLIENT_ID and
    // AZURE_CLIENT_SECRET. Replace the values below with your own account.
    azureSignOptions: env.AZURE_CLIENT_ID
      ? {
          publisherName: env.AZURE_PUBLISHER_NAME || 'Your Name',
          endpoint: env.AZURE_ENDPOINT || 'https://eus.codesigning.azure.net',
          codeSigningAccountName: env.AZURE_CODE_SIGNING_ACCOUNT || 'your-account',
          certificateProfileName: env.AZURE_CERTIFICATE_PROFILE || 'your-profile'
        }
      : null
  },
  nsis: {
    oneClick: true,
    // biome-ignore lint/suspicious/noTemplateCurlyInString: electron-builder macro, not a template
    artifactName: '${productName}-Setup-${version}-${arch}.${ext}'
  },

  linux: {
    target: ['AppImage', 'deb'],
    category: 'Utility',
    maintainer: 'Your Name <you@example.com>'
  }
}

export default config
