import 'server-only'

import { Effect } from 'effect'
import { YahooClientError, YahooSearchError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'

export const getYahooTicker = Effect.fn('getYahooTicker')(function* (stockSymbol: string) {
    const yahooClient = yield* Effect.tryPromise({
        try: async () => {
            const { default: YahooFinance } = await import('yahoo-finance2')
            return new YahooFinance({ suppressNotices: ['yahooSurvey'] })
        },
        catch: (cause) =>
            new YahooClientError({
                symbol: `|${stockSymbol}|`,
                cause,
                error_hash: ErrorCode.YAHOO_SEARCH_CLIENT,
            }),
    })

    const result = yield* Effect.tryPromise({
        try: () => yahooClient.search(stockSymbol, { quotesCount: 5, newsCount: 0 }),
        catch: (cause) =>
            new YahooSearchError({
                symbol: `|${stockSymbol}|`,
                cause,
                error_hash: ErrorCode.YAHOO_SEARCH_REQUEST,
            }),
    })

    const filterByType = (type: string) =>
        result.quotes
            .filter((q) => 'quoteType' in q && q.quoteType === type && q.isYahooFinance === true)
            .map((q) => q.symbol as string)

    const allSymbols = result.quotes.map((q) => q.symbol as string)

    const ticker =
        filterByType('EQUITY').at(0) ?? filterByType('ETF').at(0) ?? allSymbols.at(0) ?? stockSymbol

    return ticker
})
