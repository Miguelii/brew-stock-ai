import type {
    StockFinancials,
    StockFundamentals,
    StockReports,
    StockScores,
    StockSigDev,
} from '@/types/ReportDTO'

export type PricePoint = { date: number; close: number }

export type GetYahooDataResult = {
    scores: StockScores | null
    reports: StockReports[]
    sigDev: StockSigDev | null
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

export type YahooTtlResult = { ticker: string; data: GetYahooDataResult; isFresh: boolean } | null
