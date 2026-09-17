import type { ReportDTO, StockData } from '@/types/ReportDTO'
import type { getSentimentGaugeView } from '@/_bff/core/helpers/sentiment-gauge.helper'
import type { getCalendarParts } from '@/_bff/core/utils/event-dates.utils'

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
    isRiskAnalysis: boolean
    reportLabel: string
    sentimentTitle: 'Risk Level' | 'Sentiment'
    sentimentLabel: string
    sentimentColor: string
}

export type OverviewView = {
    // Sanitized "Investment Thesis Summary" HTML, or null when the analysis has none
    thesisHtml: string | null
    gaugeTitle: 'Risk Score' | 'Sentiment Score'
    gauge: ReturnType<typeof getSentimentGaugeView>
}

export type SigDevView = {
    headline: string
    calendar: ReturnType<typeof getCalendarParts> | null
    age: string | null
}

export type RangeBarInput = {
    low: number | null
    high: number | null
    current: number | null
}

/** Where the current value sits inside a low-high range, as a 0-100 percentage. */
export type RangeBarView = { hasData: false } | { hasData: true; currentPct: number }
