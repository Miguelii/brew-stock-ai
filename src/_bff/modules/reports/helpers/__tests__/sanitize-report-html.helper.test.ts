import { describe, it, expect } from 'vitest'
import { sanitizeReportHtml } from '@/_bff/modules/reports/helpers/sanitize-report-html.helper'

describe('sanitizeReportHtml', () => {
    it('returns empty string for nullish input', () => {
        expect(sanitizeReportHtml(null)).toBe('')
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(sanitizeReportHtml(undefined)).toBe('')
        expect(sanitizeReportHtml('')).toBe('')
    })

    it('keeps the tags the AI output uses', () => {
        const html =
            '<h2>Thesis</h2><p>Apple is <strong>strong</strong>.</p><ul><li>Growth</li></ul><table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'
        expect(sanitizeReportHtml(html)).toBe(html)
    })

    it('strips script tags', () => {
        const out = sanitizeReportHtml('<p>ok</p><script>document.title="x"</script>')
        expect(out).toBe('<p>ok</p>')
    })

    it('strips event handler attributes', () => {
        const out = sanitizeReportHtml('<p onclick="alert(1)">ok</p><img src=x onerror=alert(1)>')
        expect(out).not.toContain('onclick')
        expect(out).not.toContain('onerror')
        expect(out).not.toContain('<img')
        expect(out).toContain('<p>ok</p>')
    })

    it('strips javascript: links but keeps https links', () => {
        const out = sanitizeReportHtml(
            '<a href="javascript:alert(1)">bad</a><a href="https://example.com">good</a>'
        )
        expect(out).not.toContain('javascript:')
        expect(out).toContain('href="https://example.com"')
    })

    it('strips style attributes and iframes', () => {
        const out = sanitizeReportHtml(
            '<div style="background:url(javascript:1)">x</div><iframe src="https://evil.example"></iframe>'
        )
        expect(out).not.toContain('style=')
        expect(out).not.toContain('<iframe')
        expect(out).toContain('<div>x</div>')
    })

    it('keeps class attributes', () => {
        const out = sanitizeReportHtml('<p class="analysis-note">ok</p>')
        expect(out).toBe('<p class="analysis-note">ok</p>')
    })
})
