// Refreshes the GitHub stats and Electron versions in docs/data/boilerplates.json.
//
// Stars, forks, last commit, archived state and the Electron version of each template's
// package.json are read from GitHub, and the latest Electron release from npm. Features and stack
// are curated by hand and left untouched. Set GITHUB_TOKEN to avoid the API rate limit.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const file = join(import.meta.dirname, '..', 'docs', 'data', 'boilerplates.json')
const data = JSON.parse(readFileSync(file, 'utf8'))

const headers = process.env.GITHUB_TOKEN
  ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
  : {}

async function getJson(url) {
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.json()
}

data.latestElectron = (await getJson('https://registry.npmjs.org/electron/latest')).version

for (const boilerplate of data.boilerplates) {
  if (!boilerplate.github) continue
  try {
    const repo = await getJson(`https://api.github.com/repos/${boilerplate.github}`)
    boilerplate.stars = repo.stargazers_count
    boilerplate.forks = repo.forks_count
    boilerplate.lastCommit = repo.pushed_at
    boilerplate.archived = repo.archived

    // `packageJson` is "owner/repo/path/to/package.json"
    if (boilerplate.packageJson) {
      const [owner, name, ...path] = boilerplate.packageJson.split('/')
      const pkg = await getJson(
        `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${path.join('/')}`
      )
      const electron = pkg.devDependencies?.electron ?? pkg.dependencies?.electron
      if (electron) boilerplate.electron = electron
    }
    console.log(`${boilerplate.name}: ${boilerplate.stars} stars, Electron ${boilerplate.electron}`)
  } catch (error) {
    console.warn(`${boilerplate.name}: ${error.message}, keeping the previous values`)
  }
}

data.updatedAt = new Date().toISOString().slice(0, 10)
writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
