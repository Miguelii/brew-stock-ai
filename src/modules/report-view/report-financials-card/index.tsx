import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { fmtLarge, fmtPct, fmtX, fmtNum, fmtPrice } from '@/lib/formatters'
import type { StockFinancials } from '@/types/ReportDTO'
import { StockPriceChart } from '@/modules/report-view/report-financials-card/stock-price-chart'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { Group } from '@/modules/report-view/report-financials-card/group'

type Props = {
    financials: StockFinancials | null
    ticker: string | null | undefined
}

export function ReportFinancialsCard({ financials, ticker }: Props) {
    const f = financials

    const upside =
        f?.targetMeanPrice != null && f?.currentPrice != null && f.currentPrice > 0
            ? (((f.targetMeanPrice - f.currentPrice) / f.currentPrice) * 100).toFixed(1)
            : null

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
                {/* 52-Week Price Chart */}
                {ticker ? (
                    <StockPriceChart
                        ticker={ticker}
                        low={f?.fiftyTwoWeekLow}
                        high={f?.fiftyTwoWeekHigh}
                    />
                ) : null}

                {/* Analyst Price Targets */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            What analysts think the stock is worth
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                            <span className="text-[11px] leading-none text-muted-foreground">
                                Lowest analyst target
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
                                Average analyst target
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
                                Highest analyst target
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

                <Group title="Revenue &amp; Profitability" tiles={growthStory} cols={3} />
                <Group title="Valuation &amp; Returns" tiles={worthIt} cols={4} />
                <Group title="Financial Health" tiles={financialHealth} cols={4} />
            </CardContent>
        </Card>
    )
}
