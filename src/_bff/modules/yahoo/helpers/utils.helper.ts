export const NEWS_SUMMARY_MAX_CHARS = 200

/**
 * Format an already-percentage number (e.g. `5.3 → "5.3%"`) to one decimal.
 *
 * @param n - The already-percentage value to format.
 * @returns The formatted percentage to one decimal, or `"N/A"` when nullish.
 */
export const pct1 = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n.toFixed(1)}%`
