import type { MetricKey } from '@/modules/report-view/report-financials-card/metric-quality'

export type MetricTile = {
    label: string
    value: string
    rawValue?: number | null
    /** Drives the good/caution/concern quality signal, verdict word, and category grade. */
    metricKey?: MetricKey
    /** Optional plain-language hint shown under the value (overrides the metric's default help). */
    helper?: string
    /** Context-only row (an absolute size like Market Cap): shown muted, never graded. */
    context?: boolean
}
