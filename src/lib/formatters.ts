/**
 * Format a large number as an abbreviated USD amount (T/B/M suffixes), preserving sign.
 *
 * @param n - The value to format.
 * @returns A string like `"$2.50T"`, `"-$1.20B"`, `"$500.00M"`, or `"N/A"` when nullish.
 */
export function fmtLarge(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const abs = Math.abs(n)
    const sign = n < 0 ? '-' : ''
    if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`
    return `${sign}$${abs.toFixed(2)}`
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
 * Format an already-percentage number (e.g. `5.3 → "5.3%"`). Distinct from
 * {@link fmtPct}, which expects a ratio and multiplies small values by 100.
 *
 * @param n - The already-percentage value to format.
 * @returns The formatted percentage to one decimal, or `"N/A"` when nullish.
 */
export const pct1 = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n.toFixed(1)}%`

/**
 * Format a date as an ISO calendar day (`YYYY-MM-DD`).
 *
 * @param d - The date to format.
 * @returns The ISO day string, or `null` when the date is absent.
 */
export const toIso = (d: Date | null | undefined): string | null =>
    d ? new Date(d).toISOString().split('T')[0] : null

/**
 * Format a multiple with a trailing `x` (e.g. `12.5 → "12.5x"`).
 *
 * @param n - The multiple to format.
 * @returns The formatted multiple to one decimal, or `"N/A"` when nullish.
 */
export function fmtX(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    return `${n.toFixed(1)}x`
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
 * Format a minor-unit amount (e.g. cents) as a localised currency string.
 *
 * @param amount - The amount in the currency's minor unit (divided by 100 internally).
 * @param currency - The ISO 4217 currency code (case-insensitive).
 * @returns The localised currency string (e.g. `"$12.34"`).
 */
export function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100)
}

/**
 * Normalise an ISO report timestamp into a compact `YYYY-MM-DD HH:mm` display string.
 *
 * @param date - The ISO timestamp string.
 * @returns The date and time with the `T` separator replaced by a space.
 */
export const parseReportDate = (date: string) => {
    return date.slice(0, 16).replace('T', ' ')
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    card: 'Card',
    multibanco: 'Multibanco',
    sepa_debit: 'SEPA Debit',
    amazon_pay: 'Amazon Pay',
    ideal: 'iDEAL',
    bancontact: 'Bancontact',
    klarna: 'Klarna',
    link: 'Link',
}

/**
 * Map a payment-method key to its human-friendly label.
 *
 * @param method - The payment-method key (e.g. `"sepa_debit"`), possibly undefined.
 * @returns The display label, the raw key when unknown, or `"—"` when absent.
 */
export function formatPaymentMethod(method: string | undefined): string {
    if (!method) return '—'
    return PAYMENT_METHOD_LABELS[method] ?? method
}

/**
 * Format an epoch-ms timestamp as a short month label for chart axes (en-GB).
 *
 * @param ms - The timestamp in milliseconds since the epoch.
 * @returns The abbreviated month name (e.g. `"Jan"`).
 */
export const formatXAxis = (ms: number) =>
    new Date(ms).toLocaleDateString('en-GB', { month: 'short' })
