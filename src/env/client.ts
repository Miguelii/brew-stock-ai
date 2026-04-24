import { normalizeWebsiteUrl } from '../lib/utils'
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const ClientEnv = createEnv({
    client: {
        NEXT_PUBLIC_WEBSITE_URL: z.string(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_WEBSITE_URL: normalizeWebsiteUrl(
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? undefined
        ),
    },
})
