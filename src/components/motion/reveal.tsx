'use client'

import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE } from '@/components/motion/constants'

type Props = {
    children: ReactNode
    className?: string
    /** Seconds to wait before settling. Use small index-based steps for lists. */
    delay?: number
    /** Distance in pixels the element travels upward. */
    distance?: number
}

/**
 * Translate-only scroll reveal: the element is always visible and merely settles
 * into place. Deliberately has no opacity fade, which is what separates this from
 * the generic "fade up" every landing page ships with.
 *
 * Reduced motion is handled by MotionProvider, which makes the travel land instantly
 * instead of tweening. Branching on the preference here would render a different
 * element on the server than on the client.
 */
export function Reveal({ children, className, delay = 0, distance = 40 }: Props) {
    return (
        <m.div
            data-motion-transform
            className={className}
            initial={{ y: distance }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay }}
        >
            {children}
        </m.div>
    )
}
