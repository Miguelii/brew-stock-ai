import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReportDTO, StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import { AnalystTargets } from '@/modules/report-view/report-financials-card/analyst-targets'
import { AnalystRatingsBar } from '@/modules/report-view/report-financials-card/analyst-ratings'
import { StockPriceChartServer } from '@/modules/report-view/report-financials-card/stock-price-chart-server'
import { StockPriceChartSkeleton } from '@/modules/report-view/report-financials-card/stock-price-chart-skeleton'

type Props = {
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
    ticker: ReportDTO['ticker'] | undefined
}

export function ReportMarketOutlookCard({ financials, fundamentals, ticker }: Props) {
    const analystRatings = fundamentals?.analystRatings ?? null

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">
                    Market &amp; Analyst Outlook
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Suspense fallback={<StockPriceChartSkeleton />}>
                    <StockPriceChartServer
                        ticker={ticker}
                        low={financials?.fiftyTwoWeekLow}
                        high={financials?.fiftyTwoWeekHigh}
                    />
                </Suspense>

                <AnalystTargets financials={financials} />

                {analystRatings && <AnalystRatingsBar ratings={analystRatings} />}
            </CardContent>
        </Card>
    )
}
