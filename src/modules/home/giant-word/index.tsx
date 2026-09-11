'use client'

import { motion } from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import { EASE } from '@/components/motion/constants'
import { cn } from '@/lib/utils'

type Props = {
    word: string
    className?: string
}

/**
 * A single oversized word, revealed character by character. It renders at the
 * .display-giant clamp and is only scaled down when it would overflow, so short
 * words stay at a sane size instead of ballooning to fill the line.
 *
 * Reduced motion is handled by MotionProvider, which drops each character into place
 * instantly instead of rolling it up.
 */
export function GiantWord({ word, className }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const wordRef = useRef<HTMLSpanElement>(null)

    const fit = useCallback(() => {
        const container = containerRef.current
        const target = wordRef.current
        if (!container || !target) return

        const available = container.clientWidth
        if (!available) return

        // Measure at full size, then shrink only if the word overruns the line. The
        // measured span is inline-block so its width tracks the glyphs: a block
        // element would always report at least the container width.
        target.style.setProperty('--giant-scale', '1')
        const natural = target.getBoundingClientRect().width
        if (!natural || natural <= available) return

        target.style.setProperty('--giant-scale', String(available / natural))
    }, [])

    useEffect(() => {
        fit()

        // Web fonts land after first paint and change the natural width.
        void document.fonts?.ready.then(fit)

        const observer = new ResizeObserver(fit)
        if (containerRef.current) observer.observe(containerRef.current)
        window.addEventListener('resize', fit)

        return () => {
            observer.disconnect()
            window.removeEventListener('resize', fit)
        }
    }, [fit])

    const characters = Array.from(word)

    return (
        <div ref={containerRef} className={cn('w-full', className)}>
            {/* The mask is the whole line, so rotating characters are never clipped. */}
            <span className="block overflow-hidden py-[0.06em]" style={{ marginBlock: '-0.06em' }}>
                <span
                    ref={wordRef}
                    className="display display-giant inline-block whitespace-nowrap"
                >
                    {characters.map((character, i) => (
                        <motion.span
                            key={`${character}-${i}`}
                            data-motion-transform
                            className="inline-block"
                            initial={{ y: '100%', rotate: i % 2 ? 8 : -8 }}
                            whileInView={{ y: '0%', rotate: 0 }}
                            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                            transition={{ duration: 0.8, ease: EASE, delay: i * 0.04 }}
                        >
                            {character}
                        </motion.span>
                    ))}
                </span>
            </span>
        </div>
    )
}
