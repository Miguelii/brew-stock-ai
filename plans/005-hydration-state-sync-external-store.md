# 005 — Hydration state via useSyncExternalStore (use-mobile, use-last-used)

- **Status**: TODO
- **Commit**: 9332d06
- **Severity**: MEDIUM
- **Category**: Bugs & correctness / Performance
- **Rule**: react-hooks-js/set-state-in-effect
- **Estimated scope**: 2 files, full-file rewrites of two small hooks

## Problem

Two hooks initialize state from browser APIs with a synchronous `setState` inside `useEffect` — an extra render on mount and a React Compiler memoization bail in every consumer. Both are subscriptions to external stores, which is exactly what `useSyncExternalStore` is for.

```ts
// src/hooks/use-mobile.ts:8-14 — current (consumer: src/components/ui/sonner.tsx → mounted globally)
React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) // ← sync setState in effect
    return () => mql.removeEventListener('change', onChange)
}, [])
```

```ts
// src/modules/auth/auth-card/use-last-used.ts:10-13 — current
useEffect(() => {
    const stored = localStorage.getItem(LAST_USED_KEY) as LastUsed | null
    setLastUsed(stored) // ← sync setState in effect
}, [])
```

## Target

```ts
// target — src/hooks/use-mobile.ts (whole file)
import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(callback: () => void) {
    const mql = window.matchMedia(MOBILE_QUERY)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
}

export function useIsMobile() {
    return React.useSyncExternalStore(
        subscribe,
        () => window.matchMedia(MOBILE_QUERY).matches,
        () => false
    )
}
```

```ts
// target — src/modules/auth/auth-card/use-last-used.ts (whole file)
import { useSyncExternalStore } from 'react'

const LAST_USED_KEY = 'auth_last_used'
const LAST_USED_EVENT = 'auth-last-used-change'

type LastUsed = 'google' | 'email'

function subscribe(callback: () => void) {
    window.addEventListener('storage', callback)
    window.addEventListener(LAST_USED_EVENT, callback)
    return () => {
        window.removeEventListener('storage', callback)
        window.removeEventListener(LAST_USED_EVENT, callback)
    }
}

export const useLastUsed = () => {
    const lastUsed = useSyncExternalStore(
        subscribe,
        () => localStorage.getItem(LAST_USED_KEY) as LastUsed | null,
        () => null
    )

    const saveLastUsed = (method: LastUsed) => {
        localStorage.setItem(LAST_USED_KEY, method)
        window.dispatchEvent(new Event(LAST_USED_EVENT))
    }

    return { lastUsed, saveLastUsed }
}
```

Behavioral notes (both intentional, both improvements):

- `useIsMobile` previously returned `false` on the first client render and flipped after the effect; it now returns the correct value immediately on hydration. Server snapshot `false` matches the previous SSR output. The return type stays `boolean` (`.matches`), so the `!!isMobile` coercion disappears with the state.
- `useLastUsed` snapshot returns a primitive (`string | null`), so snapshot stability is guaranteed. The custom event keeps same-tab updates reactive (the native `storage` event only fires cross-tab).

## Repo conventions to follow

- `use-mobile.ts` uses the `import * as React` style — preserve it.
- `use-last-used.ts` uses named imports and arrow-function export — preserve it.
- Hook APIs must not change: `useIsMobile(): boolean`; `useLastUsed(): { lastUsed, saveLastUsed }`.

## Steps

1. Replace the body of `src/hooks/use-mobile.ts` with the target above.
2. Replace the body of `src/modules/auth/auth-card/use-last-used.ts` with the target above.
3. Check consumers compile unchanged: `src/components/ui/sonner.tsx:16` and the auth-card usages of `lastUsed`/`saveLastUsed`.

## Boundaries

- Do NOT change `MOBILE_BREAKPOINT`, `LAST_USED_KEY`, or the `LastUsed` union.
- Do NOT touch the consumers.
- Do NOT add dependencies.
- STOP if the files have drifted from commit 9332d06; report the drift instead of improvising.

## Verification

- **Mechanical**:
    - `npx react-doctor@latest --scope changed` — both `set-state-in-effect` diagnostics clear; the previously mis-reported `unused-file` on use-mobile must not become an excuse to delete it (it is imported by `sonner.tsx:12`); score does not regress.
    - `pnpm check` and `pnpm test` pass.
- **Behavior check**: on a mobile-width viewport trigger any toast (e.g. decline cookie consent with network offline) and confirm the Sonner toaster position matches current behavior; resize across 768px and trigger again. On `/auth`, sign in with Google once, reload — the "last used" affordance on the auth card still shows Google.
- **Done when**: both diagnostics clear, checks pass, and both consumers behave identically.
