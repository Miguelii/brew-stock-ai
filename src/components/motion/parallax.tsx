'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type Props = {
    children: ReactNode
    className?: string
    /** Percentage of its own height the layer drifts across the viewport pass. */
    speed?: number
}

/**
 * Scroll-scrubbed vertical drift. The ref sits on an untransformed wrapper so the
 * measurement never feeds back into the transform it produces.
 *
 * Always renders the same two nodes. The drift is scrubbed by scroll rather than
 * animated, so MotionProvider does not cover it: reduced motion is honoured by the
 * [data-motion-transform] rule in globals.css, not by branching the tree during
 * render, which would disagree with the server for anyone who has the setting on.
 */
export function Parallax({ children, className, speed = 10 }: Props) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 1], [`${-speed / 2}%`, `${speed}%`])

    return (
        <div ref={ref} className={className}>
            <motion.div data-motion-transform className="h-full" style={{ y }}>
                {children}
            </motion.div>
        </div>
    )
}
