import { describe, it, expect } from 'vitest'
import { safeReturnTo } from '@/lib/utils'

describe('safeReturnTo', () => {
    it('keeps a same-site path and its query', () => {
        expect(safeReturnTo('/analysis?ticker=TSLA&type=STOCK_ANALYSIS')).toBe(
            '/analysis?ticker=TSLA&type=STOCK_ANALYSIS'
        )
        expect(safeReturnTo('/analysis/apple')).toBe('/analysis/apple')
    })

    it('falls back when there is nothing to return to', () => {
        expect(safeReturnTo(undefined)).toBe('/analysis')
        expect(safeReturnTo(null)).toBe('/analysis')
        expect(safeReturnTo('')).toBe('/analysis')
    })

    it('rejects absolute URLs pointing off-site', () => {
        expect(safeReturnTo('https://evil.com')).toBe('/analysis')
        expect(safeReturnTo('http://evil.com/path')).toBe('/analysis')
        expect(safeReturnTo('javascript:alert(1)')).toBe('/analysis')
    })

    it('rejects protocol-relative paths, which browsers resolve off-site', () => {
        expect(safeReturnTo('//evil.com')).toBe('/analysis')
        expect(safeReturnTo('/\\evil.com')).toBe('/analysis')
    })

    it('honours an explicit fallback', () => {
        expect(safeReturnTo('//evil.com', '/reports')).toBe('/reports')
    })
})
