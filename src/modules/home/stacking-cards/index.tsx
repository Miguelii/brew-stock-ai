'use client'

import { useRef } from 'react'
import { useReducedMotion, useScroll } from 'motion/react'
import { StackCard } from '@/modules/home/stacking-cards/card'
import { StaticCard } from '@/modules/home/stacking-cards/static-card'
import { ANALYSIS_TYPES } from '@/lib/analysis-content'

export function StackingCards() {
    const ref = useRef<HTMLDivElement>(null)
    const reduced = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end end'],
    })

    const staticStack = (
        <div className="flex flex-col gap-5">
            {ANALYSIS_TYPES.map((type, i) => (
                <StaticCard key={type.title} {...type} index={i} />
            ))}
        </div>
    )

    if (reduced) return staticStack

    return (
        <>
            <div className="lg:hidden">{staticStack}</div>

            <div ref={ref} data-scroll-scene className="relative hidden h-[460svh] lg:block">
                <div
                    data-scroll-sticky
                    className="sticky top-0 flex h-svh items-center justify-center [perspective:1200px]"
                >
                    <div className="relative h-[500px] w-full max-w-[640px]">
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
        </>
    )
}
