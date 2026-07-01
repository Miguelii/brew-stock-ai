import webpush from 'web-push'
import { ServerEnv } from '@/env/server'
import { ClientEnv } from '@/env/client'

export function setupVapid() {
    webpush.setVapidDetails(
        'mailto:miguelgoncalves18@hotmail.com',
        ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ServerEnv.VAPID_PRIVATE_KEY
    )
}
