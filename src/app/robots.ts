import type { MetadataRoute } from 'next'
import { ClientEnv } from '@/env/client'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/reports'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
