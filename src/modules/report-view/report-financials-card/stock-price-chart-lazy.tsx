'use client'

import dynamic from 'next/dynamic'
import { StockPriceChartSkeleton } from './stock-price-chart-skeleton'

export const StockPriceChart = dynamic(
    () =>
        import('@/modules/report-view/report-financials-card/stock-price-chart').then((m) => ({
            default: m.StockPriceChart,
        })),
    {
        ssr: false,
        loading: () => <StockPriceChartSkeleton />,
    }
)
