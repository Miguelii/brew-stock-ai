import { Effect, Fiber } from 'effect'
import { createDBAdminClient } from '@/_bff/core/db'
import { Logger } from '@/_bff/lib/server-logger'
import {
    buildMarketContext,
    fetchMarketData,
    saveFreshYahooData,
} from '@/_bff/modules/analysis/processors/fetch-market-data.processor'
import { resolvePromptTemplate } from '@/_bff/modules/analysis/processors/resolve-prompt-template.processor'
import { buildAnalysisBrief } from '@/_bff/modules/analysis/helpers/build-analysis-brief.helper'
import type { OnSourceError } from '@/_bff/modules/analysis/types'

const logSourceError: OnSourceError = ({ label, ticker, error }) =>
    Logger({
        level: 'warn',
        prefix: 'getAnalysisBrief',
        message: label,
        error,
        metadata: { ticker },
    })

/**
 * Gather the market context for a ticker and wrap it in an analysis brief for an
 * external model (the MCP). Never calls the AI model: the caller writes the analysis.
 */
export const getAnalysisBrief = Effect.fn('getAnalysisBrief')(function* (
    stockSymbol: string,
    promptType: string
) {
    const promptTemplate = yield* resolvePromptTemplate(promptType)

    // No user session on this path: stock_data reads and writes need the service role
    const supabase = createDBAdminClient()

    const marketData = yield* fetchMarketData(stockSymbol, supabase, logSourceError)

    const saveYahooFiber = yield* Effect.forkChild(
        saveFreshYahooData(marketData.yahoo, supabase, logSourceError)
    )

    const brief = buildAnalysisBrief({
        stockSymbol,
        promptTemplate,
        context: buildMarketContext(marketData),
        resolvedTicker: marketData.yahoo?.ticker ?? null,
        isFresh: marketData.yahoo?.isFresh ?? false,
        retrievedAt: new Date(),
    })

    yield* Fiber.join(saveYahooFiber)

    return brief
})
