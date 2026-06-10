import { describe, it, expect } from 'vitest'
import {
    WallStreetStyleStockAnalysisPrompt,
    DeepFinancialBreakdownPrompt,
    MoatAnalysisPrompt,
    RiskAnalysisPrompt,
    GrowthPotentialAnalysisPrompt,
} from '../analysis.prompt'

describe('WallStreetStyleStockAnalysisPrompt', () => {
    it('contains ##TICKER## placeholder', () => {
        expect(WallStreetStyleStockAnalysisPrompt).toContain('##TICKER##')
    })

    it('covers key analysis areas', () => {
        expect(WallStreetStyleStockAnalysisPrompt).toContain('Business model')
        expect(WallStreetStyleStockAnalysisPrompt).toContain('moat')
        expect(WallStreetStyleStockAnalysisPrompt).toContain('Valuation')
        expect(WallStreetStyleStockAnalysisPrompt).toContain('Bull, bear, and base case')
    })

    it('includes quantitative anchoring instructions', () => {
        expect(WallStreetStyleStockAnalysisPrompt).toContain('PEG ratio')
        expect(WallStreetStyleStockAnalysisPrompt).toContain('Debt-to-Equity')
        expect(WallStreetStyleStockAnalysisPrompt).toContain('Free Cash Flow')
    })
})

describe('DeepFinancialBreakdownPrompt', () => {
    it('contains ##TICKER## placeholder', () => {
        expect(DeepFinancialBreakdownPrompt).toContain('##TICKER##')
    })

    it('covers financial health metrics', () => {
        expect(DeepFinancialBreakdownPrompt).toContain('Revenue growth')
        expect(DeepFinancialBreakdownPrompt).toContain('Profit margins')
        expect(DeepFinancialBreakdownPrompt).toContain('Free cash flow')
        expect(DeepFinancialBreakdownPrompt).toContain('Debt')
        expect(DeepFinancialBreakdownPrompt).toContain('Return on equity')
    })

    it('includes cash flow quality assessment', () => {
        expect(DeepFinancialBreakdownPrompt).toContain('Cash flow quality')
    })
})

describe('MoatAnalysisPrompt', () => {
    it('contains ##TICKER## placeholder', () => {
        expect(MoatAnalysisPrompt).toContain('##TICKER##')
    })

    it('covers moat sources', () => {
        expect(MoatAnalysisPrompt).toContain('Brand strength')
        expect(MoatAnalysisPrompt).toContain('Network effects')
        expect(MoatAnalysisPrompt).toContain('Switching costs')
        expect(MoatAnalysisPrompt).toContain('Cost advantage')
    })

    it('asks for moat trajectory', () => {
        expect(MoatAnalysisPrompt).toContain('widening or narrowing')
    })

    it('asks for rating 1-10', () => {
        expect(MoatAnalysisPrompt).toContain('1–10')
    })
})

describe('RiskAnalysisPrompt', () => {
    it('contains ##TICKER## placeholder', () => {
        expect(RiskAnalysisPrompt).toContain('##TICKER##')
    })

    it('covers risk categories', () => {
        expect(RiskAnalysisPrompt).toContain('Economic')
        expect(RiskAnalysisPrompt).toContain('disruption')
        expect(RiskAnalysisPrompt).toContain('Competition')
        expect(RiskAnalysisPrompt).toContain('Regulatory')
    })

    it('includes quantitative risk flags', () => {
        expect(RiskAnalysisPrompt).toContain('Leverage risk')
        expect(RiskAnalysisPrompt).toContain('Valuation risk')
        expect(RiskAnalysisPrompt).toContain('Cash flow risk')
        expect(RiskAnalysisPrompt).toContain('Beta risk')
    })

    it('asks for kill scenario', () => {
        expect(RiskAnalysisPrompt).toContain('kill scenario')
    })
})

describe('GrowthPotentialAnalysisPrompt', () => {
    it('contains ##TICKER## placeholder', () => {
        expect(GrowthPotentialAnalysisPrompt).toContain('##TICKER##')
    })

    it('covers growth drivers', () => {
        expect(GrowthPotentialAnalysisPrompt).toContain('addressable market')
        expect(GrowthPotentialAnalysisPrompt).toContain('Expansion')
        expect(GrowthPotentialAnalysisPrompt).toContain('Technology')
    })

    it('asks for bear/base/bull range', () => {
        expect(GrowthPotentialAnalysisPrompt).toContain('bear/base/bull')
    })
})
