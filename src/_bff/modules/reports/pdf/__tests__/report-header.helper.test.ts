import { describe, it, expect } from 'vitest'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import { getRiskLevelInfo, getSentimentInfo } from '@/_bff/core/helpers/sentiment.helper'
import { getReportHeader } from '@/_bff/modules/reports/pdf/helpers/report-header.helper'

const created_at = '2024-06-15T10:00:00Z'

describe('getReportHeader', () => {
    it('uses the sentiment scale for regular reports', () => {
        const { label, color } = getSentimentInfo(72)

        expect(
            getReportHeader({ type: PropmptsEnum.STOCK_ANALYSIS, sentiment: 72, created_at })
        ).toEqual({
            date: 'June 15, 2024',
            reportLabel: 'Full Wall Street Style Stock Analysis',
            sentimentTitle: 'Sentiment',
            sentimentLabel: label,
            sentimentColor: color,
        })
    })

    it('uses the risk scale for risk reports', () => {
        const { label, color } = getRiskLevelInfo(30)

        expect(
            getReportHeader({ type: PropmptsEnum.RISK_ANALYSIS, sentiment: 30, created_at })
        ).toMatchObject({
            sentimentTitle: 'Risk Level',
            sentimentLabel: label,
            sentimentColor: color,
        })
    })

    it('falls back to the raw type when it has no label', () => {
        expect(
            getReportHeader({
                type: 'custom-type' as PropmptsEnum,
                sentiment: 50,
                created_at,
            }).reportLabel
        ).toBe('custom-type')
    })
})
