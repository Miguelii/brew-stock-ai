# 004 — Migrate motion imports to LazyMotion + m (~30 kb off public pages)

- **Status**: TODO
- **Commit**: 9332d06
- **Severity**: MEDIUM
- **Category**: Performance
- **Rule**: react-doctor/use-lazy-motion
- **Estimated scope**: 3 files, mechanical component-name swaps + one wrapper per file

> **Dependency**: run AFTER plan 002 — it edits the same `public-header/index.tsx` file.

## Problem

Three components import the full `motion` component, which ships the entire animation graph (~30 kb gzipped) even though only basic DOM animations are used:

```tsx
// src/components/public-header/index.tsx:6 — current (mounted on EVERY public page)
import { motion, AnimatePresence } from 'motion/react'

// src/components/ui/macbook-scroll.tsx:4 — current (homepage hero)
import { type MotionValue, motion, useMotionValue, useScroll, useTransform } from 'motion/react'

// src/modules/education-hub/education-hub-list/index.tsx:5 — current
import { motion } from 'motion/react'
```

(`src/modules/home/hero/svg.tsx:1` imports only `type Variants` — no runtime cost, leave it alone.)

## Target

Canonical recipe (react-doctor `use-lazy-motion`): import `LazyMotion`, `m`, and the `domAnimation` feature bundle; wrap the component tree once; replace every `motion.<el>` with `m.<el>`. `AnimatePresence` and the hooks (`useScroll`, `useTransform`, `useMotionValue`) work unchanged inside the provider. Since these three components render in different layouts (`PublicHeader` also renders in `src/app/not-found.tsx`, outside the `(public)` layout), each component wraps its own root — `domAnimation` is a static import so the feature bundle is shared, not duplicated:

```tsx
// pattern — each of the 3 files
import { LazyMotion, m, domAnimation, AnimatePresence } from 'motion/react'
// (keep type MotionValue / hook imports where they exist)

export function PublicHeader() {
    // ...state/hooks unchanged
    return (
        <LazyMotion features={domAnimation} strict>
            {/* existing JSX, with every motion.div/motion.nav/motion.span/motion.article → m.div/m.nav/m.span/m.article */}
        </LazyMotion>
    )
}
```

`strict` makes any leftover `motion.*` inside the tree throw in development — it is the mechanical guard that the swap is complete.

Per-file swap inventory:

- `public-header/index.tsx`: `motion.div` (logo wrapper, mobile dropdown, dropdown items), `motion.nav`, `motion.span` ×2 → `m.*`; `AnimatePresence` stays. The component returns a fragment — wrap the whole fragment in `<LazyMotion features={domAnimation} strict>`.
- `macbook-scroll.tsx`: 4 `motion.*` usages → `m.*`; keep `MotionValue` type and `useMotionValue`/`useScroll`/`useTransform` imports. Wrap the root of the exported `MacbookScroll` component.
- `education-hub-list/index.tsx`: `motion.div` (line 60) and `motion.article` (line 68) → `m.*`. Wrap the `<section>` root.

## Repo conventions to follow

- Only the animations feature set is needed — none of these use drag/layout, so `domAnimation` (not `domMax`).
- Keep import order and formatting; `@/` alias for internal imports.

## Steps

1. In each of the three files: update the `motion/react` import to `{ LazyMotion, m, domAnimation, ... }`, wrap the component root with `<LazyMotion features={domAnimation} strict>`, and rename every `motion.<el>` to `m.<el>`.
2. Grep each file for `motion.` afterwards — zero matches expected (the `type MotionValue` import in macbook-scroll is fine).
3. Re-read the diff: animation props (`initial`/`animate`/`exit`/`variants`/`transition`) must be byte-identical.

## Boundaries

- Do NOT touch `src/modules/home/hero/svg.tsx` (type-only import).
- Do NOT change any animation values or class names.
- Do NOT hoist `LazyMotion` into layouts (not-found renders PublicHeader outside `(public)/layout.tsx`).
- Do NOT add dependencies.
- STOP if the files have drifted from commit 9332d06 (plan 002's changes to public-header are expected — apply on top of them); report any other drift.

## Verification

- **Mechanical**:
    - `npx react-doctor@latest --scope changed` — all three `use-lazy-motion` diagnostics clear; score does not regress.
    - `pnpm check` and `pnpm test` pass.
    - `pnpm build` succeeds; compare the first-load JS of `/` and `/education-hub` in the build output before/after — expect a drop (~30 kb raw) on routes that previously pulled full `motion`.
- **Behavior check**: with the dev server, load `/` — the header logo/nav fade-in, the mobile menu open/close animation, and the Macbook scroll animation on the homepage all play exactly as before (strict mode will throw loudly if a `motion.*` was missed). Load `/education-hub` and switch theme filters — the stagger animation still plays.
- **Done when**: diagnostics clear, build shows the bundle drop, and all three animations are visually unchanged.
