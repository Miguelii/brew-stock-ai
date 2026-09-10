import { cn } from '@/lib/utils'

type Props = {
    className?: string
    fill: string
    variant?: 'back' | 'front'
}

// Both profiles climb to the right so the horizon reads as a price chart.
const BACK_PATH =
    'M0 250 180 210 360 242 540 172 720 204 900 134 1080 166 1260 102 1440 132V340H0V250Z'

const FRONT_PATH =
    'M0 182 160 152 320 178 480 122 640 152 800 98 960 132 1120 72 1280 108 1440 64V240H0V182Z'

/**
 * The hero horizon, drawn as an area-chart profile rather than a smooth hill.
 * preserveAspectRatio="none" so it always spans the full width.
 */
export function Hills({ className, fill, variant = 'back' }: Props) {
    const isBack = variant === 'back'

    return (
        <svg
            viewBox={isBack ? '0 0 1440 340' : '0 0 1440 240'}
            preserveAspectRatio="none"
            aria-hidden="true"
            className={cn('block size-full', className)}
        >
            <path d={isBack ? BACK_PATH : FRONT_PATH} fill={fill} />
        </svg>
    )
}
