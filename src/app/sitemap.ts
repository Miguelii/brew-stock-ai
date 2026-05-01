import { ClientEnv } from '@/env/client'
import { AUTH_PAGE_PATH } from '@/lib/constants'
import { TICKER_PAGES } from '@/lib/ticker-pages'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

    const tickerRoutes: MetadataRoute.Sitemap = TICKER_PAGES.map((t) => ({
        url: `${siteUrl}/analysis/${t.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...tickerRoutes,
        {
            url: `${siteUrl}${AUTH_PAGE_PATH}`,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/privacy`,
            changeFrequency: 'monthly',
            priority: 0.2,
        },
    ]
}
