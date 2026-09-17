import { describe, it, expect } from 'vitest'
import { categoryAnchor } from '@/modules/report-view/report-financials-card/utils'

describe('categoryAnchor', () => {
    it('prefixes the category id', () => {
        expect(categoryAnchor('growth')).toBe('key-metrics-growth')
    })
})
