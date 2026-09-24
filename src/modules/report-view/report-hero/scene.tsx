'use client'

import { Parallax } from '@/components/ui/motion/parallax'
import { Hills } from '@/components/scene/hills'

/**
 * Horizon behind the report hero. Nothing else: this is a reading page and the
 * band already carries the ticker, the badge and the export button.
 */
export function ReportHeroScene() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <Parallax
                speed={10}
                className="absolute inset-x-0 bottom-[-6%] h-[clamp(110px,16vh,190px)]"
            >
                <Hills variant="back" fill="rgba(255, 255, 255, 0.10)" className="h-full" />
            </Parallax>

            <Parallax
                speed={14}
                className="absolute inset-x-0 bottom-[-8%] h-[clamp(80px,11vh,140px)]"
            >
                <Hills variant="front" fill="rgba(255, 255, 255, 0.2)" className="h-full" />
            </Parallax>
        </div>
    )
}
