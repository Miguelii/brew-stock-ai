import { Header } from '@/components/header'
import { PushNotificationShell } from '@/modules/push-notifications/push-notification-shell'
import { getCachedSession } from '@/services/core/auth/get-cached-session'

export default function AppLayout({ children }: LayoutProps<'/'>) {
    const user = getCachedSession()

    return (
        <>
            <Header userPromise={user} />
            <PushNotificationShell userPromise={user} />
            {children}
        </>
    )
}
