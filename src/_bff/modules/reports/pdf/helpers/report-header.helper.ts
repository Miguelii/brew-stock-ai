import { fmtDate } from '@/_bff/core/utils/formatters.utils'
import { PROMPT_TYPES } from '@/_bff/core/constants/prompt-types.constants'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import { getRiskLevelInfo, getSentimentInfo } from '@/_bff/core/helpers/sentiment.helper'
import type { BuildPdfHtmlParams, ReportHeaderView } from '@/_bff/modules/reports/pdf/types'

/** Header values: report type label, formatted date, and the sentiment (or risk level for risk reports). */
export function getReportHeader({
    type,
    sentiment,
    created_at,
}: Pick<BuildPdfHtmlParams, 'type' | 'sentiment' | 'created_at'>): ReportHeaderView {
    const isRiskAnalysis = type === PropmptsEnum.RISK_ANALYSIS
    const { label, color } = isRiskAnalysis
        ? getRiskLevelInfo(sentiment)
        : getSentimentInfo(sentiment)

    return {
        date: fmtDate(created_at),
        isRiskAnalysis,
        reportLabel: PROMPT_TYPES[type as PropmptsEnum]?.label ?? type,
        sentimentTitle: isRiskAnalysis ? 'Risk Level' : 'Sentiment',
        sentimentLabel: label,
        sentimentColor: color,
    }
}
