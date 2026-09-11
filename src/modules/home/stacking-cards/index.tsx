'use client'

import { useRef } from 'react'
import { useScroll } from 'motion/react'
import { StackCard } from '@/modules/home/stacking-cards/card'
import { ANALYSIS_TYPES } from '@/lib/analysis-content'

export function StackingCards() {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    })

    // One tree at every breakpoint: the deck layout is switched on in CSS at lg and
    // switched back off by the reduced-motion rules in globals.css, so nothing here
    // depends on a media query read during render.
    return (
        <div ref={ref} data-scroll-scene className="relative lg:h-[460svh]">
            <div
                data-scroll-sticky
                className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:justify-center lg:[perspective:1200px]"
            >
                <div
                    data-stack-deck
                    className="flex flex-col gap-5 lg:relative lg:block lg:h-[500px] lg:w-full lg:max-w-[640px]"
                >
                    {ANALYSIS_TYPES.map((type, i) => (
                        <StackCard
                            key={type.title}
                            {...type}
                            index={i}
                            total={ANALYSIS_TYPES.length}
                            progress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
