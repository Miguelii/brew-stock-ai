export const RANGES = ['1M', '3M', '6M', '1Y'] as const

export const RANGE_DAYS: Record<Range, number> = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }

export type Range = (typeof RANGES)[number]
