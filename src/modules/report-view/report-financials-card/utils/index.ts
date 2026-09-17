import { fmtPct } from '@/_bff/core/utils/formatters.utils'
import { fmtCount } from '@/lib/formatters'

export const categoryAnchor = (id: string) => `key-metrics-${id}`

/** Ratio as a signed percentage (e.g. `0.12 → "+12.0%"`), or `"N/A"` when nullish. */
export const fmtSignedPct = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n > 0 ? '+' : ''}${fmtPct(n)}`

/** Share count with an explicit sign (e.g. `120000 → "+120,000"`), or `"N/A"` when nullish. */
export const fmtSignedCount = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n > 0 ? '+' : ''}${fmtCount(n)}`
