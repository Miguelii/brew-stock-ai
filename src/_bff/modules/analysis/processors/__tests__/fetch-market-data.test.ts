import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NewsItem } from '@/types/news'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import { buildYahooContext } from '@/_bff/modules/yahoo/helpers/build-yahoo-context.helper'
import {
    buildMarketContext,
    fetchMarketData,
    saveFreshYahooData,
} from '@/_bff/modules/analysis/processors/fetch-market-data.processor'

const {
    getYahooTickerMock,
    getYahooDataMock,
    getPriceHistoryMock,
    getNewsMock,
    saveYahooDataMock,
} = vi.hoisted(() => ({
    getYahooTickerMock: vi.fn(),
    getYahooDataMock: vi.fn(),
    getPriceHistoryMock: vi.fn(),
    getNewsMock: vi.fn(),
    saveYahooDataMock: vi.fn(),
}))

vi.mock('@/_bff/modules/yahoo/processors/get-yahoo-ticker.processor', () => ({
    getYahooTicker: getYahooTickerMock,
}))
vi.mock('@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service', () => ({
    getYahooDataWithFallbackService: getYahooDataMock,
}))
vi.mock('@/_bff/modules/yahoo/services/get-price-history.service', () => ({
    getPriceHistoryService: getPriceHistoryMock,
}))
vi.mock('@/_bff/modules/finnhub/services/get-latest-news.service', () => ({
    getLatestNewsService: getNewsMock,
}))
vi.mock('@/_bff/modules/yahoo/processors/save-yahoo-data.processor', () => ({
    saveYahooData: saveYahooDataMock,
}))

const SUPABASE = {} as SupabaseClient

const EMPTY_YAHOO_DATA: GetYahooDataResult = {
    scores: null,
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
}

const NEWS: NewsItem[] = [
    {
        category: 'company',
        datetime: 1_762_300_000,
        headline: 'Apple ships a new chip',
        id: 1,
        image: '',
        source: 'Reuters',
        summary: 'Summary',
        url: 'https://example.com/news',
    },
]

beforeEach(() => {
    vi.clearAllMocks()
})

describe('buildMarketContext', () => {
    it('returns an empty string when no source returned data', () => {
        expect(buildMarketContext({ yahoo: null, priceHistory: null, news: null })).toBe('')
        expect(buildMarketContext({ yahoo: null, priceHistory: [], news: [] })).toBe('')
    })

    it('renders news-only context on top of empty Yahoo data', () => {
        const context = buildMarketContext({ yahoo: null, priceHistory: null, news: NEWS })

        expect(context).toBe(`\n\n${buildYahooContext(EMPTY_YAHOO_DATA, null, NEWS)}`)
    })
})

describe('fetchMarketData', () => {
    it('fetches every source with the resolved ticker', async () => {
        const yahoo = { ticker: 'AAPL', data: EMPTY_YAHOO_DATA, isFresh: true }
        getYahooTickerMock.mockReturnValue(Effect.succeed('AAPL'))
        getYahooDataMock.mockReturnValue(Effect.succeed(yahoo))
        getPriceHistoryMock.mockReturnValue(Effect.succeed([{ date: 1, close: 10 }]))
        getNewsMock.mockReturnValue(Effect.succeed(NEWS))

        const result = await Effect.runPromise(fetchMarketData('apple', SUPABASE, vi.fn()))

        expect(result).toEqual({ yahoo, priceHistory: [{ date: 1, close: 10 }], news: NEWS })
        expect(getYahooDataMock).toHaveBeenCalledWith('AAPL', SUPABASE)
        expect(getPriceHistoryMock).toHaveBeenCalledWith('AAPL')
        expect(getNewsMock).toHaveBeenCalledWith('AAPL')
    })

    it('reports failed sources and falls back to the raw symbol without Yahoo data', async () => {
        const onSourceError = vi.fn()
        getYahooTickerMock.mockReturnValue(Effect.fail('search down'))
        getPriceHistoryMock.mockReturnValue(Effect.fail('chart down'))
        getNewsMock.mockReturnValue(Effect.succeed(NEWS))

        const result = await Effect.runPromise(fetchMarketData('XYZ', SUPABASE, onSourceError))

        expect(result).toEqual({ yahoo: null, priceHistory: null, news: NEWS })
        expect(getYahooDataMock).not.toHaveBeenCalled()
        expect(getNewsMock).toHaveBeenCalledWith('XYZ')
        expect(onSourceError).toHaveBeenCalledWith({
            label: 'getYahooTicker failed',
            ticker: 'XYZ',
            error: 'search down',
        })
        expect(onSourceError).toHaveBeenCalledWith({
            label: 'getPriceHistory failed',
            ticker: 'XYZ',
            error: 'chart down',
        })
    })
})

describe('saveFreshYahooData', () => {
    it('saves only fresh data', async () => {
        saveYahooDataMock.mockReturnValue(Effect.void)

        await Effect.runPromise(
            saveFreshYahooData(
                { ticker: 'AAPL', data: EMPTY_YAHOO_DATA, isFresh: false },
                SUPABASE,
                vi.fn()
            )
        )
        expect(saveYahooDataMock).not.toHaveBeenCalled()

        await Effect.runPromise(
            saveFreshYahooData(
                { ticker: 'AAPL', data: EMPTY_YAHOO_DATA, isFresh: true },
                SUPABASE,
                vi.fn()
            )
        )
        expect(saveYahooDataMock).toHaveBeenCalledWith('AAPL', EMPTY_YAHOO_DATA, SUPABASE)
    })

    it('reports a failed save instead of failing', async () => {
        const onSourceError = vi.fn()
        saveYahooDataMock.mockReturnValue(Effect.fail('db down'))

        await Effect.runPromise(
            saveFreshYahooData(
                { ticker: 'AAPL', data: EMPTY_YAHOO_DATA, isFresh: true },
                SUPABASE,
                onSourceError
            )
        )

        expect(onSourceError).toHaveBeenCalledWith({
            label: 'saveYahooData failed',
            ticker: 'AAPL',
            error: 'db down',
        })
    })
})
