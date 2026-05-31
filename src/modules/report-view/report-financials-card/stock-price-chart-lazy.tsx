'use client'

import dynamic from 'next/dynamic'

export const StockPriceChart = dynamic(
    () =>
        import('@/modules/report-view/report-financials-card/stock-price-chart').then((m) => ({
            default: m.StockPriceChart,
        })),
    {
        ssr: false,
        loading: () => <div className="h-52 animate-pulse rounded-sm bg-muted" />,
    }
)
