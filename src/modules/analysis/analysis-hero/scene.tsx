'use client'

import { Parallax } from '@/components/motion/parallax'
import { Hills } from '@/components/scene/hills'

/**
 * Decorative stage behind the analysis hero. Deliberately lighter than the homepage
 * one: the form card sits in this band, so only the horizon runs behind it. Loose
 * elements up top would just peek out from behind the card.
 */
export function AnalysisHeroScene() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <Parallax
                speed={10}
                className="absolute inset-x-0 bottom-[-6%] h-[clamp(150px,24vh,270px)]"
            >
                <Hills variant="back" fill="var(--navy-deep)" className="h-full" />
            </Parallax>

            <Parallax
                speed={14}
                className="absolute inset-x-0 bottom-[-8%] h-[clamp(110px,17vh,200px)]"
            >
                <Hills variant="front" fill="var(--blue)" className="h-full" />
            </Parallax>
        </div>
    )
}
