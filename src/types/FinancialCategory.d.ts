import type { MetricTile } from '@/types/MetricTile'

export type FinancialCategory = {
    id: 'valuation' | 'profitability' | 'health' | 'growth'
    title: string
    question: string
    // Every metric, graded together; tiles and context are the ones each view shows
    metrics: MetricTile[]
    tiles: MetricTile[]
    context: MetricTile[]
}
