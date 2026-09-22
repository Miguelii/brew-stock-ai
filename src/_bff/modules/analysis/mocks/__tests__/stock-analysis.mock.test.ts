import { describe, it, expect } from 'vitest'
import { stockAnalysisSchema } from '@/_bff/modules/analysis/constants'
import { isAnalysisComplete } from '@/_bff/modules/analysis/helpers/is-analysis-complete.helper'
import stockAnalysisMock from '@/_bff/modules/analysis/mocks/stock-analysis.mock.json'

describe('stock-analysis mock', () => {
    it('matches the model output schema', () => {
        expect(stockAnalysisSchema.safeParse(stockAnalysisMock).success).toBe(true)
    })

    it('passes the incomplete-output guard', () => {
        expect(isAnalysisComplete(stockAnalysisMock.analysis, 'stop')).toBe(true)
    })

    it('never contains straight double quotes, like the model output', () => {
        expect(stockAnalysisMock.analysis).not.toContain('"')
    })
})
