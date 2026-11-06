import type { Metadata } from 'next'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import { openGraphImages } from '../../../metadata'

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
  const url = params.mdxPath?.length ? `/doc/${params.mdxPath.join('/')}` : '/doc'
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

export default async function Page(props: PageProps) {
  const params = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
