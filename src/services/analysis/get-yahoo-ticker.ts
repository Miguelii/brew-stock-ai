import 'server-only'

import { Effect } from 'effect'
import { YahooClientError, YahooSearchError } from '@/services/errors'

export const getYahooTicker = Effect.fn('getYahooTicker')(function* (stockSymbol: string) {
    const yahooClient = yield* Effect.tryPromise({
        try: async () => {
            const { default: YahooFinance } = await import('yahoo-finance2')
            return new YahooFinance({ suppressNotices: ['yahooSurvey'] })
        },
        catch: (cause) => new YahooClientError({ cause, error_hash: 'yhosrchclnt' }),
    })

    const result = yield* Effect.tryPromise({
        try: () => yahooClient.search(stockSymbol, { quotesCount: 5, newsCount: 0 }),
        catch: (cause) => new YahooSearchError({ cause, error_hash: 'yhosrchreq' }),
    })

    // Extract symbol strings from EQUITY results only
    const equitySymbols = result.quotes
        .filter((q) => 'quoteType' in q && q.quoteType === 'EQUITY' && q.isYahooFinance === true)
        .map((q) => ('symbol' in q && typeof q.symbol === 'string' ? q.symbol : null))
        .filter((s): s is string => s !== null)

    if (equitySymbols.length === 0) return stockSymbol

    const ticker = equitySymbols?.at(0) as string

    return ticker
})
