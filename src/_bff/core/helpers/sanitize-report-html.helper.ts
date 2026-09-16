import sanitizeHtml from 'sanitize-html'

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: [
        'h1',
        'h2',
        'h3',
        'h4',
        'p',
        'ul',
        'ol',
        'li',
        'strong',
        'em',
        'b',
        'i',
        'a',
        'br',
        'hr',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'blockquote',
        'code',
        'pre',
        'span',
        'div',
    ],
    allowedAttributes: {
        a: ['href'],
        '*': ['class'],
    },
    allowedSchemes: ['https'],
}

/**
 * Sanitizes AI-generated report HTML with a strict allowlist before it is
 * interpolated into the PDF document or rendered via `dangerouslySetInnerHTML`.
 */
export function sanitizeReportHtml(html: string | null | undefined): string {
    if (!html) return ''
    return sanitizeHtml(html, SANITIZE_OPTIONS)
}
