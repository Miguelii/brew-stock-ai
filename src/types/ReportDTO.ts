import type { PropmptsEnum } from './PropmptsEnum'
import type {
    InsightsReport,
    InsightsCompanySnapshot,
    InsightsSigDev,
} from 'yahoo-finance2/modules/insights'

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
    ticker: string
    reports: StockReports[] | null
    scores: StockScores | null
    sig_dev: StockSigDev | null
}

export type ReportWithStockData = {
    report: ReportDTO
    stockData: StockData | null
}
