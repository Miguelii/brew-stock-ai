'use client'

import { useState, useSyncExternalStore } from 'react'
import { CookieIcon } from 'lucide-react'
import { trpcClient } from '@/lib/trpc'
import { toastError } from '@/lib/toast-error'
import Link from 'next/link'
import { PromptCard } from '@/components/ui/prompt-card'
import { CONSENT_COOKIE } from '@/_bff/core/constants/analytics.constants'

// The consent cookie has no change event; the snapshot is read once on
// hydration and the prompt is hidden via local `dismissed` state afterwards.
const emptySubscribe = () => () => {}

/** Returns the stored decision, or `null` when the visitor has not decided yet. */
const readConsentDecision = () => {
    const entry = document.cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))

    return entry ? entry.slice(CONSENT_COOKIE.length + 1) : null
}

export function CookiePrompt() {
    const [dismissed, setDismissed] = useState(false)

    // Server snapshot 'false' keeps the prompt out of the SSR payload.
    const decision = useSyncExternalStore(emptySubscribe, readConsentDecision, () => 'false')

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

    if (decision !== null || dismissed) return null

    return (
        <PromptCard
            testId="cookie-prompt"
            icon={
                <CookieIcon
                    aria-hidden="true"
                    className="w-4 h-4 text-accent-blue shrink-0 mt-0.5"
                />
            }
            title="We use cookies"
            description={
                <>
                    Strictly necessary cookies keep you signed in. Accept to also allow analytics
                    cookies, which help us see how the site is used. See our{' '}
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
                testId: 'cookie-prompt-accept',
                onClick: () => handler(true),
            }}
            secondaryAction={{
                label: 'Decline',
                testId: 'cookie-prompt-decline',
                onClick: () => handler(false),
            }}
        />
    )
}
