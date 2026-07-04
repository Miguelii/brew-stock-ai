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

export function signStyle(n: number | null | undefined): string {
    if (n == null) return 'color:#262626;'
    return n >= 0 ? 'color:#16a34a;' : 'color:#ef4444;'
}

export const SCORE_ROW_DEFS = [
    { label: 'Innovation', key: 'innovativeness' },
    { label: 'Workforce Growth', key: 'hiring' },
    { label: 'Sustainability', key: 'sustainability' },
] as const
