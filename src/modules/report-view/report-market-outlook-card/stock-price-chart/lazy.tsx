'use client'

import dynamic from 'next/dynamic'
import { StockPriceChartSkeleton } from './skeleton'

export const StockPriceChartLazy = dynamic(
    () =>
        import('@/modules/report-view/report-market-outlook-card/stock-price-chart').then((m) => ({
            default: m.StockPriceChart,
        })),
    {
        ssr: false,
        loading: () => <StockPriceChartSkeleton />,
    }
)
