import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import { gradeCategory } from '@/_bff/core/helpers/metric-quality.helper'
import { CategorySection } from '@/modules/report-view/report-financials-card/category-section'
import { EarningsHistory } from '@/modules/report-view/report-financials-card/earnings-history'
import { GrowthEstimates } from '@/modules/report-view/report-financials-card/growth-estimates'
import { InsiderActivitySummary } from '@/modules/report-view/report-financials-card/insider-activity'
import { RevenueTrendChart } from '@/modules/report-view/report-financials-card/revenue-trend-chart'
import { ScoreBoard } from '@/modules/report-view/report-financials-card/score-board'
import { useFinancialCategories } from '@/modules/report-view/report-financials-card/hooks/use-financial-categories'

type Props = {
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

export function ReportFinancialsCard({ financials, fundamentals }: Props) {
    const categories = useFinancialCategories(financials, fundamentals)

    const grades = new Map(categories.map((c) => [c.id, gradeCategory(c.metrics)]))

    const earningsHistory = fundamentals?.earningsHistory ?? []
    const insiders = fundamentals?.insiders ?? null
    const hasTrackRecord = earningsHistory.length > 0 || insiders !== null

    return (
        <Card className="h-fit gap-0">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">Key Financial Metrics</CardTitle>
                <CardDescription className="text-xs text-ink/60">
                    How the company scores on price, profits, balance sheet and growth
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-10 pt-5">
                <ScoreBoard
                    items={categories.map(({ id, title }) => ({
                        id,
                        title,
                        grade: grades.get(id) ?? null,
                    }))}
                />

                {categories.map(({ id, title, question, tiles, context }) => (
                    <CategorySection
                        key={id}
                        id={id}
                        title={title}
                        question={question}
                        grade={grades.get(id) ?? null}
                        tiles={tiles}
                        context={context}
                    >
                        {id === 'growth' && (
                            <>
                                <GrowthEstimates estimates={fundamentals?.forwardEstimates ?? []} />
                                <RevenueTrendChart trend={fundamentals?.revenueTrend ?? []} />
                            </>
                        )}
                    </CategorySection>
                ))}

                {hasTrackRecord && (
                    <div
                        className={cn(
                            'grid gap-10',
                            earningsHistory.length > 0 &&
                                insiders &&
                                'lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6'
                        )}
                    >
                        <EarningsHistory history={earningsHistory} />
                        {insiders && <InsiderActivitySummary insiders={insiders} />}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
