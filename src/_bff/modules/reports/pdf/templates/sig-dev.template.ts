import { fmtDate } from '@/_bff/core/utils/formatters.utils'
import type { StockSigDev } from '@/types/ReportDTO'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

/** "What's Happening Now": the most notable recent event. Empty when there is no headline. */
export function sigDevTemplate(sigDev: StockSigDev | null | undefined): string {
    if (!sigDev?.headline) return ''

    const date = sigDev.date ? `<span class="sig-dev-date">${fmtDate(sigDev.date)}</span>` : ''

    return sectionTemplate({
        title: "What's Happening Now",
        subtitle: 'The most notable recent event our engine identified for this company',
        body: `<p class="sig-dev-headline">${escapeHtml(sigDev.headline)}</p>
        ${date}`,
    })
}
