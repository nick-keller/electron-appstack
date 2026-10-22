# Changesets

Each file in this folder describes a change that will be released in the next version.

Run `npm run changeset` to create one: pick the bump type (`patch`, `minor` or `major`) and
write a short summary for users. Commit it with your change.

On `main`, the release workflow opens a "Version Packages" pull request that bumps the version in
`package.json` and writes `CHANGELOG.md`. Merging it builds, signs and publishes the release.

See the [release documentation](https://electron-appstack.com/releasing).
