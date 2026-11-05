import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooDataWithFallbackService } from '@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service'
import { getLatestNewsService } from '@/_bff/modules/finnhub/services/get-latest-news.service'
import { computeTechnicalIndicators } from '@/_bff/modules/yahoo/helpers/compute-technical-indicators.helper'
import { buildYahooContext } from '@/_bff/modules/yahoo/helpers/build-yahoo-context.helper'
import { hasAnyStockData } from '@/_bff/modules/yahoo/helpers/get-yahoo-data-with-fallback.service.helper'
import { getYahooTicker } from '@/_bff/modules/yahoo/processors/get-yahoo-ticker.processor'
import { saveYahooData } from '@/_bff/modules/yahoo/processors/save-yahoo-data.processor'
import { getPriceHistoryService } from '@/_bff/modules/yahoo/services/get-price-history.service'
import type { GetYahooDataResult, YahooDataWithFallbackResult } from '@/_bff/modules/yahoo/types'
import type { MarketData, OnSourceError } from '@/_bff/modules/analysis/types'

const EMPTY_YAHOO_DATA: GetYahooDataResult = {
    scores: null,
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
}

/**
 * Pipeable: report the failure and replace it with a fallback value, for steps
 * whose failure must never abort the caller.
 */
const recoverWith =
    <B>(onSourceError: OnSourceError, label: string, ticker: string, fallback: B) =>
    <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A | B, never, R> =>
        effect.pipe(
            Effect.tapError((error) => Effect.sync(() => onSourceError({ label, ticker, error }))),
            Effect.catch(() => Effect.succeed(fallback))
        )

/**
 * Resolve the Yahoo ticker, then fetch Yahoo data, price history and news in
 * parallel. Every source is optional: a failure yields `null` instead of
 * aborting the caller.
 */
export const fetchMarketData = Effect.fn('fetchMarketData')(function* (
    stockSymbol: string,
    supabaseClient: SupabaseClient,
    onSourceError: OnSourceError
) {
    const ticker = yield* getYahooTicker(stockSymbol).pipe(
        recoverWith(onSourceError, 'getYahooTicker failed', stockSymbol, null)
    )

    const tickerForData = ticker ?? stockSymbol

    const [yahoo, priceHistory, news] = yield* Effect.all(
        [
            ticker ? getYahooDataWithFallbackService(ticker, supabaseClient) : Effect.succeed(null),
            getPriceHistoryService(tickerForData).pipe(
                recoverWith(onSourceError, 'getPriceHistory failed', tickerForData, null)
            ),
            getLatestNewsService(tickerForData).pipe(
                recoverWith(onSourceError, 'getLatestNewsService failed', tickerForData, null)
            ),
        ],
        { concurrency: 'unbounded' }
    )

    return { yahoo, priceHistory, news } satisfies MarketData
})

/** Persist Yahoo data only when it came fresh from Yahoo. Never fails. */
export const saveFreshYahooData = Effect.fn('saveFreshYahooData')(function* (
    yahoo: YahooDataWithFallbackResult,
    supabaseClient: SupabaseClient,
    onSourceError: OnSourceError
) {
    if (!yahoo?.isFresh) return

    yield* saveYahooData(yahoo.ticker, yahoo.data, supabaseClient).pipe(
        recoverWith(onSourceError, 'saveYahooData failed', yahoo.ticker, null)
    )
})

/** The market context appended to the prompt, or `''` when no source returned data. */
export const buildMarketContext = ({ yahoo, priceHistory, news }: MarketData) => {
    const technicals =
        priceHistory && priceHistory.length > 0 ? computeTechnicalIndicators(priceHistory) : null

    const hasContext = Boolean((yahoo && hasAnyStockData(yahoo.data)) || technicals || news?.length)

    return hasContext
        ? `\n\n${buildYahooContext(yahoo?.data ?? EMPTY_YAHOO_DATA, technicals, news)}`
        : ''
}
