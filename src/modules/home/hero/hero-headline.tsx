'use client'

import { motion, useReducedMotion } from 'motion/react'
import { EASE } from '@/components/motion/constants'
import { cn } from '@/lib/utils'

type Props = {
    lines: readonly string[]
    className?: string
}

/**
 * Line-masked headline: each line sits in an overflow-hidden strip and slides up
 * from below on load, staggered. No fade, so the type never looks washed out.
 */
export function HeroHeadline({ lines, className }: Props) {
    const reduced = useReducedMotion()

    return (
        <h1 className={cn('display display-hero', className)}>
            {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                    <motion.span
                        className="block"
                        initial={reduced ? false : { y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 1.1, ease: EASE, delay: 0.25 + i * 0.12 }}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </h1>
    )
}
