import { unstable_cache } from 'next/cache'
import { GET_PRICE_HISTORY_CACHE_KEY, GET_PRICE_HISTORY_TTL } from '../constants'
import type { PricePoint } from '../types'

export const fetchHistoryRaw = async (ticker: string): Promise<PricePoint[]> => {
    const { default: YahooFinance } = await import('yahoo-finance2')
    const yf = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] })
    const period1 = new Date()
    period1.setFullYear(period1.getFullYear() - 1)
    const result = await yf.chart(ticker, { period1, interval: '1d' })
    return result.quotes
        .filter((r) => r.close != null)
        .map((r) => ({ date: r.date.getTime(), close: r.close! }))
}

export const fetchHistoryCached = (ticker: string) =>
    unstable_cache(() => fetchHistoryRaw(ticker), [GET_PRICE_HISTORY_CACHE_KEY, ticker], {
        revalidate: GET_PRICE_HISTORY_TTL,
    })
