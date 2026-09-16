import { fmtDate } from '@/_bff/core/utils/formatters.utils'
import type { StockReports } from '@/types/ReportDTO'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

function reportItemTemplate(item: StockReports): string {
    const date = item.reportDate ? ` · ${fmtDate(item.reportDate, 'short')}` : ''

    return `
            <li class="news-item">
                <p class="news-headline">${escapeHtml(item.title)}</p>
                <p class="news-text">${escapeHtml(item.reportTitle)}</p>
                <span class="news-meta">${escapeHtml(item.provider)}${date}</span>
            </li>`
}

/** "What Experts Are Saying": recent analyst reports. Empty when there are none. */
export function expertCoverageTemplate(reports: StockReports[] | null | undefined): string {
    if (!reports?.length) return ''

    return sectionTemplate({
        title: 'What Experts Are Saying',
        subtitle: 'Recent reports and research from professional investors and analysts',
        body: `<ul class="news-list">${reports.map((item) => reportItemTemplate(item)).join('')}
        </ul>`,
    })
}
