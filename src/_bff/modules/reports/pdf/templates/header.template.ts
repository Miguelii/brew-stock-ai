import { BRAND_WORDMARK_HTML } from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import type { ReportHeaderView } from '@/_bff/modules/reports/pdf/types'

export const headerTemplate = (stock: string, header: ReportHeaderView): string => `
    <div class="topbar">
        <div class="brand">${BRAND_WORDMARK_HTML}</div>
        <div class="topbar-meta">
            <strong>${header.date}</strong>
            Fundamental Analysis &amp; Sentiment Report
        </div>
    </div>

    <div class="hero">
        <div>
            <div class="eyebrow">${escapeHtml(header.reportLabel)}</div>
            <div class="display hero-ticker">${escapeHtml(stock)}</div>
            <div class="hero-subtitle">Fundamental Analysis &amp; Sentiment Report</div>
            <div class="eyebrow" style="margin-top:6px;">Generated ${header.date}</div>
        </div>
        <div class="hero-sentiment">
            <span class="eyebrow">${header.sentimentTitle}</span>
            <span class="display hero-sentiment-value" style="color:${header.sentimentColor};">${header.sentimentLabel}</span>
        </div>
    </div>`
