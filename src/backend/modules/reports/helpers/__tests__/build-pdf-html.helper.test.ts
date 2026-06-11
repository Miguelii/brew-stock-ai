// oxlint-disable max-lines

import { describe, it, expect } from 'vitest'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import type { StockData, StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import { buildPdfHtml } from '../build-pdf-html.helper'

const baseParams = {
    stock: 'AAPL',
    type: PropmptsEnum.STOCK_ANALYSIS,
    ai_response: '<h2>Analysis</h2><p>Apple is strong.</p>',
    sentiment: 72,
    created_at: '2024-06-15T10:00:00Z',
}

describe('buildPdfHtml', () => {
    it('returns valid HTML with doctype', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('<!DOCTYPE html>')
        expect(html).toContain('<html lang="en">')
        expect(html).toContain('</html>')
    })

    it('includes the stock ticker', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('AAPL')
    })

    it('includes the AI response content', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('Apple is strong.')
    })

    it('includes formatted date', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('June 15, 2024')
    })

    it('shows sentiment label for stock analysis', () => {
        const html = buildPdfHtml({ ...baseParams, sentiment: 72 })
        expect(html).toContain('Bullish')
    })

    it('shows risk level label for risk analysis', () => {
        const html = buildPdfHtml({
            ...baseParams,
            type: PropmptsEnum.RISK_ANALYSIS,
            sentiment: 30,
        })
        expect(html).toContain('High Risk')
    })

    it('includes significant development when provided', () => {
        const stockData: StockData = {
            id: 'AAPL',
            reports: null,
            scores: null,
            sig_dev: { headline: 'Apple announces new product', date: '2024-06-10' },
            financials: null,
            fundamentals: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Apple announces new product')
        expect(html).toContain("What's Happening Now")
    })

    it('includes news reports when provided', () => {
        const stockData: StockData = {
            id: 'AAPL',
            reports: [
                {
                    title: 'Q3 Results',
                    provider: 'Reuters',
                    reportDate: '2024-06-12',
                    reportTitle: 'Strong Q3',
                },
            ],
            scores: null,
            sig_dev: null,
            financials: null,
            fundamentals: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Q3 Results')
        expect(html).toContain('Reuters')
        expect(html).toContain('What Experts Are Saying')
    })

    it('includes scores section when provided', () => {
        const stockData: StockData = {
            id: 'AAPL',
            reports: null,
            scores: {
                company: { innovativeness: 0.9, hiring: 0.7, sustainability: 0.8 },
                sector: { innovativeness: 0.6, hiring: 0.5, sustainability: 0.5 },
            },
            sig_dev: null,
            financials: null,
            fundamentals: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('How It Compares')
        expect(html).toContain('Innovation')
        expect(html).toContain('Workforce Growth')
        expect(html).toContain('Sustainability')
    })

    it('renders without stockData', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).not.toContain("What's Happening Now")
        expect(html).not.toContain('What Experts Are Saying')
        expect(html).not.toContain('How It Compares')
    })

    it('includes brand name', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('StockBrew')
    })
})

describe('buildPdfHtml escaping and sanitization', () => {
    it('escapes HTML in the user-provided stock string', () => {
        const html = buildPdfHtml({ ...baseParams, stock: '<img src=x onerror=alert(1)>' })
        expect(html).not.toContain('<img')
        expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    })

    it('escapes HTML in the sig dev headline', () => {
        const stockData: StockData = {
            id: 'AAPL',
            reports: null,
            scores: null,
            sig_dev: { headline: '<script>alert(1)</script>Apple event', date: '2024-06-10' },
            financials: null,
            fundamentals: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).not.toContain('<script>alert(1)</script>')
        expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;Apple event')
    })

    it('escapes HTML in news titles and providers', () => {
        const stockData: StockData = {
            id: 'AAPL',
            reports: [
                {
                    title: '<script>alert(1)</script>Q3',
                    provider: '<b onmouseover=x>Reuters</b>',
                    reportDate: '2024-06-12',
                    reportTitle: '"><svg onload=alert(1)>',
                },
            ],
            scores: null,
            sig_dev: null,
            financials: null,
            fundamentals: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).not.toContain('<script>')
        expect(html).not.toContain('<svg')
        expect(html).not.toContain('onmouseover=x>')
        expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;Q3')
    })

    it('strips script tags and unsafe attributes from the AI response but keeps formatting', () => {
        const html = buildPdfHtml({
            ...baseParams,
            ai_response:
                '<h2>Analysis</h2><p onclick="alert(1)">Apple is <strong>strong</strong>.</p><script>alert(1)</script><a href="javascript:alert(1)">link</a>',
        })
        expect(html).not.toContain('<script>alert(1)</script>')
        expect(html).not.toContain('onclick')
        expect(html).not.toContain('javascript:alert(1)')
        expect(html).toContain('<h2>Analysis</h2>')
        expect(html).toContain('<strong>strong</strong>')
    })
})

describe('buildFinancialsSection', () => {
    const baseFinancials: StockFinancials = {
        currentPrice: 189.5,
        fiftyTwoWeekLow: 124.17,
        fiftyTwoWeekHigh: 199.62,
        targetMeanPrice: 210.0,
        targetLowPrice: 170.0,
        targetHighPrice: 250.0,
        marketCap: 2_950_000_000_000,
        enterpriseValue: 2_980_000_000_000,
        trailingPE: 30.4,
        forwardPE: 27.1,
        priceToBook: 47.2,
        beta: 1.28,
        dividendYield: 0.0055,
        returnOnEquity: 1.47,
        totalRevenue: 385_000_000_000,
        revenueGrowth: 0.048,
        earningsGrowth: 0.112,
        ebitda: 125_000_000_000,
        profitMargins: 0.253,
        operatingMargins: 0.298,
        freeCashflow: 90_000_000_000,
        operatingCashflow: 110_000_000_000,
        totalDebt: 111_000_000_000,
        debtToEquity: 186.7,
    }

    const withFinancials = (financials: StockFinancials | null): StockData => ({
        id: 'AAPL',
        reports: null,
        scores: null,
        sig_dev: null,
        financials,
        fundamentals: null,
    })

    it('renders the Key Financial Metrics section when financials are provided', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('Key Financial Metrics')
    })

    it('omits the Key Financial Metrics section when financials are null', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(null) })
        expect(html).not.toContain('Key Financial Metrics')
    })

    it('renders all three group titles', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('Revenue &amp; Profitability')
        expect(html).toContain('Valuation &amp; Returns')
        expect(html).toContain('Financial Health')
    })

    it('renders the 52-week range section with formatted prices', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('Where the stock has traded in the last year')
        expect(html).toContain('$124.17')
        expect(html).toContain('$199.62')
        expect(html).toContain('Current $189.50')
    })

    it('renders Data N/A for 52-week range when price values are null', () => {
        const html = buildPdfHtml({
            ...baseParams,
            stockData: withFinancials({ ...baseFinancials, currentPrice: null }),
        })
        expect(html).toContain('Data N/A')
    })

    it('always renders the analyst price targets section', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('What analysts think the stock is worth')
        expect(html).toContain('Lowest analyst target')
        expect(html).toContain('Average analyst target')
        expect(html).toContain('Highest analyst target')
    })

    it('renders the 3 analyst target prices when all are provided', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('$170.00') // targetLowPrice
        expect(html).toContain('$210.00') // targetMeanPrice
        expect(html).toContain('$250.00') // targetHighPrice
    })

    it('shows N/A in each tile when target prices are null', () => {
        const html = buildPdfHtml({
            ...baseParams,
            stockData: withFinancials({
                ...baseFinancials,
                targetLowPrice: null,
                targetMeanPrice: null,
                targetHighPrice: null,
            }),
        })
        expect(html).toContain('What analysts think the stock is worth')
        // 3 N/A tiles from targets + any nulls already present — at least 3
        const matches = html.match(/N\/A/g) ?? []
        expect(matches.length).toBeGreaterThanOrEqual(3)
    })

    it('shows positive upside badge with + prefix and green color', () => {
        // targetMeanPrice (210) > currentPrice (189.5) → positive upside
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('color:#16a34a;')
        expect(html).toContain('+')
        expect(html).toContain('% to consensus')
    })

    it('shows negative upside badge with red color when target is below current price', () => {
        const html = buildPdfHtml({
            ...baseParams,
            stockData: withFinancials({
                ...baseFinancials,
                targetMeanPrice: 150.0,
                targetLowPrice: 120.0,
                targetHighPrice: 180.0,
            }),
        })
        expect(html).toContain('color:#ef4444;')
        expect(html).toContain('% to consensus')
    })

    it('omits the upside badge when targetMeanPrice is null', () => {
        const html = buildPdfHtml({
            ...baseParams,
            stockData: withFinancials({ ...baseFinancials, targetMeanPrice: null }),
        })
        expect(html).toContain('What analysts think the stock is worth')
        expect(html).not.toContain('% to consensus')
    })

    it('formats large numbers with B/T suffix', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('$2.95T') // marketCap
        expect(html).toContain('$385.00B') // totalRevenue
    })

    it('formats percentage metrics correctly', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('4.8%') // revenueGrowth 0.048
        expect(html).toContain('25.3%') // profitMargins 0.253
    })

    it('renders N/A for null financial values', () => {
        const html = buildPdfHtml({
            ...baseParams,
            stockData: withFinancials({
                ...baseFinancials,
                trailingPE: null,
                beta: null,
                dividendYield: null,
            }),
        })
        // each null field produces an N/A tile — at least three present
        const matches = html.match(/N\/A/g) ?? []
        expect(matches.length).toBeGreaterThanOrEqual(3)
    })
})

describe('buildPdfHtml fundamentals section', () => {
    const baseFundamentals: StockFundamentals = {
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
        analystRatings: { period: '0m', strongBuy: 12, buy: 20, hold: 8, sell: 1, strongSell: 0 },
        insiders: { netShares: -50000, buyCount: 1, sellCount: 4 },
    }

    const withFundamentals = (fundamentals: StockFundamentals | null): StockData => ({
        id: 'AAPL',
        reports: null,
        scores: null,
        sig_dev: null,
        financials: null,
        fundamentals,
    })

    it('renders the Key Financial Metrics section when only fundamentals are present', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFundamentals(baseFundamentals) })
        expect(html).toContain('Key Financial Metrics')
    })

    it('renders all fundamentals blocks with friendly period labels', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFundamentals(baseFundamentals) })
        expect(html).toContain('Analyst recommendations (41)')
        expect(html).toContain('Strong Buy')
        expect(html).toContain('Forward Estimates')
        expect(html).toContain('Next Quarter EPS')
        expect(html).toContain('Earnings vs estimates')
        expect(html).toContain('Beat')
        expect(html).toContain('Revenue Trend')
        expect(html).toContain('Insider activity')
        expect(html).toContain('Net selling')
    })

    it('omits the section entirely when both financials and fundamentals are null', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFundamentals(null) })
        expect(html).not.toContain('Key Financial Metrics')
    })
})
