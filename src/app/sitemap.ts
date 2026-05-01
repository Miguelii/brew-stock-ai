import { ClientEnv } from '@/env/client'
import { AUTH_PAGE_PATH } from '@/lib/constants'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}${AUTH_PAGE_PATH}`,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}
