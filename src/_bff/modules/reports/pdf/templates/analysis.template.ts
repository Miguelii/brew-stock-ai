import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

/** The model's analysis, titled with the report type like the page card. Receives sanitized HTML. */
export const analysisTemplate = (title: string, sanitizedHtml: string): string =>
    sectionTemplate({
        title: escapeHtml(title),
        body: `<div class="analysis">${sanitizedHtml}</div>`,
    })
