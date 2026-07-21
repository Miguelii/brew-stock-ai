/**
 * Live contract test for yahoo-finance2.
 *
 * Unlike the other e2e specs (which mock ALL network), this one hits the REAL
 * Yahoo Finance API with no mocks, no web server and no browser. It runs in the
 * Node context of the Playwright runner and is a canary: it mirrors the exact
 * calls and field paths the app depends on (see the yahoo processors) so we learn
 * immediately when Yahoo renames, empties, or drops a field we consume, instead
 * of finding out in production.
 */

import { test, expect } from '@playwright/test'

type YahooClient = {
    search: (symbol: string, options: Record<string, unknown>) => Promise<any>
    insights: (symbol: string, options: Record<string, unknown>) => Promise<any>
    quoteSummary: (symbol: string, options: Record<string, unknown>) => Promise<any>
    fundamentalsTimeSeries: (symbol: string, options: Record<string, unknown>) => Promise<any>
    chart: (symbol: string, options: Record<string, unknown>) => Promise<any>
}

// Forward-looking earningsTrend periods the app surfaces (mirror of the mapper).
const FORWARD_PERIODS = new Set(['0q', '+1q', '0y', '+1y'])
const TICKER = 'AAPL'

let yf: YahooClient

test.describe('Yahoo Finance live contract', () => {
    test.beforeAll(async () => {
        const { default: YahooFinance } = await import('yahoo-finance2')
        yf = new YahooFinance({
            suppressNotices: ['yahooSurvey', 'ripHistorical'],
        }) as unknown as YahooClient
    })

    test('search resolves the canonical ticker', async () => {
        const result = await yf.search(TICKER, { quotesCount: 5, newsCount: 0 })

        expect(Array.isArray(result.quotes)).toBe(true)
        expect(result.quotes.length).toBeGreaterThan(0)

        const equity = result.quotes.find(
            (q: any) => 'quoteType' in q && q.quoteType === 'EQUITY' && q.isYahooFinance === true
        )
        expect(equity).toBeDefined()
        expect(typeof equity.symbol).toBe('string')
        expect(equity.symbol).toBe('AAPL')
    })

    test('insights returns snapshot scores, reports and sig-devs', async () => {
        const insights = await yf.insights(TICKER, { reportsCount: 3 })

        // Company vs sector snapshot scores are reliably present for a large-cap.
        for (const bucket of ['company', 'sector'] as const) {
            const snapshot = insights.companySnapshot?.[bucket]
            expect(snapshot).toBeDefined()
            expect(typeof snapshot.innovativeness).toBe('number')
            expect(typeof snapshot.hiring).toBe('number')
            expect(typeof snapshot.sustainability).toBe('number')
        }

        // Reports and sig-devs are volatile: assert the shape only when present.
        expect(Array.isArray(insights.reports)).toBe(true)
        const report = insights.reports[0]
        if (report) {
            expect('title' in report || 'headHtml' in report).toBe(true)
            expect(report).toHaveProperty('provider')
            expect(report).toHaveProperty('reportDate')
            expect(report).toHaveProperty('reportTitle')
        }

        expect(Array.isArray(insights.sigDevs)).toBe(true)
        const sigDev = insights.sigDevs[0]
        if (sigDev) {
            expect(sigDev).toHaveProperty('headline')
            expect(sigDev).toHaveProperty('date')
        }
    })

    test('quoteSummary financial modules expose every field we read', async () => {
        const summary = await yf.quoteSummary(TICKER, {
            modules: ['financialData', 'summaryDetail', 'defaultKeyStatistics'],
        })

        const fd = summary.financialData
        const sd = summary.summaryDetail
        const ks = summary.defaultKeyStatistics
        expect(fd).toBeDefined()
        expect(sd).toBeDefined()
        expect(ks).toBeDefined()

        // Type anchors: confirm each module actually returned data.
        expect(typeof fd.currentPrice).toBe('number')
        expect(typeof sd.marketCap).toBe('number')
        expect(typeof ks.enterpriseValue).toBe('number')

        // Every field path the app consumes must still exist.
        const financialDataKeys = [
            'currentPrice',
            'debtToEquity',
            'revenueGrowth',
            'earningsGrowth',
            'freeCashflow',
            'operatingCashflow',
            'profitMargins',
            'operatingMargins',
            'returnOnEquity',
            'totalRevenue',
            'ebitda',
            'totalDebt',
            'targetMeanPrice',
            'targetHighPrice',
            'targetLowPrice',
        ]
        const summaryDetailKeys = [
            'marketCap',
            'trailingPE',
            'forwardPE',
            'fiftyTwoWeekHigh',
            'fiftyTwoWeekLow',
            'beta',
            'dividendYield',
        ]
        const keyStatisticsKeys = ['priceToBook', 'enterpriseValue']

        for (const key of financialDataKeys) expect(fd).toHaveProperty(key)
        for (const key of summaryDetailKeys) expect(sd).toHaveProperty(key)
        for (const key of keyStatisticsKeys) expect(ks).toHaveProperty(key)
    })

    test('quoteSummary fundamentals modules expose every field we read', async () => {
        const summary = await yf.quoteSummary(TICKER, {
            modules: [
                'earningsHistory',
                'earningsTrend',
                'recommendationTrend',
                'insiderTransactions',
            ],
        })

        // Earnings history — actual vs estimate rows.
        const history = summary.earningsHistory?.history
        expect(Array.isArray(history)).toBe(true)
        expect(history.length).toBeGreaterThan(0)
        for (const key of ['period', 'quarter', 'epsActual', 'epsEstimate', 'surprisePercent']) {
            expect(history[0]).toHaveProperty(key)
        }

        // Forward estimates — at least one of the periods we surface.
        const trend = summary.earningsTrend?.trend
        expect(Array.isArray(trend)).toBe(true)
        const forward = trend.find((t: any) => FORWARD_PERIODS.has(t.period))
        expect(forward).toBeDefined()
        expect(forward.earningsEstimate).toHaveProperty('avg')
        expect(forward.earningsEstimate).toHaveProperty('growth')
        expect(forward.revenueEstimate).toHaveProperty('avg')
        expect(forward.revenueEstimate).toHaveProperty('growth')

        // Analyst recommendation distribution.
        const rec = summary.recommendationTrend?.trend?.[0]
        expect(rec).toBeDefined()
        for (const key of ['period', 'strongBuy', 'buy', 'hold', 'sell', 'strongSell']) {
            expect(rec).toHaveProperty(key)
        }

        // Insider transactions are volatile: assert the shape only when present.
        const transactions = summary.insiderTransactions?.transactions
        expect(Array.isArray(transactions)).toBe(true)
        const tx = transactions[0]
        if (tx) {
            expect(tx).toHaveProperty('transactionText')
            expect(tx).toHaveProperty('shares')
        }
    })

    test('fundamentalsTimeSeries returns the annual revenue trend', async () => {
        const period1 = new Date()
        period1.setFullYear(period1.getFullYear() - 5)

        const series = await yf.fundamentalsTimeSeries(TICKER, {
            period1,
            type: 'annual',
            module: 'financials',
        })

        expect(Array.isArray(series)).toBe(true)
        expect(series.length).toBeGreaterThan(0)

        const financialsRows = series.filter((s: any) => s.TYPE === 'FINANCIALS')
        expect(financialsRows.length).toBeGreaterThan(0)
        expect(financialsRows[0]).toHaveProperty('date')

        // totalRevenue / netIncome are per-row optional (the mapper falls back to
        // null), so require that at least one FINANCIALS row still carries each.
        const hasRevenue = financialsRows.some((s: any) => typeof s.totalRevenue === 'number')
        expect(hasRevenue).toBe(true)

        const hasNetIncome = financialsRows.some(
            (s: any) =>
                s.netIncomeCommonStockholders != null ||
                s.netIncomeContinuousOperations != null ||
                s.netIncomeIncludingNoncontrollingInterests != null
        )
        expect(hasNetIncome).toBe(true)
    })

    test('chart returns the daily price history', async () => {
        const period1 = new Date()
        period1.setFullYear(period1.getFullYear() - 1)

        const result = await yf.chart(TICKER, { period1, interval: '1d' })

        expect(Array.isArray(result.quotes)).toBe(true)
        expect(result.quotes.length).toBeGreaterThan(0)

        const point = result.quotes.find((r: any) => r.close != null)
        expect(point).toBeDefined()
        expect(typeof point.close).toBe('number')
        expect(point.date).toBeInstanceOf(Date)
    })
})
