import type { PropmptsEnum } from '@/types/PropmptsEnum'
import type {
    InsightsReport,
    InsightsCompanySnapshot,
    InsightsSigDev,
} from 'yahoo-finance2/modules/insights'

export type StockFinancials = {
    currentPrice: number | null
    marketCap: number | null
    trailingPE: number | null
    forwardPE: number | null
    priceToBook: number | null
    fiftyTwoWeekHigh: number | null
    fiftyTwoWeekLow: number | null
    beta: number | null
    debtToEquity: number | null
    revenueGrowth: number | null
    earningsGrowth: number | null
    freeCashflow: number | null
    operatingCashflow: number | null
    profitMargins: number | null
    operatingMargins: number | null
    returnOnEquity: number | null
    totalRevenue: number | null
    ebitda: number | null
    totalDebt: number | null
    enterpriseValue: number | null
    targetMeanPrice: number | null
    targetHighPrice: number | null
    targetLowPrice: number | null
    dividendYield: number | null
}

type PickSnapshot = {
    innovativeness: InsightsCompanySnapshot['company']['innovativeness'] | null
    hiring: InsightsCompanySnapshot['company']['innovativeness'] | null
    sustainability: InsightsCompanySnapshot['company']['innovativeness'] | null
}

// Expanded Yahoo fundamentals — stored as JSON, so dates are serialised to ISO strings.
export type EarningsQuarter = {
    period: string
    quarter: string | null
    epsActual: number | null
    epsEstimate: number | null
    surprisePercent: number | null
}

export type ForwardEstimate = {
    period: string
    epsAvg: number | null
    epsGrowth: number | null
    revenueAvg: number | null
    revenueGrowth: number | null
}

export type RevenueTrendPoint = {
    endDate: string | null
    totalRevenue: number | null
    netIncome: number | null
}

export type AnalystRatings = {
    period: string
    strongBuy: number
    buy: number
    hold: number
    sell: number
    strongSell: number
}

export type InsiderActivity = {
    netShares: number | null
    buyCount: number
    sellCount: number
}

export type StockFundamentals = {
    earningsHistory: EarningsQuarter[]
    forwardEstimates: ForwardEstimate[]
    revenueTrend: RevenueTrendPoint[]
    analystRatings: AnalystRatings | null
    insiders: InsiderActivity | null
}

// Derived technical indicators computed from the 1y daily price history.
export type StockTechnicals = {
    currentPrice: number | null
    sma50: number | null
    sma200: number | null
    priceVsSma50Pct: number | null
    priceVsSma200Pct: number | null
    trend: 'golden-cross' | 'death-cross' | 'neutral'
    rsi14: number | null
    high52w: number | null
    low52w: number | null
    pctFrom52wHigh: number | null
    pctFrom52wLow: number | null
    return1m: number | null
    return3m: number | null
    return6m: number | null
    return12m: number | null
    annualizedVolatilityPct: number | null
}

export enum ReportStatus {
    GENERATING = 'GENERATING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export type ReportDTO = {
    id: string
    created_at: string
    type: PropmptsEnum
    status: ReportStatus
    ai_response: string
    user_id: string
    stock: string
    sentiment: number
    ticker?: string
}

export type ReportListItem = Pick<ReportDTO, 'created_at' | 'id' | 'status' | 'stock' | 'type'>

export type StockReports = {
    title: InsightsReport['title'] | InsightsReport['headHtml']
    provider: InsightsReport['provider']
    reportDate: string
    reportTitle: InsightsReport['reportTitle']
}

export type StockScores = {
    company: PickSnapshot
    sector: PickSnapshot
}

export type StockSigDev = {
    headline: InsightsSigDev['headline']
    date: string
}

export type StockData = {
    id: string
    reports: StockReports[] | null
    scores: StockScores | null
    sig_dev: StockSigDev | null
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

export type ReportWithStockData = {
    report: ReportDTO
    stockData: StockData | null
}
