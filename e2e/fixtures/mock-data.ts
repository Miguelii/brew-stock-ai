import type { NewsItem } from '@/types/news'
import type { StockFinancials, StockScores, StockData, ReportDTO } from '@/types/ReportDTO'
import type { Invoice } from '@/types/Invoice'

export const MOCK_REPORT_ID = 'pw-test-report-id'
export const MOCK_TICKER = 'AAPL'
export const MOCK_USER_EMAIL = 'playwright@stockbrew.test'
export const MOCK_CREDITS = 5

export const MOCK_AI_RESPONSE = `
<h2>Full Stock Analysis — AAPL</h2>
<p>Apple Inc. demonstrates strong fundamentals across all key financial metrics, with consistent revenue growth and industry-leading profit margins.</p>
<h2>Revenue &amp; Profitability</h2>
<p>Revenue grew 8% year-over-year with expanding margins driven by the high-margin Services segment. The company continues to generate substantial free cash flow, enabling aggressive share buybacks.</p>
<h2>Risk Assessment</h2>
<p>Beta of 1.23 indicates moderate market sensitivity. Key risks include China market exposure, regulatory scrutiny, and dependency on iPhone revenue concentration.</p>
<h2>Growth Potential</h2>
<p>Services, Vision Pro, and AI integration provide multiple avenues for sustained growth beyond the core hardware business.</p>
<h3>Investment Thesis Summary</h3>
<p>Apple continues to demonstrate exceptional pricing power and brand loyalty. The company's Services segment provides predictable recurring revenue, while the iPhone franchise maintains dominant global market share. At current valuations, the stock offers a reasonable entry point for long-term investors seeking quality at a fair price. The balance sheet remains fortress-like with over $60B in net cash.</p>
`

export const MOCK_FINANCIALS: StockFinancials = {
    currentPrice: 185.5,
    marketCap: 2_850_000_000_000,
    trailingPE: 28.5,
    forwardPE: 25.3,
    priceToBook: 45.2,
    fiftyTwoWeekHigh: 199.62,
    fiftyTwoWeekLow: 164.08,
    beta: 1.23,
    debtToEquity: 141.3,
    revenueGrowth: 0.08,
    earningsGrowth: 0.12,
    freeCashflow: 97_150_000_000,
    operatingCashflow: 113_200_000_000,
    profitMargins: 0.253,
    operatingMargins: 0.301,
    returnOnEquity: 1.608,
    totalRevenue: 394_328_000_000,
    ebitda: 130_200_000_000,
    totalDebt: 119_960_000_000,
    enterpriseValue: 2_940_000_000_000,
    targetMeanPrice: 205.5,
    targetHighPrice: 240,
    targetLowPrice: 175,
    dividendYield: 0.0053,
}

export const MOCK_SCORES: StockScores = {
    company: { innovativeness: 0.85, hiring: 0.72, sustainability: 0.65 },
    sector: { innovativeness: 0.7, hiring: 0.6, sustainability: 0.55 },
}

export const MOCK_STOCK_DATA: StockData = {
    id: MOCK_TICKER,
    financials: MOCK_FINANCIALS,
    scores: MOCK_SCORES,
    sig_dev: {
        headline: 'Apple reports record Q1 2024 earnings, beating analyst expectations by 8%',
        date: '2024-02-01T00:00:00Z',
    },
    reports: [
        {
            title: 'Apple Q1 2024 Earnings Review',
            provider: 'Goldman Sachs',
            reportDate: '2024-02-02T00:00:00Z',
            reportTitle: 'Buy',
        },
        {
            title: 'Services segment accelerating — upgrade to Outperform',
            provider: 'Morgan Stanley',
            reportDate: '2024-01-15T00:00:00Z',
            reportTitle: 'Outperform',
        },
    ],
}

export const MOCK_REPORT: ReportDTO = {
    id: MOCK_REPORT_ID,
    created_at: '2024-02-01T10:00:00Z',
    type: 'STOCK_ANALYSIS' as ReportDTO['type'],
    status: 'COMPLETED' as ReportDTO['status'],
    ai_response: MOCK_AI_RESPONSE,
    user_id: 'pw-test-user-id',
    stock: MOCK_TICKER,
    sentiment: 72,
    ticker: MOCK_TICKER,
}

export const MOCK_NEWS_ITEMS: NewsItem[] = [
    {
        category: 'technology',
        datetime: 1706745600,
        headline: 'Apple Vision Pro launches to strong demand in US market',
        id: 1001,
        image: 'https://example.com/img1.jpg',
        source: 'Reuters',
        summary:
            'Apple Vision Pro headset went on sale with long queues outside Apple stores across the United States.',
        url: 'https://reuters.com/test-1',
    },
    {
        category: 'technology',
        datetime: 1706659200,
        headline: 'Apple services revenue hits record $23.1B in Q1 2024',
        id: 1002,
        image: 'https://example.com/img2.jpg',
        source: 'Bloomberg',
        summary: "Apple's Services segment posted its highest-ever quarterly revenue.",
        url: 'https://bloomberg.com/test-2',
    },
    {
        category: 'technology',
        datetime: 1706572800,
        headline: 'Warren Buffett increases Berkshire stake in Apple to 5.9%',
        id: 1003,
        image: 'https://example.com/img3.jpg',
        source: 'CNBC',
        summary:
            "Berkshire Hathaway continued buying Apple shares in Q4, reinforcing Buffett's conviction in the tech giant.",
        url: 'https://cnbc.com/test-3',
    },
]

// Minimal valid-looking PDF base64
export const MOCK_EXPORT_PDF = 'JVBERi0xLjMKJcTl8uXrp/Og0MTGCg=='

// Redirects back to the tokens page so Playwright can intercept the navigation
export const MOCK_STRIPE_URL = 'http://localhost:3001/tokens?success=true'

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'cs_test_paid',
        date: 1706745600,
        amount: 99,
        currency: 'eur',
        description: '5 Analysis Tokens',
        status: 'paid',
        paymentMethod: 'card',
    },
]

export const MOCK_PENDING_INVOICE: Invoice = {
    id: 'cs_test_pending',
    date: 1706832000,
    amount: 249,
    currency: 'eur',
    description: '15 Analysis Tokens',
    status: 'pending',
}
