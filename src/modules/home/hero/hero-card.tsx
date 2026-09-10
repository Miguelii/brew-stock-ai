'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type Props = {
    children: ReactNode
}

/**
 * The hero card tips back and shrinks as the page scrolls past it, which hands the
 * next section the reader's attention instead of just scrolling away.
 */
export function HeroCard({ children }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const reduced = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start center', 'end start'],
    })

    const rotateX = useTransform(scrollYProgress, [0, 1], [0, 18])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
    const y = useTransform(scrollYProgress, [0, 1], [0, -24])

    return (
        <div ref={ref} className="w-full max-w-[440px] [perspective:1200px]">
            <motion.div
                style={reduced ? undefined : { rotateX, scale, y, transformStyle: 'preserve-3d' }}
                className="surface flex min-h-[300px] flex-col gap-6 bg-tangerine p-7"
            >
                {children}
            </motion.div>
        </div>
    )
}
