import { getCachedClaims } from '@/_bff/modules/auth/services/get-cached-claims.service'
import { Header } from '@/components/header'
import { PushNotificationShell } from '@/modules/push-notifications/push-notification-shell'

export default function AppLayout({ children }: LayoutProps<'/'>) {
    const user = getCachedClaims()

    return (
        <>
            <Header userPromise={user} />
            <PushNotificationShell userPromise={user} />
            {children}
        </>
    )
}
