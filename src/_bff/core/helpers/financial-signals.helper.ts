import type { AnalystRatings, EarningsQuarter, StockFinancials } from '@/types/ReportDTO'

export type SignalTone = 'positive' | 'negative' | 'neutral'

type EarningsBeatSummary = {
    beats: number
    graded: number
}

type InsiderSignal = {
    label: 'Net buying' | 'Net selling' | 'Roughly neutral'
    tone: SignalTone
}

// Derived signals shared by the report page and the exported PDF. Presentation-free:
// each consumer maps the tone to its own color (Tailwind token or inline hex).

/** Percentage from the current price to the mean analyst target, or null when either is missing. */
export function getTargetUpsidePct(financials: StockFinancials | null): number | null {
    const current = financials?.currentPrice
    const target = financials?.targetMeanPrice

    if (current == null || target == null || current <= 0) return null

    return ((target - current) / current) * 100
}

/** Direction of recent insider trading, from the net share count (buys positive). */
export function getInsiderSignal(netShares: number | null): InsiderSignal {
    if (netShares == null || netShares === 0) return { label: 'Roughly neutral', tone: 'neutral' }

    return netShares > 0
        ? { label: 'Net buying', tone: 'positive' }
        : { label: 'Net selling', tone: 'negative' }
}

/** Whether reported EPS met the estimate, or null when either value is missing. */
export function getEarningsBeat(quarter: EarningsQuarter): boolean | null {
    if (quarter.epsActual == null || quarter.epsEstimate == null) return null

    return quarter.epsActual >= quarter.epsEstimate
}

/** Number of analysts across every recommendation bucket. */
export function getAnalystRatingsTotal(ratings: AnalystRatings): number {
    return ratings.strongBuy + ratings.buy + ratings.hold + ratings.sell + ratings.strongSell
}

/** How many quarters beat the estimate, out of the quarters that can be judged. */
export function getEarningsBeatSummary(history: EarningsQuarter[]): EarningsBeatSummary {
    const results = history.flatMap((q) => {
        const beat = getEarningsBeat(q)
        return beat === null ? [] : [beat]
    })

    return { beats: results.filter(Boolean).length, graded: results.length }
}
