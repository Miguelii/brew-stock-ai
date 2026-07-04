/**
 * Format an epoch-ms timestamp as a short month label for chart axes (en-GB).
 *
 * @param ms - The timestamp in milliseconds since the epoch.
 * @returns The abbreviated month name (e.g. `"Jan"`).
 */
export const formatXAxis = (ms: number) =>
    new Date(ms).toLocaleDateString('en-GB', { month: 'short' })
