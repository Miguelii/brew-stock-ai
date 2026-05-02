import 'server-only'

import { Effect } from 'effect'
import YahooFinance from 'yahoo-finance2'
import { YahooClientError, YahooSearchError } from '@/services/utils/tagged-errors'

export const getYahooTicker = Effect.fn('getYahooTicker')(function* (stockSymbol: string) {
    const yahooClient = yield* Effect.try({
        try: () => new YahooFinance({ suppressNotices: ['yahooSurvey'] }),
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

    // Among equities, prefer the ticker with the most complete data.
    // e.g. GOOGL over GOOG — same base prefix but GOOGL has fuller Yahoo Finance data.
    // Yahoo already orders by relevance score, so we only override when one is a prefix of the other.
    const best = equitySymbols.reduce((prev, curr) => {
        const sameBase = curr.startsWith(prev) || prev.startsWith(curr)
        return sameBase && curr.length > prev.length ? curr : prev
    })

    return best
})
