# 002 — Replace PublicHeader scroll state with useSyncExternalStore

- **Status**: TODO
- **Commit**: 9332d06
- **Severity**: MEDIUM-HIGH
- **Category**: Performance
- **Rule**: react-hooks-js/set-state-in-effect (+ react-doctor/no-static-element-interactions, react-doctor/click-events-have-key-events, react-doctor/button-has-type on the same file)
- **Estimated scope**: 1 file (`src/components/public-header/index.tsx`), ~30 changed lines

## Problem

`PublicHeader` is mounted in `src/app/(public)/layout.tsx` and `src/app/not-found.tsx` — it renders on **every public page** and re-renders on scroll.

```tsx
// src/components/public-header/index.tsx:18-30 — current
export function PublicHeader() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        setScrolled(window.scrollY > 60)          // ← sync setState in effect body
        const onScroll = () => {
            setScrolled(window.scrollY > 60)
            setMenuOpen(false)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
```

The synchronous `setScrolled(...)` at line 23 causes an extra render on mount and makes React Compiler bail out of memoizing the component. The scroll position is an external store; the canonical replacement is `useSyncExternalStore` (React docs, "Subscribing to a browser API"). Same file also carries three related flagged nits:

```tsx
// src/components/public-header/index.tsx:36-38 — current
{
    menuOpen && <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMenuOpen(false)} />
}
```

The dismiss scrim is a clickable `div` with no role/keyboard path, and the menu toggle `<button>` at line 102 has no `type`.

## Target

```tsx
// target — src/components/public-header/index.tsx (structure)
'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
// ...other imports unchanged

const subscribeToScroll = (callback: () => void) => {
    window.addEventListener('scroll', callback, { passive: true })
    return () => window.removeEventListener('scroll', callback)
}

export function PublicHeader() {
    // Re-renders only when the boolean flips, not on every scroll tick.
    const scrolled = useSyncExternalStore(
        subscribeToScroll,
        () => window.scrollY > 60,
        () => false
    )
    const [menuOpen, setMenuOpen] = useState(false)

    // Close the open mobile menu on scroll or Escape. setState inside event
    // callbacks is fine — the rule only forbids sync setState in the effect body.
    useEffect(() => {
        if (!menuOpen) return
        const close = () => setMenuOpen(false)
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
        }
        window.addEventListener('scroll', close, { passive: true })
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('scroll', close)
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [menuOpen])

    // ...JSX unchanged except:
```

JSX deltas:

```tsx
// scrim (line 36-38): non-interactive for AT, Escape handled by the effect above
{menuOpen && (
    <div
        aria-hidden="true"
        className="fixed inset-0 z-50 md:hidden"
        onClick={() => setMenuOpen(false)}
    />
)}

// menu toggle (line 102): explicit type + expanded state
<button
    type="button"
    aria-expanded={menuOpen}
    onClick={() => setMenuOpen((v) => !v)}
    className="md:hidden flex items-center justify-center w-8 h-8 rounded-none hover:bg-muted transition-colors duration-200 text-primary"
    aria-label="Toggle menu"
>
```

## Repo conventions to follow

- `cn()` for class merging, semantic tokens, `@/` alias imports — all already respected in this file; do not churn them.
- Module-scope `subscribeToScroll` mirrors the module-scope `NAV_LINKS` constant style already in the file.

## Steps

1. In `src/components/public-header/index.tsx`, remove the `scrolled` `useState` and the existing effect (lines 19, 22-30); add `subscribeToScroll` at module scope and the `useSyncExternalStore` call as in Target.
2. Add the new `menuOpen`-scoped effect (scroll + Escape close).
3. Apply the two JSX deltas (scrim `aria-hidden`, toggle `type="button"` + `aria-expanded`).
4. Update the react import line (`useSyncExternalStore`).
5. Re-read the diff — no visual/behavioral change besides Escape-to-close.

## Boundaries

- Do NOT change the 60px threshold, class names, animation props, or nav links.
- Do NOT convert the scrim to a `<button>` (it would join the tab order; Escape covers keyboard dismissal).
- Do NOT add dependencies.
- STOP if the file has drifted from commit 9332d06; report the drift instead of improvising.

## Verification

- **Mechanical**:
    - `npx react-doctor@latest --scope changed` — `set-state-in-effect`, `no-static-element-interactions`, `click-events-have-key-events`, and the line-102 `button-has-type` diagnostics for this file clear; score does not regress.
    - `pnpm check` and `pnpm test` pass.
- **Behavior check**: on `/pricing` (or any public page), scroll past 60px — the header shrinks exactly as before; scroll back up — it expands. On mobile viewport, open the menu, press Escape — it closes; open it and scroll — it closes. In React DevTools Profiler with "Highlight updates": before the change the header flashes on every scroll tick; after, it flashes only when crossing the 60px threshold.
- **Done when**: diagnostics clear, checks pass, and the Profiler confirms re-renders only on threshold crossings.
