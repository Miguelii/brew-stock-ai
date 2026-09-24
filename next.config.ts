import { loadSystemEnvs } from '@/env/load-system-envs'
import { NEWS_IMAGE_SOURCES } from '@/_bff/core/constants/news.constants'
import type { NextConfig } from 'next'

loadSystemEnvs()

const nextConfig: NextConfig = {
    reactCompiler: true,
    // Prevent Next.js from bundling these packages (they contain native binaries)
    serverExternalPackages: ['@sparticuz/chromium', '@sparticuz/chromium-min', 'puppeteer-core'],
    experimental: {
        useTypeScriptCli: true,
        optimizePackageImports: [
            '@base-ui/react',
            '@hookform/resolvers',
            '@tanstack/react-query',
            '@trpc/client',
            'zod',
            'react-hook-form',
            'vaul',
            'input-otp',
            'lenis',
            'cn',
        ],
    },
    images: {
        localPatterns: [
            {
                pathname: '/assets/**',
            },
        ],
        remotePatterns: [
            {
                hostname: 'lh3.googleusercontent.com',
            },
            ...NEWS_IMAGE_SOURCES.map(({ hostname, pathnamePrefix }) => ({
                protocol: 'https' as const,
                hostname,
                pathname: `${pathnamePrefix}**`,
            })),
        ],
        minimumCacheTTL: 31536000, // 365 days
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'no-referrer' },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    { key: 'X-Xss-Protection', value: '0' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
                    },
                ],
            },
            {
                // CSP on the service worker response governs the worker's own
                // execution context; no-cache so browsers pick up SW updates
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                    { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
                ],
            },
        ]
    },
}

export default nextConfig
