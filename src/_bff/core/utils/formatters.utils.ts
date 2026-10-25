// Number and date formatters used by the frontend and _bff (report page, PDF, analysis context).

/**
 * Format a large number as an abbreviated USD amount (T/B/M suffixes), preserving sign.
 *
 * @param n - The value to format.
 * @returns A string like `"$2.50T"`, `"-$1.20B"`, `"$500.00M"`, or `"N/A"` when nullish.
 */
export function fmtLarge(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const formatted = fmtLargeCount(n)

    return formatted.startsWith('-') ? `-$${formatted.slice(1)}` : `$${formatted}`
}

/**
 * Abbreviate a large count with T/B/M suffixes and no currency symbol, for things that are
 * not money (e.g. `14594180000 → "14.59B"` shares).
 *
 * @param n - The count to format.
 * @returns The abbreviated count, or `"N/A"` when nullish.
 */
export function fmtLargeCount(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const abs = Math.abs(n)
    const sign = n < 0 ? '-' : ''
    if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(2)}T`
    if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`
    return `${sign}${abs.toFixed(2)}`
}

/**
 * Format a ratio as a percentage. Values with an absolute magnitude below 10 are
 * treated as ratios and multiplied by 100 (e.g. `0.12 → "12.0%"`); larger values
 * are assumed to already be percentages and passed through (e.g. `45.6 → "45.6%"`).
 *
 * @param n - The ratio (or already-percentage) value to format.
 * @returns The formatted percentage, or `"N/A"` when nullish.
 */
export function fmtPct(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const val = Math.abs(n) < 10 ? n * 100 : n
    return `${val.toFixed(1)}%`
}

/**
 * Format an already-percentage number with an explicit sign to one decimal
 * (e.g. `5.3 → "+5.3%"`, `-2.1 → "-2.1%"`).
 *
 * @param n - The already-percentage value to format.
 * @returns The signed percentage, or `"N/A"` when nullish.
 */
export const signedPct1 = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`

/**
 * Format a date as an ISO calendar day (`YYYY-MM-DD`).
 *
 * @param d - The date to format.
 * @returns The ISO day string, or `null` when the date is absent.
 */
export const toIso = (d: Date | null | undefined): string | null => {
    if (!d) return null
    const date = new Date(d)
    // toISOString() throws a RangeError on an invalid date
    return Number.isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
}

/**
 * Format a plain number to a fixed number of decimals.
 *
 * @param n - The value to format.
 * @param decimals - Number of decimal places (defaults to 2).
 * @returns The fixed-decimal string, or `"N/A"` when nullish.
 */
export function fmtNum(n: number | null | undefined, decimals = 2): string {
    if (n == null) return 'N/A'
    return n.toFixed(decimals)
}

/**
 * Format a number as a USD price with two decimals (e.g. `150.25 → "$150.25"`).
 *
 * @param n - The price to format.
 * @returns The formatted price, or `"N/A"` when nullish.
 */
export function fmtPrice(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    return `$${n.toFixed(2)}`
}

/**
 * Format a date (ISO string or epoch ms) as a US-locale long/short date.
 *
 * @param d - The date as an ISO string or millisecond timestamp.
 * @param month - Whether to render the month in `'long'` (default) or `'short'` form.
 * @returns The localised date string (e.g. `"January 5, 2026"`).
 */
export const fmtDate = (d: string | number, month: 'long' | 'short' = 'long') =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' })

/**
 * Format a Unix timestamp (in seconds) as a short US-locale date.
 *
 * @param ts - The timestamp in seconds since the epoch.
 * @returns The localised date string (e.g. `"Jan 5, 2026"`).
 */
export function formatDate(ts: number): string {
    return new Date(ts * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

/**
 * Format an integer count with US-locale thousands separators (e.g. `12345 → "12,345"`).
 *
 * @param n - The count to format.
 * @returns The localised count string, or `"N/A"` when nullish.
 */
export const fmtCount = (n: number | null | undefined): string =>
    n == null ? 'N/A' : n.toLocaleString('en-US')

/** Ratio as a signed percentage (e.g. `0.12 → "+12.0%"`), or `"N/A"` when nullish. */
export const fmtSignedPct = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n > 0 ? '+' : ''}${fmtPct(n)}`

/** Count with an explicit sign (e.g. `120000 → "+120,000"`), or `"N/A"` when nullish. */
export const fmtSignedCount = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n > 0 ? '+' : ''}${fmtCount(n)}`

/** Whole-number gap with an explicit plus sign (e.g. `45 → "+45"`, `-33 → "-33"`). */
export const fmtDelta = (delta: number): string => (delta > 0 ? `+${delta}` : `${delta}`)

// Cuts text to maxChars and appends "…" only when something was cut
export function truncateText(text: string, maxChars: number): string {
    return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text
}
