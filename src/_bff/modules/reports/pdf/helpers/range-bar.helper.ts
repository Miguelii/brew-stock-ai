import type { RangeBarInput, RangeBarView } from '@/_bff/modules/reports/pdf/types'

const clampPct = (value: number): number => Math.min(Math.max(value, 0), 100)

/** Position of `current` inside the `low`-`high` range; no data when a bound is missing or the range is empty. */
export function getRangeBarView({ low, high, current }: RangeBarInput): RangeBarView {
    if (low == null || high == null || current == null || high <= low) return { hasData: false }

    return { hasData: true, currentPct: clampPct(((current - low) / (high - low)) * 100) }
}
