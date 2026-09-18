import { describe, it, expect } from 'vitest'
import { buildYahooContext } from '@/_bff/modules/yahoo/helpers/build-yahoo-context.helper'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import type { StockFinancials } from '@/types/ReportDTO'

const mockFinancials: StockFinancials = {
    currentPrice: 150.25,
    marketCap: 2_500_000_000_000,
    trailingPE: 28.5,
    forwardPE: 24.3,
    priceToBook: 8.2,
    fiftyTwoWeekHigh: 180,
    fiftyTwoWeekLow: 120,
    beta: 1.15,
    debtToEquity: 45.6,
    revenueGrowth: 0.12,
    earningsGrowth: 0.18,
    freeCashflow: 95_000_000_000,
    operatingCashflow: 110_000_000_000,
    profitMargins: 0.265,
    operatingMargins: 0.31,
    returnOnEquity: 0.42,
    totalRevenue: 380_000_000_000,
    ebitda: 130_000_000_000,
    totalDebt: 120_000_000_000,
    enterpriseValue: 2_600_000_000_000,
    targetMeanPrice: 175,
    targetHighPrice: 200,
    targetLowPrice: 140,
    dividendYield: 0.006,
}

const baseData: GetYahooDataResult = {
    scores: null,
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
}

// The section builders are exercised through buildYahooContext, the way the prompt uses them.
describe('financials and positioning sections', () => {
    it('includes the expanded valuation, quality and consensus lines', () => {
        const financials: StockFinancials = {
            ...mockFinancials,
            pegRatio: 2.67,
            priceToSales: 10.5,
            enterpriseToEbitda: 29.4,
            enterpriseToRevenue: 10.58,
            trailingEps: 8.83,
            forwardEps: 9.59,
            bookValue: 7.36,
            grossMargins: 0.486,
            ebitdaMargins: 0.36,
            returnOnAssets: 0.271,
            currentRatio: 1.003,
            quickRatio: 0.812,
            totalCash: 62_000_000_000,
            totalCashPerShare: 4.28,
            revenuePerShare: 31.71,
            netIncomeToCommon: 128_000_000_000,
            payoutRatio: 0.12,
            recommendationKey: 'buy',
            recommendationMean: 2.2,
            numberOfAnalystOpinions: 39,
            targetMedianPrice: 340,
        }
        const result = buildYahooContext({ ...baseData, financials })

        expect(result).toContain('- PEG: 2.67 | P/S: 10.50 | EV/EBITDA: 29.40 | EV/Revenue: 10.58')
        expect(result).toContain('- EPS (TTM): 8.83 | Forward EPS: 9.59 | Book Value/Share: 7.36')
        expect(result).toContain('- Gross Margin: 48.6% | EBITDA Margin: 36.0% | ROA: 27.1%')
        expect(result).toContain('- Current Ratio: 1.00 | Quick Ratio: 0.81 | Cash: $62.00B')
        expect(result).toContain('Dividend Yield: 0.6% | Payout Ratio: 12.0%')
        expect(result).toContain('- Analyst Consensus: buy (mean rating 2.20 from 39 analysts')
        expect(result).toContain('Median Target: $340.00')
    })
    it('includes market positioning with the gap to the S&P 500', () => {
        const financials: StockFinancials = {
            ...mockFinancials,
            fiftyTwoWeekChange: 0.3727,
            sp500FiftyTwoWeekChange: 0.146,
            shortPercentOfFloat: 0.0096,
            shortRatio: 2.97,
            heldPercentInsiders: 0.0165,
            heldPercentInstitutions: 0.6634,
            sharesOutstanding: 14_594_180_000,
            floatShares: 14_569_078_010,
        }
        const result = buildYahooContext({ ...baseData, financials })

        expect(result).toContain('**Market Positioning & Ownership:**')
        expect(result).toContain(
            '- 1-year price change: 37.3% | S&P 500: 14.6% → +22.7% vs the index'
        )
        expect(result).toContain('- Short interest: 1.0% of float | Days to cover: 2.97')
        expect(result).toContain('- Ownership: insiders 1.7% | institutions 66.3%')
        expect(result).toContain('- Shares outstanding: 14.59B | Float: 14.57B')
    })
    it('omits the positioning block and the optional lines on older stored data', () => {
        const result = buildYahooContext({ ...baseData, financials: mockFinancials })

        expect(result).not.toContain('**Market Positioning & Ownership:**')
        expect(result).not.toContain('PEG:')
        expect(result).not.toContain('Analyst Consensus:')
        expect(result).toContain('- P/E (TTM): 28.50')
    })
})
