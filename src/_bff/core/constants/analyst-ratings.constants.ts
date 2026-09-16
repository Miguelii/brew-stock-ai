import type { AnalystRatings } from '@/types/ReportDTO'

export const ANALYST_RATING_SEGMENTS = [
    { key: 'strongBuy', label: 'Strong Buy' },
    { key: 'buy', label: 'Buy' },
    { key: 'hold', label: 'Hold' },
    { key: 'sell', label: 'Sell' },
    { key: 'strongSell', label: 'Strong Sell' },
] as const satisfies readonly { key: Exclude<keyof AnalystRatings, 'period'>; label: string }[]
