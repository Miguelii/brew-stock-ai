import type { Variants } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

export const STATS = [
    { label: '999+ Reports Generated' },
    { label: '5 Analysis Types' },
    { label: '< 120s Delivery' },
] as const

export const CONTAINER_VARIANTS: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
}

export const ITEM_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE },
    },
}

export const TICKERS = ['NVDA', 'AAPL', 'ASML', 'GOOGL'] as const

export const TYPE_INTERVAL_MS = 160

export const GENERATING_MS = 1800

export const READY_MS = 1600
