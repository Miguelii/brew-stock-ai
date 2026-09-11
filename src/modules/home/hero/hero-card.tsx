'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type Props = {
    children: ReactNode
}

/**
 * The hero card tips back and shrinks as the page scrolls past it, which hands the
 * next section the reader's attention instead of just scrolling away.
 *
 * The tilt is scrubbed by scroll rather than animated, so MotionProvider does not
 * cover it: the transform is dropped by the [data-motion-transform] rule in
 * globals.css instead. Branching on the preference here would render a different
 * style attribute on the server than on the client.
 */
export function HeroCard({ children }: Props) {
    const ref = useRef<HTMLDivElement>(null)

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
                data-motion-transform
                style={{ rotateX, scale, y, transformStyle: 'preserve-3d' }}
                className="surface flex min-h-[300px] flex-col gap-6 bg-tangerine p-7"
            >
                {children}
            </motion.div>
        </div>
    )
}
