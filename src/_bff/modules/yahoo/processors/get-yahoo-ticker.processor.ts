import { Effect } from 'effect'
import { YahooClientError, YahooSearchError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'

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

    // Non-Yahoo results (external links) carry no trading symbol
    const yahooQuotes = result.quotes.filter((q) => q.isYahooFinance === true)

    const filterByType = (type: string) =>
        yahooQuotes.filter((q) => q.quoteType === type).map((q) => q.symbol)

    const allSymbols = yahooQuotes.map((q) => q.symbol)

    const ticker =
        filterByType('EQUITY').at(0) ?? filterByType('ETF').at(0) ?? allSymbols.at(0) ?? stockSymbol

    return ticker
})
