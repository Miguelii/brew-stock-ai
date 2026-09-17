import type { NewsItem } from '@/types/news'
import type {
    StockFinancials,
    StockFundamentals,
    StockScores,
    StockData,
    ReportDTO,
} from '@/types/ReportDTO'
import type { Invoice } from '@/types/Invoice'

export const MOCK_REPORT_ID = 'pw-test-report-id'
const MOCK_TICKER = 'AAPL'
export const MOCK_CREDITS = 5

const MOCK_AI_RESPONSE = `
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

const MOCK_FINANCIALS: StockFinancials = {
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

const MOCK_SCORES: StockScores = {
    company: { innovativeness: 0.85, hiring: 0.72, sustainability: 0.65 },
    sector: { innovativeness: 0.7, hiring: 0.6, sustainability: 0.55 },
}

const MOCK_FUNDAMENTALS: StockFundamentals = {
    earningsHistory: [
        {
            period: '-1q',
            quarter: '2024-03-31',
            epsActual: 2.18,
            epsEstimate: 2.1,
            surprisePercent: 0.038,
        },
    ],
    forwardEstimates: [
        {
            period: '+1q',
            epsAvg: 2.35,
            epsGrowth: 0.12,
            revenueAvg: 124_000_000_000,
            revenueGrowth: 0.08,
        },
    ],
    revenueTrend: [
        { endDate: '2025-09-30', totalRevenue: 416_161_000_000, netIncome: 112_010_000_000 },
    ],
    // Counts intentionally sum to 35 so the bar header reads "Analyst recommendations (35)".
    analystRatings: { period: '0m', strongBuy: 18, buy: 10, hold: 6, sell: 1, strongSell: 0 },
    insiders: { netShares: -120_000, buyCount: 1, sellCount: 5 },
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
    fundamentals: MOCK_FUNDAMENTALS,
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

// Finnhub timestamps are relative to "now" so the photo story stays recent enough to be
// featured (the selection ignores photo stories older than a week)
const NEWS_NOW_SECONDS = Math.floor(Date.now() / 1000)
const hoursAgo = (hours: number) => NEWS_NOW_SECONDS - hours * 60 * 60
const YAHOO_PLACEHOLDER_IMAGE =
    'https://s.yimg.com/rz/stage/p/yahoo_finance_en-US_h_p_finance_2.png'

export const MOCK_NEWS_ITEMS: NewsItem[] = [
    {
        category: 'company',
        datetime: hoursAgo(2),
        headline: 'Apple Vision Pro launches to strong demand in US market',
        id: 1001,
        image: YAHOO_PLACEHOLDER_IMAGE,
        source: 'Yahoo',
        summary:
            'Apple Vision Pro headset went on sale with long queues outside Apple stores across the United States.',
        url: 'https://finance.yahoo.com/news/test-1',
    },
    {
        category: 'company',
        datetime: hoursAgo(5),
        headline: 'Apple services revenue hits record $23.1B in Q1 2024',
        id: 1002,
        image: YAHOO_PLACEHOLDER_IMAGE,
        source: 'Yahoo',
        summary: "Apple's Services segment posted its highest-ever quarterly revenue.",
        url: 'https://finance.yahoo.com/news/test-2',
    },
    {
        category: 'company',
        datetime: hoursAgo(26),
        headline: 'Warren Buffett increases Berkshire stake in Apple to 5.9%',
        id: 1003,
        image: 'https://cdn.benzinga.com/files/images/story/2026/09/16/Apple-Store.jpg?width=2048&height=1536',
        source: 'Benzinga',
        summary:
            "Berkshire Hathaway continued buying Apple shares in Q4, reinforcing Buffett's conviction in the tech giant.",
        url: 'https://www.benzinga.com/news/test-3',
    },
    {
        category: 'company',
        datetime: hoursAgo(30),
        headline: 'Analysts lift Apple price targets ahead of the iPhone cycle',
        id: 1004,
        image: YAHOO_PLACEHOLDER_IMAGE,
        source: 'Yahoo',
        summary: 'Several brokers raised their targets after checks pointed to firm demand.',
        url: 'https://finance.yahoo.com/news/test-4',
    },
    {
        category: 'company',
        datetime: hoursAgo(40),
        headline: 'Apple: the services flywheel keeps compounding',
        id: 1005,
        image: 'https://static.seekingalpha.com/assets/og_image_1200-29b2bfe1a595477db6826bd2126c63ac2091efb7ec76347a8e7f81ba17e3de6c.png',
        source: 'SeekingAlpha',
        summary: 'A look at how recurring revenue is reshaping the margin profile.',
        url: 'https://seekingalpha.com/article/test-5',
    },
    {
        category: 'company',
        datetime: hoursAgo(50),
        headline: 'Apple supplier shares slip on softer guidance',
        id: 1006,
        image: '',
        source: 'Yahoo',
        summary: 'A key component supplier trimmed its outlook for the quarter.',
        url: 'https://finance.yahoo.com/news/test-6',
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
