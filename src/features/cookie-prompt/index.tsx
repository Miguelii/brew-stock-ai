'use client'

import { useEffect, useState } from 'react'
import { CookieIcon } from 'lucide-react'
import { trpc } from '@/server/trpc-client'
import { toast } from 'sonner'
import Link from 'next/link'
import { PromptCard } from '@/components/ui/prompt-card'
import { CONSENT_COOKIE } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export function CookiePrompt() {
    const [open, setOpen] = useState(false)

    const router = useRouter()

    const consentMutation = trpc.createConsentCookie.useMutation({
        onSuccess: () => setOpen(false),
        onError: () => toast.error('Could not save your cookie preference. Please try again.'),
    })

    const handler = (allow: boolean) => {
        setOpen(false)

        // 1. updates google dataLayer analytics values
        globalThis?.gtag('consent', 'update', {
            ad_storage: allow ? 'granted' : 'denied',
            analytics_storage: allow ? 'granted' : 'denied',
        })

        // 3. Create cookie
        consentMutation.mutate({ allowAnalytics: allow })

        router.refresh()
    }

    useEffect(() => {
        const hasConsent = document.cookie
            .split(';')
            .some((c) => c.trim().startsWith(`${CONSENT_COOKIE}=`))
        if (!hasConsent) setOpen(true)
    }, [])

    if (!open) return null

    return (
        <PromptCard
            icon={
                <CookieIcon
                    aria-hidden="true"
                    className="w-4 h-4 text-accent-blue shrink-0 mt-0.5"
                />
            }
            title="We use cookies"
            description={
                <>
                    We use strictly necessary cookies to manage your session. See our{' '}
                    <Link
                        href="/privacy"
                        className="underline text-foreground hover:text-foreground/80 transition-colors"
                    >
                        privacy notice
                    </Link>{' '}
                    for details.
                </>
            }
            isPending={consentMutation.isPending}
            primaryAction={{
                label: 'Accept',
                onClick: () => handler(true),
            }}
            secondaryAction={{
                label: 'Decline',
                onClick: () => handler(false),
            }}
        />
    )
}
