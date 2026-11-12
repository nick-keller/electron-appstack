import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { updatedYear } from '../../../lib/boilerplates'
import { stackByPath, stackPages } from '../../../lib/stacks'
import { openGraphImages } from '../../metadata'
import { StackLanding } from '../stack-landing'
import { StackRanking, stackRankingMeta } from '../stack-ranking'

// Stack landing pages (/electron-react-boilerplate) and stack rankings
// (/best-electron-react-boilerplate), all defined in lib/stacks.ts
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return stackPages.flatMap((page) => [
    { slug: page.path.slice(1) },
    { slug: page.rankingPath.slice(1) }
  ])
}

function resolve(slug: string) {
  const path = `/${slug}`
  const page = stackByPath(path)
  if (!page) notFound()
  return { page, isRanking: page.rankingPath === path, path }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page, isRanking, path } = resolve((await params).slug)
  const { title, description, keywords } = isRanking
    ? {
        ...stackRankingMeta(page),
        keywords: [`${page.ranking.keywords[0]} ${updatedYear}`, ...page.ranking.keywords]
      }
    : page.landing
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: isRanking ? 'article' : 'website',
      url: path,
      siteName: 'Electron AppStack',
      title,
      description,
      images: openGraphImages
    },
    twitter: { card: 'summary_large_image', title, description, images: openGraphImages }
  }
}

export default async function StackPageRoute({ params }: Props) {
  const { page, isRanking } = resolve((await params).slug)
  return isRanking ? <StackRanking page={page} /> : <StackLanding page={page} />
}
