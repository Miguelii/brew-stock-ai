import type { StockSigDev } from '@/types/ReportDTO'
import { formatEventAge, getCalendarParts, getDayDiff } from '@/_bff/core/utils/event-dates.utils'
import type { SigDevView } from '@/_bff/modules/reports/pdf/types'

/** Headline, date tile and age of the latest development, as of `now` (the export time). */
export function getSigDevView(
    sigDev: StockSigDev | null | undefined,
    now: string
): SigDevView | null {
    if (!sigDev?.headline) return null

    return {
        headline: sigDev.headline,
        calendar: sigDev.date ? getCalendarParts(sigDev.date) : null,
        age: sigDev.date ? formatEventAge(getDayDiff(sigDev.date, now)) : null,
    }
}
