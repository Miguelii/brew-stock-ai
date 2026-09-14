import { describe, it, expect } from 'vitest'
import { isAnalysisComplete } from '@/_bff/modules/analysis/helpers/is-analysis-complete.helper'

const BODY = '<h2>Flutter Entertainment</h2><p>Revenue grew <strong>16.6%</strong>.</p>'
const THESIS = '<h3>Investment Thesis Summary</h3><p>Growth is real, profits are not yet.</p>'

describe('isAnalysisComplete', () => {
    it('accepts an analysis that ends with a filled Investment Thesis Summary', () => {
        expect(isAnalysisComplete(BODY + THESIS, 'stop')).toBe(true)
    })

    it('accepts trailing whitespace and a list as the last block', () => {
        const thesis = '<h3>Investment Thesis Summary</h3><ul><li>Hold.</li></ul>\n  '
        expect(isAnalysisComplete(BODY + thesis, 'stop')).toBe(true)
    })

    it('rejects an analysis without the Investment Thesis Summary section', () => {
        expect(isAnalysisComplete(BODY, 'stop')).toBe(false)
    })

    it('rejects text cut mid-sentence', () => {
        const cut =
            '<h3>Valuation Context</h3><p>FCF yield is negative, so neither of the two classic valuation anchors currently supports a'
        expect(isAnalysisComplete(BODY + cut, 'stop')).toBe(false)
    })

    it('rejects a thesis section that is cut before closing its paragraph', () => {
        const cut = '<h3>Investment Thesis Summary</h3><p>Growth is real, but'
        expect(isAnalysisComplete(BODY + cut, 'stop')).toBe(false)
    })

    it('rejects an empty thesis section', () => {
        expect(isAnalysisComplete(`${BODY}<h3>Investment Thesis Summary</h3>`, 'stop')).toBe(false)
    })

    it('rejects output that hit the token limit', () => {
        expect(isAnalysisComplete(BODY + THESIS, 'length')).toBe(false)
    })

    it('rejects an empty analysis', () => {
        expect(isAnalysisComplete('', 'stop')).toBe(false)
    })
})
