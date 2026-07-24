import { ClientEnv } from '@/env/client'
import { EDUCATION_HUB_ARTICLES } from '@/modules/education-hub/education-hub-articles'
import { CHANGELOG_ENTRIES } from '@/modules/changelog/changelog'
import { TICKER_PAGES } from '@/modules/analysis/ticker-pages'
import type { MetadataRoute } from 'next'
import { latestIsoDay } from '@/lib/formatters'
import { DISCLAIMER_PAGE_LAST_UPDATE_AT, PRIVACY_PAGE_LAST_UPDATE_AT } from '@/lib/constants'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

const EDUCATION_HUB_PAGES: MetadataRoute.Sitemap = EDUCATION_HUB_ARTICLES.map((a) => ({
    url: `${siteUrl}/education-hub/${a.slug}`,
    changeFrequency: 'monthly',
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    priority: 0.7,
}))

const TICKER_ANALYSIS_PAGES: MetadataRoute.Sitemap = TICKER_PAGES.map((t) => ({
    url: `${siteUrl}/analysis/${t.slug}`,
    changeFrequency: 'monthly',
    lastModified: new Date(t.content.updatedAt),
    priority: 0.8,
}))

const CHANGE_LOG_PAGES: MetadataRoute.Sitemap = CHANGELOG_ENTRIES.map((e) => ({
    url: `${siteUrl}/changelog/${e.slug}`,
    changeFrequency: 'yearly',
    lastModified: new Date(e.publishedAt),
    priority: 0.3,
}))

const latestTickerDate = latestIsoDay(TICKER_PAGES.map((t) => t.content.updatedAt))

const latestArticleDate = latestIsoDay(
    EDUCATION_HUB_ARTICLES.map((a) => a.updatedAt ?? a.publishedAt)
)

const latestChangelogDate = latestIsoDay(CHANGELOG_ENTRIES.map((e) => e.publishedAt))

export default function sitemap(): MetadataRoute.Sitemap {
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
            priority: 0.9,
        },
        {
            url: `${siteUrl}/education-hub`,
            lastModified: latestArticleDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/changelog`,
            lastModified: latestChangelogDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${siteUrl}/pricing`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/contact`,
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/example-report`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/about`,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${siteUrl}/faq`,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...EDUCATION_HUB_PAGES,
        ...CHANGE_LOG_PAGES,
        ...TICKER_ANALYSIS_PAGES,
        {
            url: `${siteUrl}/privacy`,
            changeFrequency: 'monthly',
            lastModified: new Date(PRIVACY_PAGE_LAST_UPDATE_AT),
            priority: 0.2,
        },
        {
            url: `${siteUrl}/disclaimer`,
            changeFrequency: 'monthly',
            lastModified: new Date(DISCLAIMER_PAGE_LAST_UPDATE_AT),
            priority: 0.2,
        },
    ]
}
