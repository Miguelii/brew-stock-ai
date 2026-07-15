'use client'

import { useState, useSyncExternalStore } from 'react'
import { CookieIcon } from 'lucide-react'
import { trpcClient } from '@/_trpc/client'
import { toastError } from '@/lib/toast-error'
import Link from 'next/link'
import { PromptCard } from '@/components/ui/prompt-card'
import { CONSENT_COOKIE } from '@/lib/constants'

// The consent cookie has no change event; the snapshot is read once on
// hydration and the prompt is hidden via local `dismissed` state afterwards.
const emptySubscribe = () => () => {}

const hasConsentCookie = () =>
    document.cookie.split(';').some((c) => c.trim().startsWith(`${CONSENT_COOKIE}=`))

export function CookiePrompt() {
    const [dismissed, setDismissed] = useState(false)

    // Server snapshot `true` keeps the prompt out of the SSR payload.
    const hasConsent = useSyncExternalStore(emptySubscribe, hasConsentCookie, () => true)

    const consentMutation = trpcClient.core.createConsentCookie.useMutation({
        onError: (error) =>
            toastError('Could not save your cookie preference.', error, 'Please try again later.'),
    })

    const handler = (allow: boolean) => {
        setDismissed(true)

        // 1. updates google dataLayer analytics values
        globalThis.gtag?.('consent', 'update', {
            ad_storage: allow ? 'granted' : 'denied',
            analytics_storage: allow ? 'granted' : 'denied',
        })

        // 2. Create cookie
        consentMutation.mutate({ allowAnalytics: allow })
    }

    if (hasConsent || dismissed) return null

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
                        prefetch={false}
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
