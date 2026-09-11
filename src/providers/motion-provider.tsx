'use client'

import { MotionConfig } from 'motion/react'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

/**
 * Teaches motion to honour the user's Reduced Motion setting on its own.
 *
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
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
