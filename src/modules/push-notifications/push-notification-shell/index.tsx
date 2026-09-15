import type { SessionClaims } from '@/_bff/modules/auth/services/get-cached-claims.service'
import { PushNotificationCard } from '@/modules/push-notifications/push-notification-card'

type Props = {
    userPromise: Promise<SessionClaims | null>
}

export async function PushNotificationShell({ userPromise }: Props) {
    const user = await userPromise
    if (!user) return null
    return <PushNotificationCard />
}
