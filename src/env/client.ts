import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const ClientEnv = createEnv({
    client: {
        NEXT_PUBLIC_WEBSITE_URL: z.string(),
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        NEXT_PUBLIC_WEBSITE_URL: normalizeWebsiteUrl(
            process?.env?.NEXT_PUBLIC_WEBSITE_URL ?? undefined
        ),
    },
})

function normalizeWebsiteUrl(normalized = 'http://localhost:3000'): string {
    // Always returns https
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`
    }

    // Always returns without final slash
    if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1)
    }

    return normalized
}
