import { BRAND_WORDMARK_HTML } from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import type { ReportHeaderView } from '@/_bff/modules/reports/pdf/types'

export const headerTemplate = (stock: string, header: ReportHeaderView): string => `
    <div class="header">
        <div class="brand">${BRAND_WORDMARK_HTML}</div>
        <div class="meta">
            <strong>${header.date}</strong>
            Fundamental Analysis &amp; Sentiment Report
        </div>
    </div>

    <div class="title-section">
        <div>
            <div class="stock-ticker">${escapeHtml(stock)}</div>
            <div class="report-type">${escapeHtml(header.reportLabel)}</div>
        </div>
        <div class="sentiment-badge">
            <span class="sentiment-label">${header.sentimentTitle}</span>
            <span class="sentiment-value" style="color: ${header.sentimentColor}">${header.sentimentLabel}</span>
        </div>
    </div>`
