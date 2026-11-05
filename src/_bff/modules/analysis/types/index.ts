import type { PricePoint, YahooDataWithFallbackResult } from '@/_bff/modules/yahoo/types'
import type { NewsItem } from '@/types/news'
import type { ReportDTO } from '@/types/ReportDTO'
import type { SupabaseClient } from '@supabase/supabase-js'

export type MarketData = {
    yahoo: YahooDataWithFallbackResult
    priceHistory: PricePoint[] | null
    news: NewsItem[] | null
}

export type AnalyzeReportInput = {
    stockSymbol: string
    promptTemplate: string
    reportId: ReportDTO['id']
    marketData: MarketData
    supabaseClient: SupabaseClient
    mockAnalysis?: boolean
}

/** A failed data source; the source is then treated as missing, never fatal. */
type SourceFailure = {
    label: string
    ticker: string
    error: unknown
}

export type OnSourceError = (failure: SourceFailure) => void
