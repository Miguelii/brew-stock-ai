# 001 — Fix cookie consent gtag crash and hydration state

- **Status**: TODO
- **Commit**: 9332d06
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: Beyond the scan (crash) + react-hooks-js/set-state-in-effect (hydration state)
- **Estimated scope**: 1 file (`src/modules/cookie-prompt/index.tsx`), ~25 changed lines

## Problem

**Part A — crash that silently breaks consent persistence.**

```tsx
// src/modules/cookie-prompt/index.tsx:20-31 — current
const handler = (allow: boolean) => {
    setOpen(false)

    // 1. updates google dataLayer analytics values
    globalThis?.gtag('consent', 'update', {
        ad_storage: allow ? 'granted' : 'denied',
        analytics_storage: allow ? 'granted' : 'denied',
    })

    // 2. Create cookie
    consentMutation.mutate({ allowAnalytics: allow })
}
```

`globalThis?.gtag(...)` only guards `globalThis` being nullish — it does **not** guard `gtag` being undefined. `gtag` is defined by an inline script in `src/components/scripts/gtm-script.tsx` (declared in `src/types/global.d.ts:5`). If that script has not executed yet, is blocked by an ad/tracking blocker, or fails, clicking Accept/Decline throws a `TypeError` at line 24, **before** `consentMutation.mutate` runs. Result: the consent cookie is never created, the user's choice is never recorded, and the prompt reappears on every page load, forever, for those users.

**Part B — synchronous setState in effect (compiler bail + double render).**

```tsx
// src/modules/cookie-prompt/index.tsx:12,33-38 — current
const [open, setOpen] = useState(false)
...
useEffect(() => {
    const hasConsent = document.cookie
        .split(';')
        .some((c) => c.trim().startsWith(`${CONSENT_COOKIE}=`))
    if (!hasConsent) setOpen(true)
}, [])
```

`setOpen(true)` is called synchronously in the effect body, causing an extra render on mount and a React Compiler memoization bail. This component is mounted on **every page** (root layout).

## Target

```tsx
// target — src/modules/cookie-prompt/index.tsx
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

    // Server snapshot `true` keeps the prompt out of the SSR payload,
    // matching the current behavior (open starts false).
    const hasConsent = useSyncExternalStore(emptySubscribe, hasConsentCookie, () => true)

    const consentMutation = trpcClient.core.createConsentCookie.useMutation({
        onError: (error) =>
            toastError('Could not save your cookie preference.', error, 'Please try again later.'),
    })

    const handler = (allow: boolean) => {
        setDismissed(true)

        // 1. updates google dataLayer analytics values (gtag may be absent:
        //    blocked by an ad blocker or not loaded yet)
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
            ... // JSX unchanged from current lines 43-73, except the
                // `onSuccess: () => setOpen(false)` mutation option is removed
                // (dismissal now happens eagerly in `handler`)
        />
    )
}
```

Key changes:

1. `globalThis?.gtag(...)` → `globalThis.gtag?.(...)` — the optional call operator guards the function itself.
2. The `open` state + effect is replaced by `useSyncExternalStore` (cookie presence) + a plain `dismissed` state. No setState in any effect; React Compiler can memoize the component.
3. The mutation's `onSuccess: () => setOpen(false)` is removed — `setDismissed(true)` already runs eagerly in `handler` (same UX as today, where `setOpen(false)` was also called eagerly).

## Repo conventions to follow

- Keep `'use client'` first, imports via `@/` alias only (see any file under `src/modules/`).
- All code identifiers in English (project rule).
- Formatting: 4-space indent, no semicolons at line ends per surrounding code.

## Steps

1. In `src/modules/cookie-prompt/index.tsx`, replace the `useEffect`/`useState(false)` open-state logic with the `useSyncExternalStore` + `dismissed` pattern shown in Target. Hoist `emptySubscribe` and `hasConsentCookie` to module scope.
2. Change line 24 from `globalThis?.gtag('consent', 'update', {...})` to `globalThis.gtag?.('consent', 'update', {...})`.
3. Remove the now-unused `onSuccess` option from `consentMutation` and the `useEffect` import if no longer used.
4. Re-read the diff; the rendered JSX (PromptCard props other than the removed behavior) must be unchanged.

## Boundaries

- Do NOT touch `gtm-script.tsx`, `prompt-card.tsx`, or the tRPC controller.
- Do NOT change the cookie name, the mutation input, or the gtag payload.
- Do NOT add dependencies.
- STOP if the file has drifted from commit 9332d06; report the drift instead of improvising.

## Verification

- **Mechanical**:
    - `npx react-doctor@latest --scope changed` — the `set-state-in-effect` diagnostic for this file clears and the score does not regress.
    - `pnpm check` (lint + typecheck) and `pnpm test` pass.
- **Behavior check**: in a browser with cookies cleared, load any page — the prompt appears. In DevTools console run `delete globalThis.gtag`, then click **Accept**: no exception is thrown, the network tab shows the `core.createConsentCookie` tRPC call, and on reload the prompt does **not** reappear. Repeat with `gtag` present and confirm the `consent update` dataLayer push still happens.
- **Done when**: the diagnostic is clear, checks pass, and consent persists with `gtag` absent.
