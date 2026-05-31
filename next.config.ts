import { loadSystemEnvs } from '@/env/load-system-envs'
import type { NextConfig } from 'next'

loadSystemEnvs()

const buildTimestamp = Date.now().toString()

const nextConfig: NextConfig = {
    /* logging: {
        fetches: {
            fullUrl: true
        },
        serverFunctions: true,
    }, */
    reactCompiler: true,
    // Prevent Next.js from bundling these packages (they contain native binaries)
    serverExternalPackages: ['@sparticuz/chromium', '@sparticuz/chromium-min', 'puppeteer-core'],
    experimental: {
        viewTransition: true,
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
        minimumCacheTTL: 2678400, // 31 days
    },
    env: {
        NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    },
}

export default nextConfig
