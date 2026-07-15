import type { MetadataRoute } from 'next'
import { ClientEnv } from '@/env/client'

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/reports', '/auth', '/account', '/tokens'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
