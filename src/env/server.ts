import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const ServerEnv = createEnv({
    server: {
        NEXT_SUPABASE_URL: z.string(),
        NEXT_SUPABASE_PUBLISHABLE_KEY: z.string(),
        NEXT_SUPABASE_SERVICE_ROLE_KEY: z.string(),
        NEXT_ANTHROPIC_AI_KEY: z.string(),
        VAPID_PRIVATE_KEY: z.string(),
        VAPID_CONTACT_EMAIL: z.string().default('stockbrew.support@gmail.com'),
        STRIPE_SECRET_KEY: z.string().optional(),
        STRIPE_WEBHOOK_SECRET: z.string().optional(),
        NEXT_FINNHUB_API_KEY: z.string(),
        NEXT_FINNHUB_BASE_URL: z.string().default('https://finnhub.io/api/v1'),
    },
    runtimeEnv: {
        NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL,
        NEXT_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_SUPABASE_PUBLISHABLE_KEY,
        NEXT_SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
        NEXT_ANTHROPIC_AI_KEY: process.env.NEXT_ANTHROPIC_AI_KEY,
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
        VAPID_CONTACT_EMAIL: process.env.VAPID_CONTACT_EMAIL,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        NEXT_FINNHUB_API_KEY: process.env.NEXT_FINNHUB_API_KEY,
        NEXT_FINNHUB_BASE_URL: process.env.NEXT_FINNHUB_BASE_URL,
    },
})
