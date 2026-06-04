import { ClientEnv } from '@/env/client'
import { AUTH_PAGE_PATH } from '@/lib/constants'
import { TICKER_PAGES } from '@/lib/ticker-pages'
import { EDUCATION_HUB_ARTICLES } from '@/lib/education-hub-articles'
import { CHANGELOG_ENTRIES } from '@/lib/changelog'
import type { MetadataRoute } from 'next'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
    const tickerRoutes: MetadataRoute.Sitemap = TICKER_PAGES.map((t) => ({
        url: `${siteUrl}/analysis/${t.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(),
        priority: 0.8,
    }))

    const educationHubRoutes: MetadataRoute.Sitemap = EDUCATION_HUB_ARTICLES.map((a) => ({
        url: `${siteUrl}/education-hub/${a.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(a.publishedAt),
        priority: 0.8,
    }))

    const changelogRoutes: MetadataRoute.Sitemap = CHANGELOG_ENTRIES.map((e) => ({
        url: `${siteUrl}/changelog/${e.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(e.publishedAt),
        priority: 0.7,
    }))

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/analysis`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/education-hub`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/example-report`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/about`,
            changeFrequency: 'monthly',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: `${siteUrl}/changelog`,
            changeFrequency: 'weekly',
            lastModified: new Date(),
            priority: 0.7,
        },
        ...tickerRoutes,
        ...educationHubRoutes,
        ...changelogRoutes,
        {
            url: `${siteUrl}${AUTH_PAGE_PATH}`,
            changeFrequency: 'monthly',
            lastModified: new Date(),
            priority: 0.3,
        },
        {
            url: `${siteUrl}/privacy`,
            changeFrequency: 'monthly',
            lastModified: new Date(),
            priority: 0.2,
        },
        {
            url: `${siteUrl}/disclaimer`,
            changeFrequency: 'monthly',
            lastModified: new Date(),
            priority: 0.2,
        },
    ]
}
