import type { StockFinancials, StockReports, StockScores, StockSigDev } from '@/types/ReportDTO'

export type { StockFinancials }

export type GetYahooDataResult = {
    scores: StockScores | null
    reports: StockReports[]
    sigDev: StockSigDev | null
    financials: StockFinancials | null
}

export type YahooTtlResult = { ticker: string; data: GetYahooDataResult; isFresh: boolean } | null
