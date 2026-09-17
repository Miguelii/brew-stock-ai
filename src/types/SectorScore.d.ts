import type { SignalTone } from '@/_bff/core/helpers/financial-signals.helper'

export type SectorComparison = {
    delta: number
    verdict: string
    tone: SignalTone
}

/** One company vs sector score, on a 0 to 100 scale. */
export type SectorScore = {
    label: string
    description: string
    company: number | null
    sector: number | null
    comparison: SectorComparison | null
}
