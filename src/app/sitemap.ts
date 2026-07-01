import { ClientEnv } from '@/env/client'
import { EDUCATION_HUB_ARTICLES } from '@/modules/education-hub/education-hub-articles'
import { CHANGELOG_ENTRIES } from '@/modules/changelog/changelog'
import { TICKER_PAGES, isTickerEnriched } from '@/lib/ticker/ticker-pages'
import type { MetadataRoute } from 'next'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
    const educationHubRoutes: MetadataRoute.Sitemap = EDUCATION_HUB_ARTICLES.map((a) => ({
        url: `${siteUrl}/education-hub/${a.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(a.publishedAt),
        priority: 0.8,
    }))

    // Only enriched ticker pages are indexable, so only they belong in the sitemap.
    const tickerRoutes: MetadataRoute.Sitemap = TICKER_PAGES.filter((t) => isTickerEnriched(t)).map(
        (t) => ({
            url: `${siteUrl}/analysis/${t.slug}`,
            changeFrequency: 'monthly',
            lastModified: new Date(),
            priority: 0.7,
        })
    )

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
            url: `${siteUrl}/faq`,
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
        ...educationHubRoutes,
        ...changelogRoutes,
        ...tickerRoutes,
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
