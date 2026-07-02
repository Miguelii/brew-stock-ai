import webpush from 'web-push'
import { ServerEnv } from '@/env/server'
import { ClientEnv } from '@/env/client'

export function setupVapid() {
    webpush.setVapidDetails(
        `mailto:${ServerEnv.VAPID_CONTACT_EMAIL}`,
        ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ServerEnv.VAPID_PRIVATE_KEY
    )
}
