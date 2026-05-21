import { describe, it, expect } from 'vitest'
import { buildPdfHtml } from '@/services/reports/helpers/build-pdf-html'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import type { StockData, StockFinancials } from '@/types/ReportDTO'

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
            ticker: 'AAPL',
            reports: null,
            scores: null,
            sig_dev: { headline: 'Apple announces new product', date: '2024-06-10' },
            financials: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Apple announces new product')
        expect(html).toContain('Recent Significant Development')
    })

    it('includes news reports when provided', () => {
        const stockData: StockData = {
            ticker: 'AAPL',
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
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Q3 Results')
        expect(html).toContain('Reuters')
        expect(html).toContain('Latest News')
    })

    it('includes scores section when provided', () => {
        const stockData: StockData = {
            ticker: 'AAPL',
            reports: null,
            scores: {
                company: { innovativeness: 0.9, hiring: 0.7, sustainability: 0.8 },
                sector: { innovativeness: 0.6, hiring: 0.5, sustainability: 0.5 },
            },
            sig_dev: null,
            financials: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Company vs Sector Scores')
        expect(html).toContain('Innovation')
        expect(html).toContain('Hiring Velocity')
        expect(html).toContain('Sustainability')
    })

    it('renders without stockData', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).not.toContain('Recent Significant Development')
        expect(html).not.toContain('Latest News')
        expect(html).not.toContain('Company vs Sector Scores')
    })

    it('includes brand name', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('StockBrew')
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
        ticker: 'AAPL',
        reports: null,
        scores: null,
        sig_dev: null,
        financials,
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
        expect(html).toContain('Cash Flow &amp; Debt')
    })

    it('renders the 52-Week Range section with formatted prices', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('52-Week Range')
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

    it('renders the Analyst Price Target section when targetMeanPrice is provided', () => {
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('Analyst Price Target')
        expect(html).toContain('Mean target $210.00')
    })

    it('omits the Analyst Price Target section when targetMeanPrice is null', () => {
        const html = buildPdfHtml({
            ...baseParams,
            stockData: withFinancials({ ...baseFinancials, targetMeanPrice: null }),
        })
        expect(html).not.toContain('Analyst Price Target')
    })

    it('shows positive upside badge with + prefix and green color', () => {
        // targetMeanPrice (210) > currentPrice (189.5) → positive upside
        const html = buildPdfHtml({ ...baseParams, stockData: withFinancials(baseFinancials) })
        expect(html).toContain('color:#16a34a;')
        expect(html).toContain('+')
        expect(html).toContain('% to mean')
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
        expect(html).toContain('% to mean')
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
