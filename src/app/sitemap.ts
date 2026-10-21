import { MetadataRoute } from 'next'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../convex/_generated/api'
import { projectHref } from '@/lib/projects'
import { SITE_URL } from '@/lib/structured-data'

const BASE_URL = SITE_URL
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL

export const revalidate = 60

const staticPages = [
  '/',
  '/about',
  '/blog',
  '/browser-tabs',
  '/career-and-resume',
  '/color-guide',
  '/conferences',
  '/contact',
  '/link-page',
  '/logo-page',
  '/projects',
  '/react-maintenance',
  '/site-history',
  '/site-map',
  '/wordpress-maintenance',
  '/admin-showcase',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Omit lastModified when no content-update date is tracked. Generating the
  // sitemap does not mean these pages (or conference-year indexes) changed.
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: path === '/' ? BASE_URL : `${BASE_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }))

  let conferenceUrls: MetadataRoute.Sitemap = []
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    const confs = await convex.query(api.conferences.getAll, {})
    const seen = new Set<string>()
    conferenceUrls = confs.flatMap((conf) => {
      const entries: MetadataRoute.Sitemap = []
      const yearKey = String(conf.year)
      if (!seen.has(yearKey)) {
        seen.add(yearKey)
        entries.push({
          url: `${BASE_URL}/conferences/${conf.year}`,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })
      }
      entries.push({
        url: `${BASE_URL}/conferences/${conf.year}/${conf.slug}`,
        lastModified: new Date(conf.updatedAt),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      })
      return entries
    })
  } catch (error) {
    console.error('Error fetching conferences for sitemap:', error)
  }

  let projectUrls: MetadataRoute.Sitemap = []
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    const projects = await convex.query(api.projects.getAll, {})
    projectUrls = projects.map((project) => ({
      url: `${BASE_URL}${projectHref(project)}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  if (!CONVEX_SITE_URL) {
    return [...staticUrls, ...conferenceUrls, ...projectUrls]
  }

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

    return [...staticUrls, ...conferenceUrls, ...projectUrls, ...blogUrls]
  } catch (error) {
    console.error('Error generating sitemap dynamic entries:', error)
    return [...staticUrls, ...conferenceUrls, ...projectUrls]
  }
}
