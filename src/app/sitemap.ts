import { MetadataRoute } from 'next'
import { conferences } from '@/data/conferences'

const BASE_URL = 'https://www.chrislanejones.com'
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL

const staticPages = [
  '/',
  '/about',
  '/blog',
  '/browser-tabs',
  '/career-and-resume',
  '/conferences',
  '/contact',
  '/link-page',
  '/logo-page',
  '/projects',
  '/projects/apps',
  '/projects/websites',
  '/react-maintenance',
  '/site-history',
  '/site-map',
  '/wordpress-maintenance',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }))

  const conferenceUrls: MetadataRoute.Sitemap = conferences.flatMap((conf) => [
    {
      url: `${BASE_URL}/conferences/${conf.year}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/conferences/${conf.year}/${conf.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ])

  try {
    const res = await fetch(`${CONVEX_SITE_URL}/sitemap-data`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Convex sitemap-data returned ${res.status}`)

    const { blogPosts } = await res.json()

    const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post: { slug: string; updatedAt?: number; createdAt: number }) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticUrls, ...conferenceUrls, ...blogUrls]
  } catch (error) {
    console.error('Error generating sitemap dynamic entries:', error)
    return [...staticUrls, ...conferenceUrls]
  }
}
