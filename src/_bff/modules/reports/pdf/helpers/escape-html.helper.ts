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
