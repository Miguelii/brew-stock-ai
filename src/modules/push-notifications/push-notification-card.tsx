'use client'

import { useEffect, useState } from 'react'
import { BellIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ClientEnv } from '@/env/client'
import { trpc } from '@/server/trpc-client'
import { PUSH_DISMISS_TTL_DAYS, PUSH_DISMISSED_KEY, SW_PATH } from '@/lib/constants'
import { PromptCard } from '@/components/ui/prompt-card'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replaceAll('-', '+').replaceAll('_', '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.codePointAt(i) ?? 0
    }
    return outputArray
}

export function PushNotificationCard() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const subscribeMutation = trpc.subscribePush.useMutation({
        onSuccess: () => {
            toast.success('Notifications enabled.')
            setOpen(false)
        },
        onError: (error) => {
            console.error(error)
            toast.error('Could not enable notifications.')
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

    async function handleEnable() {
        setIsLoading(true)
        try {
            const registration = await navigator.serviceWorker.ready
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
            })
            await subscribeMutation.mutateAsync({
                subscription: sub.toJSON() as {
                    endpoint: string
                    expirationTime: number | null
                    keys: { p256dh: string; auth: string }
                },
            })
        } catch (error) {
            console.error(error)
            toast.error('Could not enable notifications. Check your browser permissions.')
            setOpen(false)
        } finally {
            setIsLoading(false)
        }
    }

    function handleDismiss() {
        localStorage.setItem(PUSH_DISMISSED_KEY, String(Date.now()))
        setOpen(false)
    }

    if (!open) return null

    return (
        <PromptCard
            icon={
                <BellIcon aria-hidden="true" className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
            }
            title="Enable notifications"
            description="Get notified when your analysis reports are ready."
            isPending={isLoading || subscribeMutation.isPending}
            onDismiss={handleDismiss}
            primaryAction={{ label: 'Enable', onClick: handleEnable }}
            secondaryAction={{ label: 'Later', onClick: handleDismiss }}
        />
    )
}
