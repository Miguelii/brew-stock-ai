import { createCaller } from '@/_trpc/server/caller'
import type { ReportDTO } from '@/types/ReportDTO'
import { StockPriceChartLazy } from './lazy'

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
        data = await caller.yahoo.getPriceHistory({ ticker }).catch(() => [])
    }

    return <StockPriceChartLazy data={data} low={low} high={high} />
}
