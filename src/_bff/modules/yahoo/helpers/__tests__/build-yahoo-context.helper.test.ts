import { describe, it, expect } from 'vitest'
import { buildYahooContext } from '@/_bff/modules/yahoo/helpers/build-yahoo-context.helper'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import type { StockFinancials, StockFundamentals, StockTechnicals } from '@/types/ReportDTO'
import type { NewsItem } from '@/types/news'

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

describe('buildYahooContext', () => {
    it('returns header even with empty data', () => {
        const result = buildYahooContext(baseData)
        expect(result).toContain('## Current Market Context')
        expect(result).toContain('Live data from Yahoo Finance')
    })

    it('includes financials section when provided', () => {
        const result = buildYahooContext({ ...baseData, financials: mockFinancials })
        expect(result).toContain('**Key Financial Indicators:**')
        expect(result).toContain('$150.25')
        expect(result).toContain('$120.00–$180.00')
        expect(result).toContain('P/E (TTM): 28.50')
        expect(result).toContain('Forward P/E: 24.30')
        expect(result).toContain('Debt-to-Equity: 45.60')
        expect(result).toContain('Revenue Growth (YoY): 12.0%')
        expect(result).toContain('ROE: 42.0%')
        expect(result).toContain('$2.50T')
        expect(result).toContain('$95.00B')
        expect(result).toContain('Dividend Yield: 0.6%')
        expect(result).toContain('$140.00 (low) / $175.00 (mean) / $200.00 (high)')
    })

    it('omits dividend yield when null', () => {
        const financials = { ...mockFinancials, dividendYield: null }
        const result = buildYahooContext({ ...baseData, financials })
        expect(result).not.toContain('Dividend Yield')
    })

    it('displays N/A for null values', () => {
        const financials: StockFinancials = {
            currentPrice: null,
            marketCap: null,
            trailingPE: null,
            forwardPE: null,
            priceToBook: null,
            fiftyTwoWeekHigh: null,
            fiftyTwoWeekLow: null,
            beta: null,
            debtToEquity: null,
            revenueGrowth: null,
            earningsGrowth: null,
            freeCashflow: null,
            operatingCashflow: null,
            profitMargins: null,
            operatingMargins: null,
            returnOnEquity: null,
            totalRevenue: null,
            ebitda: null,
            totalDebt: null,
            enterpriseValue: null,
            targetMeanPrice: null,
            targetHighPrice: null,
            targetLowPrice: null,
            dividendYield: null,
        }
        const result = buildYahooContext({ ...baseData, financials })
        expect(result).toContain('Price: N/A')
        expect(result).toContain('P/E (TTM): N/A')
        expect(result).toContain('Market Cap: N/A')
    })

    it('includes sigDev when provided', () => {
        const data: GetYahooDataResult = {
            ...baseData,
            sigDev: { headline: 'Company acquires rival', date: '2024-03-15' },
        }
        const result = buildYahooContext(data)
        expect(result).toContain('**Recent Significant Development:**')
        expect(result).toContain('Company acquires rival')
        expect(result).toContain('(2024-03-15)')
    })

    it('includes reports when provided', () => {
        const data: GetYahooDataResult = {
            ...baseData,
            reports: [
                {
                    title: 'Q4 Earnings Beat',
                    provider: 'Reuters',
                    reportDate: '2024-01-20',
                    reportTitle: 'Q4 Earnings Beat',
                },
                {
                    title: 'Revenue Up',
                    provider: 'Bloomberg',
                    reportDate: '2024-01-18',
                    reportTitle: 'Revenue Up',
                },
            ],
        }
        const result = buildYahooContext(data)
        expect(result).toContain('**Analyst Coverage:**')
        expect(result).toContain('Q4 Earnings Beat — Reuters (2024-01-20)')
        expect(result).toContain('Revenue Up — Bloomberg (2024-01-18)')
    })

    it('includes scores when provided', () => {
        const data: GetYahooDataResult = {
            ...baseData,
            scores: {
                company: { innovativeness: 0.85, hiring: 0.72, sustainability: 0.6 },
                sector: { innovativeness: 0.65, hiring: 0.55, sustainability: 0.5 },
            },
        }
        const result = buildYahooContext(data)
        expect(result).toContain('**Company vs Sector Scores (0.0–1.0 scale):**')
        expect(result).toContain('Innovation: 0.85 (sector avg: 0.65)')
        expect(result).toContain('Hiring Velocity: 0.72 (sector avg: 0.55)')
        expect(result).toContain('Sustainability: 0.60 (sector avg: 0.50)')
    })

    it('formats millions correctly', () => {
        const financials = { ...mockFinancials, freeCashflow: 500_000_000 }
        const result = buildYahooContext({ ...baseData, financials })
        expect(result).toContain('$500.00M')
    })

    it('includes fundamentals sections when provided', () => {
        const fundamentals: StockFundamentals = {
            earningsHistory: [
                {
                    period: '-1q',
                    quarter: '2024-03-31',
                    epsActual: 1.53,
                    epsEstimate: 1.5,
                    surprisePercent: 0.02,
                },
            ],
            forwardEstimates: [
                {
                    period: '+1q',
                    epsAvg: 1.6,
                    epsGrowth: 0.1,
                    revenueAvg: 90_000_000_000,
                    revenueGrowth: 0.08,
                },
            ],
            revenueTrend: [
                { endDate: '2023-12-31', totalRevenue: 380_000_000_000, netIncome: 95_000_000_000 },
            ],
            analystRatings: {
                period: '0m',
                strongBuy: 12,
                buy: 20,
                hold: 8,
                sell: 1,
                strongSell: 0,
            },
            insiders: { netShares: -50000, buyCount: 1, sellCount: 4 },
        }
        const result = buildYahooContext({ ...baseData, fundamentals })
        expect(result).toContain('**Earnings History')
        expect(result).toContain('→ beat')
        expect(result).toContain('**Forward Estimates')
        expect(result).toContain('**Revenue & Net Income Trend')
        expect(result).toContain('**Analyst Rating Distribution (0m):**')
        expect(result).toContain('Strong Buy 12')
        expect(result).toContain('**Insider Activity')
        expect(result).toContain('net selling')
    })

    it('includes technical snapshot when provided', () => {
        const technicals: StockTechnicals = {
            currentPrice: 150,
            sma50: 140,
            sma200: 130,
            priceVsSma50Pct: 7.1,
            priceVsSma200Pct: 15.4,
            trend: 'golden-cross',
            rsi14: 62,
            high52w: 180,
            low52w: 120,
            pctFrom52wHigh: -16.7,
            pctFrom52wLow: 25,
            return1m: 3.2,
            return3m: 8.5,
            return6m: 12,
            return12m: 22,
            annualizedVolatilityPct: 28.4,
        }
        const result = buildYahooContext(baseData, technicals)
        expect(result).toContain('**Technical Snapshot')
        expect(result).toContain('bullish regime')
        expect(result).toContain('RSI(14): 62')
        expect(result).toContain('1m 3.2%')
    })

    it('omits technical snapshot when price is null', () => {
        const technicals = {
            ...({} as StockTechnicals),
            currentPrice: null,
            trend: 'neutral' as const,
        }
        const result = buildYahooContext(baseData, technicals)
        expect(result).not.toContain('**Technical Snapshot')
    })

    it('includes recent news when provided', () => {
        const news: NewsItem[] = [
            {
                category: 'company',
                datetime: 1_710_000_000,
                headline: 'Company beats earnings',
                id: 1,
                image: '',
                source: 'Reuters',
                summary: 'The company reported strong quarterly results.',
                url: 'https://example.com',
            },
        ]
        const result = buildYahooContext(baseData, null, news)
        expect(result).toContain('**Recent News')
        expect(result).toContain('Company beats earnings [Reuters]')
        expect(result).toContain('strong quarterly results')
    })
})
