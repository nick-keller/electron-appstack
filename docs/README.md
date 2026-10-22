# Electron AppStack docs

Source of [electron-appstack.com](https://electron-appstack.com), built with [Next.js](https://nextjs.org/) and [Nextra](https://nextra.site/).

```sh
pnpm dev     # http://localhost:3000
pnpm build   # also builds the search index with Pagefind
```

The landing page is `app/(home)/page.tsx`. Documentation pages are MDX files in `content/`, served under `/doc`. The sidebar order is set in `content/_meta.ts`.
