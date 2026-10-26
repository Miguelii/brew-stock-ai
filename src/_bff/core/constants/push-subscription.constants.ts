import { z } from 'zod'

// Browser `PushSubscription.toJSON()` payload, as sent by the client and stored per user
export const PUSH_SUBSCRIPTION_SCHEMA = z.object({
    endpoint: z.string(),
    expirationTime: z.number().nullable(),
    keys: z.object({ p256dh: z.string(), auth: z.string() }),
})
