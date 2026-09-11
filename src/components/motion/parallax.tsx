'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
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
 */
export function Parallax({ children, className, speed = 10 }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const reduced = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 1], [`${-speed / 2}%`, `${speed}%`])

    if (reduced) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        )
    }

    return (
        <div ref={ref} className={className}>
            <motion.div className="h-full" style={{ y }}>
                {children}
            </motion.div>
        </div>
    )
}
