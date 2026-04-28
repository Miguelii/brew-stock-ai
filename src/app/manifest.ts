import type { MetadataRoute } from 'next'

/**
 * Web App Manifest for PWA support.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'StockBrewAI',
        short_name: 'StockBrewAI',
        description:
            'AI-powered stock analysis — institutional-grade financial insights and market sentiment for any stock.',
        start_url: '/',
        display: 'standalone',
        background_color: '#fbfbfd',
        theme_color: '#fbfbfd',
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
