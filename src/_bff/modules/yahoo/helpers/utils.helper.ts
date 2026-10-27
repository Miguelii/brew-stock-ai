export const NEWS_SUMMARY_MAX_CHARS = 200

/**
 * Format an already-percentage number (e.g. `5.3 → "5.3%"`) to one decimal.
 *
 * @param n - The already-percentage value to format.
 * @returns The formatted percentage to one decimal, or `"N/A"` when nullish.
 */
export const pct1 = (n: number | null | undefined): string =>
    n == null ? 'N/A' : `${n.toFixed(1)}%`

export function hasStockData<T extends object>(value: T | null | undefined): value is T {
    if (value === null || value === undefined) return false
    if (Array.isArray(value)) return value.length > 0
    return Object.values(value).some((v) => v !== null && v !== undefined)
}

/** True when at least one of the values is present, used to skip all-empty prompt lines. */
export const hasAny = (...values: (number | string | null | undefined)[]) =>
    values.some((v) => v != null)
