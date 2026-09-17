import { sanitizeReportHtml } from '@/_bff/core/helpers/sanitize-report-html.helper'
import { getReportHeader } from '@/_bff/modules/reports/pdf/helpers/report-header.helper'
import { getOverviewView } from '@/_bff/modules/reports/pdf/helpers/overview.helper'
import { getSigDevView } from '@/_bff/modules/reports/pdf/helpers/sig-dev.helper'
import { documentTemplate } from '@/_bff/modules/reports/pdf/templates/document.template'
import { headerTemplate } from '@/_bff/modules/reports/pdf/templates/header.template'
import { overviewTemplate } from '@/_bff/modules/reports/pdf/templates/overview.template'
import { marketOutlookTemplate } from '@/_bff/modules/reports/pdf/templates/market-outlook.template'
import { keyMetricsTemplate } from '@/_bff/modules/reports/pdf/templates/key-metrics.template'
import { analysisTemplate } from '@/_bff/modules/reports/pdf/templates/analysis.template'
import { sigDevTemplate } from '@/_bff/modules/reports/pdf/templates/sig-dev.template'
import { expertCoverageTemplate } from '@/_bff/modules/reports/pdf/templates/expert-coverage.template'
import { sectorScoresTemplate } from '@/_bff/modules/reports/pdf/templates/sector-scores.template'
import { footerTemplate } from '@/_bff/modules/reports/pdf/templates/footer.template'
import type { BuildPdfHtmlParams } from '@/_bff/modules/reports/pdf/types'

/**
 * Build the HTML document that Puppeteer prints as the report PDF. Sections follow the
 * report page order, and each template returns an empty string when it has no data.
 */
export function buildPdfHtml(params: BuildPdfHtmlParams, now = new Date().toISOString()): string {
    const { stock, ai_response, sentiment, stockData } = params
    const header = getReportHeader(params)
    const analysisHtml = sanitizeReportHtml(ai_response)
    const financials = stockData?.financials ?? null
    const fundamentals = stockData?.fundamentals ?? null

    return documentTemplate(
        [
            headerTemplate(stock, header),
            overviewTemplate(getOverviewView(analysisHtml, sentiment, header.isRiskAnalysis)),
            marketOutlookTemplate(financials, fundamentals),
            keyMetricsTemplate(financials, fundamentals),
            analysisTemplate(header.reportLabel, analysisHtml),
            sigDevTemplate(getSigDevView(stockData?.sig_dev, now)),
            expertCoverageTemplate(stockData?.reports),
            sectorScoresTemplate(stockData?.scores),
            footerTemplate(header.date),
        ].join('\n')
    )
}
