'use client'

import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { BellIcon } from 'lucide-react'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast-error'
import { ClientEnv } from '@/env/client'
import { trpcClient } from '@/_trpc/client'
import { SW_PATH } from '@/lib/constants'
import { PUSH_DISMISS_TTL_DAYS, PUSH_DISMISSED_KEY } from '@/modules/push-notifications/constants'
import { PromptCard } from '@/components/ui/prompt-card'
import { urlBase64ToUint8Array } from './push-notification-card.helpers'

export function PushNotificationCard() {
    const [open, setOpen] = useState(false)
    const [optimisticOpen, setOptimisticOpen] = useOptimistic(open, (_, next: boolean) => next)
    const [isPending, startTransition] = useTransition()

    const subscribeMutation = trpcClient.core.subscribePush.useMutation({
        onError: (error) => {
            console.error(error)
            toastError('Could not enable notifications.', error, 'Please try again later.')
        },
    })

    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
        const dismissedAt = localStorage.getItem(PUSH_DISMISSED_KEY)
        if (dismissedAt) {
            const days = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24)
            if (days < PUSH_DISMISS_TTL_DAYS) return
        }

        navigator.serviceWorker
            .register(SW_PATH, { scope: '/', updateViaCache: 'none' })
            .then((registration) => registration.pushManager.getSubscription())
            .then((sub) => {
                if (!sub) setOpen(true)
            })
            .catch(() => {})
    }, [])

    function handleEnable() {
        startTransition(async () => {
            setOptimisticOpen(false)
            try {
                const registration = await navigator.serviceWorker.ready
                const sub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                    ),
                })
                await subscribeMutation.mutateAsync({
                    subscription: sub.toJSON() as {
                        endpoint: string
                        expirationTime: number | null
                        keys: { p256dh: string; auth: string }
                    },
                })
                setOpen(false)
                toast.success('Notifications enabled.')
            } catch (error) {
                console.error(error)
                toastError(
                    'Could not enable notifications.',
                    error,
                    'Check your browser permissions.'
                )
            }
        })
    }

    function handleDismiss() {
        localStorage.setItem(PUSH_DISMISSED_KEY, String(Date.now()))
        setOpen(false)
    }

    if (!optimisticOpen) return null

    return (
        <PromptCard
            icon={
                <BellIcon aria-hidden="true" className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
            }
            title="Enable notifications"
            description="Get notified when your analysis reports are ready."
            isPending={isPending}
            onDismiss={handleDismiss}
            primaryAction={{ label: 'Enable', onClick: handleEnable }}
            secondaryAction={{ label: 'Later', onClick: handleDismiss }}
        />
    )
}
