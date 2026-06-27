import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import { CategoryCard } from '@/modules/report-view/report-financials-card/category-card'
import { EarningsHistory } from '@/modules/report-view/report-financials-card/earnings-history'
import { InsiderActivitySummary } from '@/modules/report-view/report-financials-card/insider-activity'
import {
    getGrowth,
    getHealth,
    getProfitability,
    getValuation,
} from '@/modules/report-view/report-financials-card/metric-builders'

type Props = {
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

export function ReportFinancialsCard({ financials, fundamentals }: Props) {
    const earningsHistory = fundamentals?.earningsHistory ?? []
    const insiders = fundamentals?.insiders ?? null

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <CategoryCard
                        title="Valuation"
                        question="Cheap or expensive?"
                        metrics={getValuation(financials)}
                    />
                    <CategoryCard
                        title="Profitability"
                        question="Does it make good money?"
                        metrics={getProfitability(financials)}
                    />
                    <CategoryCard
                        title="Financial Health"
                        question="Can it cover its debts?"
                        metrics={getHealth(financials)}
                    />
                </div>

                <CategoryCard
                    title="Growth"
                    question="Is it growing?"
                    metrics={getGrowth(financials, fundamentals)}
                />

                {earningsHistory.length > 0 && <EarningsHistory history={earningsHistory} />}

                {insiders && <InsiderActivitySummary insiders={insiders} />}
            </CardContent>
        </Card>
    )
}
