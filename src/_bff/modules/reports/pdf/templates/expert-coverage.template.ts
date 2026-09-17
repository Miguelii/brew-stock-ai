import { EXPERT_REPORT_SUMMARY_MAX_CHARS } from '@/_bff/core/constants/expert-reports.constants'
import { fmtDate, truncateText } from '@/_bff/core/utils/formatters.utils'
import type { StockReports } from '@/types/ReportDTO'
import { PDF_COLORS } from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

function reportItemTemplate(item: StockReports): string {
    const date = item.reportDate ? ` · ${fmtDate(item.reportDate, 'short')}` : ''
    const summary = item.reportTitle
        ? `<p class="expert-summary">${escapeHtml(truncateText(item.reportTitle, EXPERT_REPORT_SUMMARY_MAX_CHARS))}</p>`
        : ''

    return `
            <li class="expert-item">
                <div class="eyebrow"><span style="color:${PDF_COLORS.blue};">${escapeHtml(item.provider)}</span>${date}</div>
                <div class="expert-title">${escapeHtml(item.title)}</div>
                ${summary}
            </li>`
}

/** "What Experts Are Saying": recent analyst reports with their summaries. Empty when there are none. */
export function expertCoverageTemplate(reports: StockReports[] | null | undefined): string {
    if (!reports?.length) return ''

    const [first, ...rest] = reports.map((item) => reportItemTemplate(item))

    return sectionTemplate({
        title: 'What Experts Are Saying',
        subtitle: 'Recent reports and research from professional investors and analysts',
        lead: `<ul class="expert-list">${first}</ul>`,
        body: rest.length > 0 ? `<ul class="expert-list">${rest.join('')}</ul>` : '',
    })
}
