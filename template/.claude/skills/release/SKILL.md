---
name: release
description: Record a change for the changelog, bump the version and publish a release. Use when finishing a user-facing change or when asked to release.
---

# Release

Versioning uses Changesets; builds are published by GitHub Actions.

1. For each user-facing change, create `.changeset/<name>.md` yourself, without being asked
   (`npm run changeset` is interactive, so write the file directly):

   ```md
   ---
   "electron-app": minor
   ---

   Add dark mode to the settings page.
   ```

   The package name is the `name` in `package.json`. Use `patch` for fixes, `minor` for features,
   `major` for breaking changes. Write the summary for users, it goes into `CHANGELOG.md`.
2. Commit the changeset with the code. On `main`, the release workflow opens a "Version Packages"
   pull request (version bump + changelog).
3. Merging that pull request tags `v<version>`, builds the app on macOS, Windows and Linux,
   signs and notarizes it when secrets are configured, uploads it to a GitHub release and
   publishes the release with the changelog. Installed apps update themselves.

Never edit the version in `package.json` or `CHANGELOG.md` by hand.
