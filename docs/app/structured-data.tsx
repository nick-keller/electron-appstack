// Schema.org entities shared by the JSON-LD of every page, referenced by `@id`
export const siteUrl = 'https://electron-appstack.com'

export const author = {
  '@type': 'Person',
  '@id': `${siteUrl}/#author`,
  name: 'Nicolas Keller',
  url: 'https://x.com/NicolasKa3',
  sameAs: ['https://x.com/NicolasKa3', 'https://github.com/nick-keller']
}

export const organization = {
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'Electron AppStack',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  founder: { '@id': author['@id'] },
  sameAs: [
    'https://github.com/nick-keller/electron-appstack',
    'https://peerlist.io/nicolas_tggl/project/electron-appstack'
  ]
}

export const website = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Electron AppStack',
  url: siteUrl,
  publisher: { '@id': organization['@id'] }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
