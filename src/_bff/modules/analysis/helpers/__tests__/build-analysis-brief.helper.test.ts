import { describe, it, expect } from 'vitest'
import { buildAnalysisBrief } from '@/_bff/modules/analysis/helpers/build-analysis-brief.helper'
import {
    AnalystMethodPrompt,
    JsonOutputFormatPrompt,
    MarkdownOutputFormatPrompt,
} from '@/_bff/modules/analysis/prompts/system.prompt'

const BASE = {
    stockSymbol: 'AAPL',
    promptTemplate: 'Analyze the stock: ##TICKER##.',
    context: '\n\n## Current Market Context\nsome data',
    resolvedTicker: 'AAPL',
    isFresh: true,
    retrievedAt: new Date('2026-11-05T10:00:00.000Z'),
}

describe('buildAnalysisBrief', () => {
    it('includes the method, the Markdown contract and not the app JSON contract', () => {
        const brief = buildAnalysisBrief(BASE)

        expect(brief).toContain(AnalystMethodPrompt.trim())
        expect(brief).toContain(MarkdownOutputFormatPrompt.trim())
        expect(brief).not.toContain(JsonOutputFormatPrompt.trim())
    })

    it('fills the ticker in the request and appends the market context', () => {
        const brief = buildAnalysisBrief(BASE)

        expect(brief).toContain('## Request\n\nAnalyze the stock: AAPL.')
        expect(brief).not.toContain('##TICKER##')
        expect(brief.endsWith('## Current Market Context\nsome data')).toBe(true)
    })

    it('records the retrieval time and adds no warning for fresh data', () => {
        const brief = buildAnalysisBrief(BASE)

        expect(brief).toContain('Data retrieved at 2026-11-05T10:00:00.000Z')
        expect(brief).not.toContain('stored snapshot')
        expect(brief).not.toContain('No market data')
    })

    it('mentions the resolved ticker when it differs from the symbol', () => {
        const brief = buildAnalysisBrief({ ...BASE, stockSymbol: 'APPLE' })

        expect(brief).toContain('"APPLE" was resolved to the ticker AAPL')
    })

    it('warns when the Yahoo data came from the stored snapshot', () => {
        const brief = buildAnalysisBrief({ ...BASE, isFresh: false })

        expect(brief).toContain('stored snapshot')
    })

    it('never names the data providers', () => {
        const brief = buildAnalysisBrief({ ...BASE, stockSymbol: 'APPLE', isFresh: false })

        expect(brief).not.toMatch(/yahoo|finnhub/iu)
    })

    it('warns when there is no market data at all', () => {
        const brief = buildAnalysisBrief({
            ...BASE,
            context: '',
            resolvedTicker: null,
            isFresh: false,
        })

        expect(brief).toContain('No market data was available for AAPL')
        expect(brief).not.toContain('stored snapshot')
        expect(brief.endsWith('rather than live data.')).toBe(true)
    })
})
