import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import { openGraphImages } from '../../../metadata'
import { author, JsonLd, organization, siteUrl } from '../../../structured-data'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = {
  params: Promise<{ mdxPath?: string[] }>
}

const siteName = 'Electron AppStack'
const suffix = ` – ${siteName}`
// Longer titles are cut in search results: drop the site name suffix rather than the keywords
const maxTitleLength = 60

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  // `title` and `description` come from the frontmatter of each page in content/
  const title = String(metadata.title)
  const description = metadata.description ?? undefined
  const url = pageUrl(params.mdxPath)
  const fullTitle = title.length + suffix.length <= maxTitleLength ? `${title}${suffix}` : title

  return {
    ...metadata,
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName,
      title,
      description,
      images: openGraphImages
    },
    twitter: { card: 'summary_large_image', title, description, images: openGraphImages }
  }
}

const Wrapper = getMDXComponents().wrapper

function pageUrl(mdxPath?: string[]) {
  return mdxPath?.length ? `/doc/${mdxPath.join('/')}` : '/doc'
}

// TechArticle for the page, and its breadcrumb (Home > Docs > Page)
function structuredData(mdxPath: string[] | undefined, metadata: Record<string, unknown>) {
  const url = `${siteUrl}${pageUrl(mdxPath)}`
  const title = String(metadata.title)
  const crumbs = [
    { name: 'Electron AppStack', item: siteUrl },
    { name: 'Docs', item: `${siteUrl}/doc` },
    ...(mdxPath?.length ? [{ name: title, item: url }] : [])
  ]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: title,
        description: metadata.description,
        url,
        image: `${siteUrl}/opengraph-image.png`,
        inLanguage: 'en',
        // Last commit of the page, set by Nextra
        ...(typeof metadata.timestamp === 'number'
          ? { dateModified: new Date(metadata.timestamp).toISOString() }
          : {}),
        author: { '@type': 'Person', name: author.name, url: author.url },
        publisher: {
          '@type': 'Organization',
          name: organization.name,
          url: organization.url,
          logo: organization.logo
        },
        about: { '@type': 'SoftwareSourceCode', name: 'Electron AppStack', url: siteUrl }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...crumb
        }))
      }
    ]
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <JsonLd data={structuredData(params.mdxPath, metadata)} />
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
