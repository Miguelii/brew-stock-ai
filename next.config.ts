import { loadSystemEnvs } from '@/env/load-system-envs'
import type { NextConfig } from 'next'

loadSystemEnvs()

const buildTimestamp = Date.now().toString()

const nextConfig: NextConfig = {
    reactCompiler: true,
    // Prevent Next.js from bundling these packages (they contain native binaries)
    serverExternalPackages: ['@sparticuz/chromium', '@sparticuz/chromium-min', 'puppeteer-core'],
    experimental: {
        optimizePackageImports: [
            '@base-ui/react',
            '@hookform/resolvers',
            '@tanstack/react-query',
            '@trpc/client',
            'class-variance-authority',
            'lucide-react',
            'zod',
            'react-hook-form',
            'shadcn',
            'tailwind-merge',
            'tw-animate-css',
            'vaul',
            'yahoo-finance2',
            'input-otp',
            'recharts',
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
        ],
        minimumCacheTTL: 31536000, // 365 days
    },
    env: {
        NEXT_PUBLIC_BUILD_TIMESTAMP:
            process.env.NODE_ENV === 'production' ? buildTimestamp : undefined,
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
