import { describe, it, expect } from 'vitest'
import {
    PROMPTS_MAP,
    PROMPT_COSTS_MAP,
    stockAnalysisSchema,
} from '@/backend/modules/analysis/constants'

describe('PROMPTS_MAP', () => {
    it('contains all expected prompt types', () => {
        expect(Object.keys(PROMPTS_MAP)).toHaveLength(5)
        expect(PROMPTS_MAP).toHaveProperty('STOCK_ANALYSIS')
        expect(PROMPTS_MAP).toHaveProperty('DEEP_FINANCIAL_BREAKDOWN')
        expect(PROMPTS_MAP).toHaveProperty('MOAT_ANALYSIS')
        expect(PROMPTS_MAP).toHaveProperty('RISK_ANALYSIS')
        expect(PROMPTS_MAP).toHaveProperty('GROWTH_POTENTIAL_ANALYSIS')
    })

    it('each prompt contains ##TICKER## placeholder', () => {
        for (const [key, prompt] of Object.entries(PROMPTS_MAP)) {
            expect(prompt, `${key} should contain ##TICKER##`).toContain('##TICKER##')
        }
    })

    it('each prompt is a non-empty string', () => {
        for (const prompt of Object.values(PROMPTS_MAP)) {
            expect(prompt.trim().length).toBeGreaterThan(50)
        }
    })
})

describe('PROMPT_COSTS_MAP', () => {
    it('has a cost for every prompt type', () => {
        expect(Object.keys(PROMPT_COSTS_MAP).length).toBeGreaterThanOrEqual(5)
    })

    it('all costs are positive numbers', () => {
        for (const cost of Object.values(PROMPT_COSTS_MAP)) {
            expect(cost).toBeGreaterThan(0)
        }
    })
})

describe('stockAnalysisSchema', () => {
    it('validates a correct object', () => {
        const valid = { analysis: '<h2>Test</h2>', sentiment: 65 }
        expect(stockAnalysisSchema.parse(valid)).toEqual(valid)
    })

    it('rejects missing analysis', () => {
        expect(() => stockAnalysisSchema.parse({ sentiment: 50 })).toThrow()
    })

    it('rejects missing sentiment', () => {
        expect(() => stockAnalysisSchema.parse({ analysis: '<p>test</p>' })).toThrow()
    })

    it('rejects non-number sentiment', () => {
        expect(() =>
            stockAnalysisSchema.parse({ analysis: '<p>test</p>', sentiment: 'bullish' })
        ).toThrow()
    })
})
