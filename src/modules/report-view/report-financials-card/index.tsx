import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fmtLarge, fmtPct, fmtX, fmtNum, fmtDebtEquity, fmtEstimatePeriod } from '@/lib/formatters'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { CategoryCard } from '@/modules/report-view/report-financials-card/category-card'
import { EarningsHistory } from '@/modules/report-view/report-financials-card/earnings-history'
import { InsiderActivitySummary } from '@/modules/report-view/report-financials-card/insider-activity'

type Props = {
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

// Forward analyst estimates (next quarter / year) — EPS and revenue with growth.
function getForwardRows(fundamentals: StockFundamentals | null): MetricTile[] {
    return (fundamentals?.forwardEstimates ?? []).flatMap((e) => {
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
                rawValue: e.epsGrowth ?? null,
                metricKey: 'epsGrowth',
            },
            {
                label: `${fmtEstimatePeriod(e.period)} Revenue`,
                value: revValue,
                rawValue: e.revenueGrowth ?? null,
                metricKey: 'revenueGrowthFwd',
            },
        ]
    })
}

// Multi-year revenue and net-income trend (net income graded, revenue as context).
function getRevenueTrendRows(fundamentals: StockFundamentals | null): MetricTile[] {
    return (fundamentals?.revenueTrend ?? []).flatMap((r) => {
        const year = r.endDate ? r.endDate.slice(0, 4) : '—'
        return [
            {
                label: `Net Income ${year}`,
                value: fmtLarge(r.netIncome),
                rawValue: r.netIncome ?? null,
                metricKey: 'netIncome',
            },
            { label: `Revenue ${year}`, value: fmtLarge(r.totalRevenue), context: true },
        ]
    })
}

function getGrowth(
    f: StockFinancials | null,
    fundamentals: StockFundamentals | null
): MetricTile[] {
    return [
        {
            label: 'Revenue Growth',
            value: fmtPct(f?.revenueGrowth),
            rawValue: f?.revenueGrowth ?? null,
            metricKey: 'revenueGrowth',
        },
        {
            label: 'Earnings Growth',
            value: fmtPct(f?.earningsGrowth),
            rawValue: f?.earningsGrowth ?? null,
            metricKey: 'earningsGrowth',
        },
        ...getForwardRows(fundamentals),
        ...getRevenueTrendRows(fundamentals),
        { label: 'Total Revenue', value: fmtLarge(f?.totalRevenue), context: true },
    ]
}

function getProfitability(f: StockFinancials | null): MetricTile[] {
    return [
        {
            label: 'Profit Margin',
            value: fmtPct(f?.profitMargins),
            rawValue: f?.profitMargins ?? null,
            metricKey: 'profitMargins',
        },
        {
            label: 'Operating Margin',
            value: fmtPct(f?.operatingMargins),
            rawValue: f?.operatingMargins ?? null,
            metricKey: 'operatingMargins',
        },
        {
            label: 'Operating Profit',
            value: fmtLarge(f?.ebitda),
            rawValue: f?.ebitda ?? null,
            metricKey: 'ebitda',
        },
        {
            label: 'Return on Equity',
            value: fmtPct(f?.returnOnEquity),
            rawValue: f?.returnOnEquity ?? null,
            metricKey: 'returnOnEquity',
        },
    ]
}

function getValuation(f: StockFinancials | null): MetricTile[] {
    return [
        {
            label: 'Price / Earnings',
            value: fmtX(f?.trailingPE),
            rawValue: f?.trailingPE ?? null,
            metricKey: 'trailingPE',
        },
        {
            label: 'Expected P/E',
            value: fmtX(f?.forwardPE),
            rawValue: f?.forwardPE ?? null,
            metricKey: 'forwardPE',
        },
        {
            label: 'Price vs Assets',
            value: fmtX(f?.priceToBook),
            rawValue: f?.priceToBook ?? null,
            metricKey: 'priceToBook',
        },
        {
            label: 'Dividend Yield',
            value: fmtPct(f?.dividendYield),
            rawValue: f?.dividendYield ?? null,
            metricKey: 'dividendYield',
        },
        {
            label: 'Market Volatility',
            value: fmtNum(f?.beta),
            rawValue: f?.beta ?? null,
            metricKey: 'beta',
        },
        { label: 'Company Value', value: fmtLarge(f?.marketCap), context: true },
        { label: 'Total Value incl. Debt', value: fmtLarge(f?.enterpriseValue), context: true },
    ]
}

function getHealth(f: StockFinancials | null): MetricTile[] {
    return [
        {
            label: 'Free Cash Flow',
            value: fmtLarge(f?.freeCashflow),
            rawValue: f?.freeCashflow ?? null,
            metricKey: 'freeCashflow',
        },
        {
            label: 'Operating Cash Flow',
            value: fmtLarge(f?.operatingCashflow),
            rawValue: f?.operatingCashflow ?? null,
            metricKey: 'operatingCashflow',
        },
        {
            label: 'Debt Level',
            value: fmtDebtEquity(f?.debtToEquity),
            rawValue: f?.debtToEquity ?? null,
            metricKey: 'debtToEquity',
        },
        { label: 'Total Debt', value: fmtLarge(f?.totalDebt), context: true },
    ]
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
