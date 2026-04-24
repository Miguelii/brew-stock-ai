import { loadSystemEnvs } from '@/env/load-system-envs'
import type { NextConfig } from 'next'

loadSystemEnvs()

const buildTimestamp = Date.now().toString()

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    experimental: {
        viewTransition: true,
        optimizePackageImports: ['jiti'],
    },
    images: {
        localPatterns: [
            {
                pathname: '/assets/**',
            },
        ],
        minimumCacheTTL: 2678400, // 31 days
    },
    env: {
        NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    },
}

export default nextConfig
