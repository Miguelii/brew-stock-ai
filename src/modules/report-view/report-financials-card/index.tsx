import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { fmtLarge, fmtPct, fmtX, fmtNum, fmtPrice } from '@/lib/formatters'
import type { StockFinancials } from '@/types/ReportDTO'
import { RangeBar } from '@/modules/report-view/report-financials-card/range-bar'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { Group } from '@/modules/report-view/report-financials-card/group'

type Props = {
    financials: StockFinancials | null
}

export function ReportFinancialsCard({ financials }: Props) {
    const f = financials

    const upside =
        f?.targetMeanPrice != null && f?.currentPrice != null && f.currentPrice > 0
            ? (((f.targetMeanPrice - f.currentPrice) / f.currentPrice) * 100).toFixed(1)
            : null

    const revenue: MetricTile[] = [
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
        { label: 'EBITDA', value: fmtLarge(f?.ebitda), colored: true, rawValue: f?.ebitda ?? null },
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

    const valuation: MetricTile[] = [
        { label: 'Market Cap', value: fmtLarge(f?.marketCap) },
        { label: 'Enterprise Value', value: fmtLarge(f?.enterpriseValue) },
        { label: 'P/E (TTM)', value: fmtX(f?.trailingPE) },
        { label: 'Forward P/E', value: fmtX(f?.forwardPE) },
        { label: 'Price/Book', value: fmtX(f?.priceToBook) },
        { label: 'Beta', value: fmtNum(f?.beta) },
        { label: 'Dividend Yield', value: fmtPct(f?.dividendYield) },
        {
            label: 'ROE',
            value: fmtPct(f?.returnOnEquity),
            colored: true,
            rawValue: f?.returnOnEquity ?? null,
        },
    ]

    const cashflow: MetricTile[] = [
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
        { label: 'Total Debt', value: fmtLarge(f?.totalDebt) },
        { label: 'Debt/Equity', value: fmtNum(f?.debtToEquity) },
    ]

    const hasRangeData =
        f?.fiftyTwoWeekLow != null && f?.fiftyTwoWeekHigh != null && f?.currentPrice != null

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {/* 52-Week Range */}
                <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        52-Week Range
                    </span>
                    <RangeBar
                        low={f?.fiftyTwoWeekLow}
                        high={f?.fiftyTwoWeekHigh}
                        current={f?.currentPrice}
                        lowLabel={fmtPrice(f?.fiftyTwoWeekLow)}
                        highLabel={fmtPrice(f?.fiftyTwoWeekHigh)}
                    />
                    <div className="flex items-center gap-4 flex-wrap">
                        {hasRangeData ? (
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-accent-blue" />
                                <span className="text-xs text-muted-foreground">
                                    Current {fmtPrice(f!.currentPrice)}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <div
                                    className="size-2.5 rounded-full"
                                    style={{
                                        backgroundImage:
                                            'repeating-linear-gradient(45deg, #d1d5db 0px, #d1d5db 3px, transparent 3px, transparent 8px)',
                                    }}
                                />
                                <span className="text-xs text-muted-foreground">Data N/A</span>
                            </div>
                        )}
                        {f?.beta != null && (
                            <span className="text-xs text-muted-foreground">
                                Beta {fmtNum(f.beta)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Analyst Price Targets */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Analyst Price Targets
                        </span>
                        {upside !== null && (
                            <span
                                className={cn(
                                    'text-xs font-semibold',
                                    Number.parseFloat(upside) >= 0
                                        ? 'text-green-600 dark:text-green-500'
                                        : 'text-red-500'
                                )}
                            >
                                {Number.parseFloat(upside) >= 0 ? '+' : ''}
                                {upside}% to consensus
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                            <span className="text-[11px] leading-none text-muted-foreground">
                                Bear target
                            </span>
                            <span
                                className={cn(
                                    'text-sm font-semibold leading-tight',
                                    f?.targetLowPrice == null
                                        ? 'text-muted-foreground'
                                        : 'text-primary'
                                )}
                            >
                                {fmtPrice(f?.targetLowPrice)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                            <span className="text-[11px] leading-none text-muted-foreground">
                                Analyst consensus
                            </span>
                            <span
                                className={cn(
                                    'text-sm font-semibold leading-tight',
                                    f?.targetMeanPrice == null
                                        ? 'text-muted-foreground'
                                        : 'text-primary'
                                )}
                            >
                                {fmtPrice(f?.targetMeanPrice)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                            <span className="text-[11px] leading-none text-muted-foreground">
                                Bull target
                            </span>
                            <span
                                className={cn(
                                    'text-sm font-semibold leading-tight',
                                    f?.targetHighPrice == null
                                        ? 'text-muted-foreground'
                                        : 'text-primary'
                                )}
                            >
                                {fmtPrice(f?.targetHighPrice)}
                            </span>
                        </div>
                    </div>
                </div>
                <Group title="Revenue &amp; Profitability" tiles={revenue} cols={3} />
                <Group title="Valuation &amp; Returns" tiles={valuation} cols={4} />
                <Group title="Cash Flow &amp; Debt" tiles={cashflow} cols={4} />
            </CardContent>
        </Card>
    )
}
