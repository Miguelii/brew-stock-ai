/**
 * Format an integer count with US-locale thousands separators (e.g. `12345 → "12,345"`).
 *
 * @param n - The count to format.
 * @returns The localised count string, or `"N/A"` when nullish.
 */
export const fmtCount = (n: number | null | undefined): string =>
    n == null ? 'N/A' : n.toLocaleString('en-US')
