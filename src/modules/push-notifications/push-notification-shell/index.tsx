import type { User } from '@supabase/supabase-js'
import { PushNotificationCard } from '@/modules/push-notifications/push-notification-card'

type Props = {
    userPromise: Promise<User | null>
}

export async function PushNotificationShell({ userPromise }: Props) {
    const user = await userPromise
    if (!user) return null
    return <PushNotificationCard />
}
