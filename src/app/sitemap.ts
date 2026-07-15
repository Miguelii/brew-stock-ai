import { ClientEnv } from '@/env/client'
import { EDUCATION_HUB_ARTICLES } from '@/modules/education-hub/education-hub-articles'
import { CHANGELOG_ENTRIES } from '@/modules/changelog/changelog'
import { TICKER_PAGES, isTickerEnriched } from '@/modules/analysis/ticker-pages'
import type { MetadataRoute } from 'next'
import { latestIsoDay } from '@/lib/formatters'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
    const enrichedTickers = TICKER_PAGES.filter((t) => isTickerEnriched(t))

    const educationHubRoutes: MetadataRoute.Sitemap = EDUCATION_HUB_ARTICLES.map((a) => ({
        url: `${siteUrl}/education-hub/${a.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(a.updatedAt ?? a.publishedAt),
        priority: 0.8,
    }))

    // Only enriched ticker pages are indexable, so only they belong in the sitemap.
    const tickerRoutes: MetadataRoute.Sitemap = enrichedTickers.map((t) => ({
        url: `${siteUrl}/analysis/${t.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(t.content.updatedAt),
        priority: 0.7,
    }))

    const changelogRoutes: MetadataRoute.Sitemap = CHANGELOG_ENTRIES.map((e) => ({
        url: `${siteUrl}/changelog/${e.slug}`,
        changeFrequency: 'monthly',
        lastModified: new Date(e.publishedAt),
        priority: 0.7,
    }))

    // Listing pages change when their newest child does; static marketing pages
    // carry no lastModified at all — a fabricated date teaches Google to ignore
    // the field for the whole site.
    const latestArticleDate = latestIsoDay(
        EDUCATION_HUB_ARTICLES.map((a) => a.updatedAt ?? a.publishedAt)
    )
    const latestChangelogDate = latestIsoDay(CHANGELOG_ENTRIES.map((e) => e.publishedAt))
    const latestTickerDate = latestIsoDay(enrichedTickers.map((t) => t.content.updatedAt))

    return [
        {
            url: siteUrl,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/analysis`,
            lastModified: latestTickerDate,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/education-hub`,
            lastModified: latestArticleDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/pricing`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/contact`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/example-report`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/about`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/faq`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/changelog`,
            lastModified: latestChangelogDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...educationHubRoutes,
        ...changelogRoutes,
        ...tickerRoutes,
        {
            url: `${siteUrl}/privacy`,
            changeFrequency: 'monthly',
            priority: 0.2,
        },
        {
            url: `${siteUrl}/disclaimer`,
            changeFrequency: 'monthly',
            priority: 0.2,
        },
    ]
}
