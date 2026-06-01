import { createCaller } from '@/server/caller'
import { StockPriceChart } from '@/modules/report-view/report-financials-card/stock-price-chart-lazy'
import type { ReportDTO } from '@/types/ReportDTO'

type PricePoint = { date: number; close: number }

type Props = {
    ticker: ReportDTO['ticker'] | undefined
    low?: number | null
    high?: number | null
}

export async function StockPriceChartServer({ ticker, low, high }: Props) {
    let data: PricePoint[] = []

    if (ticker) {
        const caller = await createCaller()
        data = await caller.priceHistory({ ticker }).catch(() => [])
    }

    return <StockPriceChart data={data} low={low} high={high} />
}
