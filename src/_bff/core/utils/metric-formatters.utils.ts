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
