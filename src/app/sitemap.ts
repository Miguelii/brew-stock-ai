import { ClientEnv } from '@/env/client'
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
            url: `${siteUrl}/auth`,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/sign-up`,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}
