import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod/mini'

export const ServerEnv = createEnv({
    server: {
        NEXT_SUPABASE_URL: z.string(),
        NEXT_SUPABASE_PUBLISHABLE_KEY: z.string(),
        NEXT_SUPABASE_SERVICE_ROLE_KEY: z.string(),
        NEXT_ANTHROPIC_AI_KEY: z.string(),
        VAPID_PRIVATE_KEY: z.string(),
    },
    runtimeEnv: {
        NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL,
        NEXT_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_SUPABASE_PUBLISHABLE_KEY,
        NEXT_SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
        NEXT_ANTHROPIC_AI_KEY: process.env.NEXT_ANTHROPIC_AI_KEY,
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    },
})
