import { sanitizeReportHtml } from '@/_bff/core/helpers/sanitize-report-html.helper'
import { getReportHeader } from '@/_bff/modules/reports/pdf/helpers/report-header.helper'
import { documentTemplate } from '@/_bff/modules/reports/pdf/templates/document.template'
import { headerTemplate } from '@/_bff/modules/reports/pdf/templates/header.template'
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
export function buildPdfHtml(params: BuildPdfHtmlParams): string {
    const { stock, ai_response, stockData } = params
    const header = getReportHeader(params)
    const financials = stockData?.financials ?? null
    const fundamentals = stockData?.fundamentals ?? null

    return documentTemplate(
        [
            headerTemplate(stock, header),
            marketOutlookTemplate(financials, fundamentals),
            keyMetricsTemplate(financials, fundamentals),
            analysisTemplate(sanitizeReportHtml(ai_response)),
            sigDevTemplate(stockData?.sig_dev),
            expertCoverageTemplate(stockData?.reports),
            sectorScoresTemplate(stockData?.scores),
            footerTemplate(header.date),
        ].join('\n')
    )
}
