import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fmtLarge, fmtPct, fmtX, fmtNum, fmtEstimatePeriod } from '@/lib/formatters'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { Group } from '@/modules/report-view/report-financials-card/group'
import { EarningsHistory } from '@/modules/report-view/report-financials-card/earnings-history'
import { InsiderActivitySummary } from '@/modules/report-view/report-financials-card/insider-activity'

type Props = {
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

export function ReportFinancialsCard({ financials, fundamentals }: Props) {
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

    // Forward analyst estimates (next quarter / year) — EPS and revenue with growth.
    const forwardTiles: MetricTile[] = (fundamentals?.forwardEstimates ?? []).flatMap((e) => {
        const epsValue =
            e.epsAvg != null
                ? `${fmtNum(e.epsAvg)}${e.epsGrowth != null ? ` · ${fmtPct(e.epsGrowth)}` : ''}`
                : 'N/A'
        const revValue =
            e.revenueAvg != null
                ? `${fmtLarge(e.revenueAvg)}${e.revenueGrowth != null ? ` · ${fmtPct(e.revenueGrowth)}` : ''}`
                : 'N/A'
        return [
            {
                label: `${fmtEstimatePeriod(e.period)} EPS`,
                value: epsValue,
                colored: true,
                rawValue: e.epsGrowth ?? null,
            },
            {
                label: `${fmtEstimatePeriod(e.period)} Revenue`,
                value: revValue,
                colored: true,
                rawValue: e.revenueGrowth ?? null,
            },
        ]
    })

    // Multi-year revenue and net-income trend.
    const revenueTiles: MetricTile[] = (fundamentals?.revenueTrend ?? []).flatMap((r) => {
        const year = r.endDate ? r.endDate.slice(0, 4) : '—'
        return [
            { label: `Revenue ${year}`, value: fmtLarge(r.totalRevenue) },
            {
                label: `Net Income ${year}`,
                value: fmtLarge(r.netIncome),
                colored: true,
                rawValue: r.netIncome ?? null,
            },
        ]
    })

    const earningsHistory = fundamentals?.earningsHistory ?? []
    const insiders = fundamentals?.insiders ?? null

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Group title="Revenue &amp; Profitability" tiles={growthStory} cols={3} />
                <Group title="Valuation &amp; Returns" tiles={worthIt} cols={4} />
                <Group title="Financial Health" tiles={financialHealth} cols={4} />

                {forwardTiles.length > 0 && (
                    <Group title="Forward Estimates" tiles={forwardTiles} cols={4} />
                )}

                {earningsHistory.length > 0 && <EarningsHistory history={earningsHistory} />}

                {revenueTiles.length > 0 && (
                    <Group title="Revenue Trend" tiles={revenueTiles} cols={4} />
                )}

                {insiders && <InsiderActivitySummary insiders={insiders} />}
            </CardContent>
        </Card>
    )
}
