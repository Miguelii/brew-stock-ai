import { formatDate } from '@/_bff/core/utils/formatters.utils'

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export function formatNewsAge(ts: number, nowMs = Date.now()): string {
    const elapsed = Math.max(0, nowMs - ts * 1000)

    if (elapsed < HOUR_MS) return `${Math.max(1, Math.floor(elapsed / MINUTE_MS))}m ago`
    if (elapsed < DAY_MS) return `${Math.floor(elapsed / HOUR_MS)}h ago`
    if (elapsed < 7 * DAY_MS) return `${Math.floor(elapsed / DAY_MS)}d ago`

    return formatDate(ts)
}

export function toIsoDateTime(ts: number): string {
    return new Date(ts * 1000).toISOString()
}
