'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

/**
 * App-wide motion setup.
 *
 * LazyMotion ships only the `domAnimation` feature set (animations, variants, exit,
 * hover/tap/focus and in-view) instead of the full bundle. Every animated element
 * must use `m.*` (from `motion/react`, or `motion/react-m` in Server Components):
 * `strict` makes a stray `motion.*` throw, so the full bundle can't sneak back in.
 * Switch to `domMax` if a component ever needs `layout` animations or `drag`.
 *
 * MotionConfig teaches motion to honour the user's Reduced Motion setting on its own.
 * This is the hydration-safe way to do it: motion resolves the preference when a
 * visual element mounts, never while rendering, so the tree is identical on the
 * server and the client. Reading the media query in a component instead (via
 * useReducedMotion) returns null on the server and the real value on the client's
 * first render, which is a hydration mismatch for anyone who has the setting on.
 *
 * It covers `animate` / `whileInView` targets only: positional values jump straight
 * to their end state instead of tweening. Scroll-scrubbed MotionValues bound through
 * `style` are not affected, so those components tag their animated node and the
 * reduced-motion block in globals.css drops the transform.
 */
export function MotionProvider({ children }: Props) {
    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LazyMotion>
    )
}
