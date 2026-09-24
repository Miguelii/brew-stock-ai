'use client'

import { Parallax } from '@/components/ui/motion/parallax'
import { Clouds } from '@/components/scene/clouds'
import { Hills } from '@/components/scene/hills'
import { Sun } from '@/components/scene/sun'

/**
 * Layered decorative stage behind the hero. Every layer drifts at its own speed.
 * The copy occupies the left half of the first viewport, so the loose elements sit
 * high or to the right of it and the horizon closes the section.
 */
export function HeroScene() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <Parallax speed={9} className="absolute top-[14vh] left-0 w-full opacity-75">
                <Clouds />
            </Parallax>

            <Parallax
                speed={6}
                className="absolute top-[11vh] right-[6vw] w-[clamp(110px,15vw,220px)]"
            >
                <Sun />
            </Parallax>

            <Parallax
                speed={12}
                className="absolute inset-x-0 bottom-[-6%] h-[clamp(190px,30vh,340px)]"
            >
                <Hills variant="back" fill="var(--navy-deep)" className="h-50" />
            </Parallax>

            <Parallax
                speed={16}
                className="absolute inset-x-0 bottom-[-8%] h-[clamp(130px,21vh,240px)]"
            >
                <Hills variant="front" fill="var(--blue)" className="h-54" />
            </Parallax>
        </div>
    )
}
