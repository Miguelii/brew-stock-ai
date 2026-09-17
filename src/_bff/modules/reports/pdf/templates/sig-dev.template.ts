import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import type { SigDevView } from '@/_bff/modules/reports/pdf/types'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

function calendarTemplate(calendar: NonNullable<SigDevView['calendar']>): string {
    return `
        <div class="calendar">
            <div class="eyebrow" style="color:inherit;">${calendar.month}</div>
            <div class="display calendar-day">${calendar.day}</div>
            <div class="calendar-year">${calendar.year}</div>
        </div>`
}

/** "What's Happening Now": the most notable recent event. Empty when there is no headline. */
export function sigDevTemplate(view: SigDevView | null): string {
    if (!view) return ''

    const age = view.age ? ` · ${view.age}` : ''

    return sectionTemplate({
        title: "What's Happening Now",
        subtitle: 'The most notable recent event our engine identified for this company',
        isPaper: true,
        isCompact: true,
        body: `
        <div class="sigdev">
            ${view.calendar ? calendarTemplate(view.calendar) : ''}
            <div>
                <div class="eyebrow"><span class="dot"></span>Latest development${age}</div>
                <div class="sigdev-headline">${escapeHtml(view.headline)}</div>
            </div>
        </div>`,
    })
}
