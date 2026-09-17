import { extractInvestmentThesis } from '@/_bff/core/helpers/report-html.helper'
import { getSentimentGaugeView } from '@/_bff/core/helpers/sentiment-gauge.helper'
import type { OverviewView } from '@/_bff/modules/reports/pdf/types'

/** The summary card and the sentiment (or risk) gauge. Expects already sanitized analysis HTML. */
export function getOverviewView(
    sanitizedHtml: string,
    sentiment: number,
    isRiskAnalysis: boolean
): OverviewView {
    return {
        thesisHtml: extractInvestmentThesis(sanitizedHtml),
        gaugeTitle: isRiskAnalysis ? 'Risk Score' : 'Sentiment Score',
        gauge: getSentimentGaugeView(sentiment ?? 0, isRiskAnalysis),
    }
}
