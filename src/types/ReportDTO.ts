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
}

export type ReportWithStockData = {
    report: ReportDTO
    stockData: StockData | null
}
