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
 * Format an already-percentage number with an explicit sign to one decimal
 * (e.g. `5.3 → "+5.3%"`, `-2.1 → "-2.1%"`).
 *
 * @param n - The already-percentage value to format.
 * @returns The signed percentage, or `"N/A"` when nullish.
 */
export const signedPct1 = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`

/**
 * Format an integer count with US-locale thousands separators (e.g. `12345 → "12,345"`).
 *
 * @param n - The count to format.
 * @returns The localised count string, or `"N/A"` when nullish.
 */
export const fmtCount = (n: number | null | undefined): string =>
    n == null ? 'N/A' : n.toLocaleString('en-US')

/**
 * Format a date as an ISO calendar day (`YYYY-MM-DD`).
 *
 * @param d - The date to format.
 * @returns The ISO day string, or `null` when the date is absent.
 */
export const toIso = (d: Date | null | undefined): string | null =>
    d ? new Date(d).toISOString().split('T')[0] : null

/**
 * Normalise an ISO timestamp into a compact `YYYY-MM-DD HH:mm:ss` string with
 * seconds precision — handy for scanning logs.
 *
 * @param iso - The ISO timestamp string.
 * @returns The date and time with the `T` separator replaced by a space, or `'—'` when absent.
 */
export const formatLogTimestamp = (iso: string | null | undefined): string =>
    iso ? iso.slice(0, 19).replace('T', ' ') : '—'

/**
 * Pretty-print an arbitrary value as indented JSON for display in a code block.
 *
 * @param value - The value to serialise.
 * @returns The 2-space-indented JSON string, or `'—'` when the value is nullish.
 */
export const formatJson = (value: unknown): string =>
    value == null ? '—' : JSON.stringify(value, null, 2)

const ESTIMATE_PERIOD_LABELS: Record<string, string> = {
    '0q': 'Current Quarter',
    '+1q': 'Next Quarter',
    '0y': 'Current Year',
    '+1y': 'Next Year',
}

/**
 * Map a Yahoo earnings-trend period code to a human-friendly label.
 *
 * @param period - The Yahoo period code (e.g. `"+1q"`, `"0y"`).
 * @returns The friendly label, or the raw code when unknown.
 */
export const fmtEstimatePeriod = (period: string): string =>
    ESTIMATE_PERIOD_LABELS[period] ?? period

/**
 * Escape `&`, `<`, `>`, `"` and `'` for safe interpolation into HTML.
 *
 * @param value - The raw string to escape.
 * @returns The escaped string, or `''` when nullish.
 */
export const escapeHtml = (value: string | null | undefined): string =>
    value == null
        ? ''
        : String(value)
              .replaceAll('&', '&amp;')
              .replaceAll('<', '&lt;')
              .replaceAll('>', '&gt;')
              .replaceAll('"', '&quot;')
              .replaceAll("'", '&#39;')

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
 * Format a debt-to-equity value as a multiple (e.g. `1.4x`). Yahoo often reports D/E as a
 * percentage (e.g. `141.3` meaning `1.4x`), so magnitudes above 10 are divided by 100.
 *
 * @param n - The raw debt-to-equity value.
 * @returns The formatted multiple, or `"N/A"` when nullish.
 */
export function fmtDebtEquity(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const ratio = Math.abs(n) > 10 ? n / 100 : n
    return `${ratio.toFixed(1)}x`
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
