import { getCachedSession } from '@/_bff/modules/auth/services/get-cached-session.service'
import { Header } from '@/components/header'
import { PushNotificationShell } from '@/modules/push-notifications/push-notification-shell'

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
