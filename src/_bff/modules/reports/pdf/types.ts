import type { ReportDTO, StockData } from '@/types/ReportDTO'

export type BuildPdfHtmlParams = {
    stock: ReportDTO['stock']
    type: ReportDTO['type']
    ai_response: ReportDTO['ai_response']
    sentiment: ReportDTO['sentiment']
    created_at: ReportDTO['created_at']
    stockData?: StockData | null
}

export type ReportHeaderView = {
    date: string
    reportLabel: string
    sentimentTitle: 'Risk Level' | 'Sentiment'
    sentimentLabel: string
    sentimentColor: string
}

export type RangeBarInput = {
    low: number | null
    high: number | null
    current: number | null
}

/** Where the current value sits inside a low-high range, as a 0-100 percentage. */
export type RangeBarView = { hasData: false } | { hasData: true; currentPct: number }
