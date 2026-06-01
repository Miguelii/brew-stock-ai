import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fmtLarge, fmtPct, fmtX, fmtNum } from '@/lib/formatters'
import type { ReportDTO, StockFinancials } from '@/types/ReportDTO'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { Group } from '@/modules/report-view/report-financials-card/group'
import { AnalystTargets } from '@/modules/report-view/report-financials-card/analyst-targets'
import { StockPriceChartServer } from '@/modules/report-view/report-financials-card/stock-price-chart-server'
import { StockPriceChartSkeleton } from '@/modules/report-view/report-financials-card/stock-price-chart-skeleton'

type Props = {
    financials: StockFinancials | null
    ticker: ReportDTO['ticker'] | undefined
}

export function ReportFinancialsCard({ financials, ticker }: Props) {
    const f = financials

    const growthStory: MetricTile[] = [
        { label: 'Total Revenue', value: fmtLarge(f?.totalRevenue) },
        {
            label: 'Revenue Growth',
            value: fmtPct(f?.revenueGrowth),
            colored: true,
            rawValue: f?.revenueGrowth ?? null,
        },
        {
            label: 'Earnings Growth',
            value: fmtPct(f?.earningsGrowth),
            colored: true,
            rawValue: f?.earningsGrowth ?? null,
        },
        {
            label: 'Operating Profit',
            value: fmtLarge(f?.ebitda),
            colored: true,
            rawValue: f?.ebitda ?? null,
        },
        {
            label: 'Profit Margin',
            value: fmtPct(f?.profitMargins),
            colored: true,
            rawValue: f?.profitMargins ?? null,
        },
        {
            label: 'Operating Margin',
            value: fmtPct(f?.operatingMargins),
            colored: true,
            rawValue: f?.operatingMargins ?? null,
        },
    ]

    const worthIt: MetricTile[] = [
        {
            label: 'Company Value',
            value: fmtLarge(f?.marketCap),
        },
        {
            label: 'Total Value incl. Debt',
            value: fmtLarge(f?.enterpriseValue),
        },
        {
            label: 'Price / Earnings',
            value: fmtX(f?.trailingPE),
        },
        {
            label: 'Expected P/E',
            value: fmtX(f?.forwardPE),
        },
        {
            label: 'Price vs Assets',
            value: fmtX(f?.priceToBook),
        },
        {
            label: 'Market Volatility',
            value: fmtNum(f?.beta),
        },
        {
            label: 'Dividend Yield',
            value: fmtPct(f?.dividendYield),
        },
        {
            label: 'Return on Equity',
            value: fmtPct(f?.returnOnEquity),
            colored: true,
            rawValue: f?.returnOnEquity ?? null,
        },
    ]

    const financialHealth: MetricTile[] = [
        {
            label: 'Free Cash Flow',
            value: fmtLarge(f?.freeCashflow),
            colored: true,
            rawValue: f?.freeCashflow ?? null,
        },
        {
            label: 'Operating Cash Flow',
            value: fmtLarge(f?.operatingCashflow),
            colored: true,
            rawValue: f?.operatingCashflow ?? null,
        },
        {
            label: 'Total Debt',
            value: fmtLarge(f?.totalDebt),
        },
        {
            label: 'Debt Level',
            value: fmtNum(f?.debtToEquity),
        },
    ]

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Suspense fallback={<StockPriceChartSkeleton />}>
                    <StockPriceChartServer
                        ticker={ticker}
                        low={f?.fiftyTwoWeekLow}
                        high={f?.fiftyTwoWeekHigh}
                    />
                </Suspense>

                <AnalystTargets financials={financials} />

                <Group title="Revenue &amp; Profitability" tiles={growthStory} cols={3} />
                <Group title="Valuation &amp; Returns" tiles={worthIt} cols={4} />
                <Group title="Financial Health" tiles={financialHealth} cols={4} />
            </CardContent>
        </Card>
    )
}
