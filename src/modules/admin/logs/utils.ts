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
