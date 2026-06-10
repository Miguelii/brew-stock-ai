import 'server-only'

import { Effect } from 'effect'
import { AiGenerationError, InvalidPromptTypeError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import { getYahooTtlData } from '@/backend/modules/yahoo/processors/get-yahoo-ttl-data.processor'
import { getLatestNewsService } from '@/backend/modules/finnhub/services/get-latest-news.service'
import { computeTechnicalIndicators } from '@/backend/modules/yahoo/helpers/compute-technical-indicators.helper'
import { buildYahooContext } from '@/backend/modules/yahoo/helpers/build-yahoo-context.helper'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@trigger.dev/sdk'
import {
    FREE_MODEL,
    MAX_OUTPUT_TOKENS_FREE,
    MAX_OUTPUT_TOKENS_PROD,
    PROD_MODEL,
    PROMPTS_MAP,
    stockAnalysisSchema,
    THINKING_BUDGET_TOKENS,
} from '../constants'
import { SystemPrompt } from '../prompts/system.prompt'
import { calculateTokenCost } from '../helpers/calculate-token-cost.helper'
import { saveYahooDataToTTL } from '@/backend/modules/yahoo/processors/save-yahoo-data-to-ttl.processor'
import { saveAnalysisToReport } from '@/backend/modules/reports/processors/save-analysis-to-report.processor'
import { getPriceHistory } from '@/backend/modules/yahoo/processors/get-price-history.processor'

export const getStockAnalysis = Effect.fn('getStockAnalysis')(function* (
    stockSymbol: string,
    promptType: string,
    reportId: ReportDTO['id'],
    supabaseClient?: SupabaseClient,
    useBaseModel?: boolean
) {
    const basePrompt = PROMPTS_MAP[promptType]

    if (!basePrompt) {
        return yield* new InvalidPromptTypeError({
            promptType,
            error_hash: ErrorCode.ANALYSIS_INVALID_PROMPT,
        })
    }

    const yahooPreFetch = yield* getYahooTtlData(stockSymbol, supabaseClient)

    // Resolve the ticker once and reuse it for the supplementary data sources so
    // news, price history and Yahoo fundamentals all refer to the same symbol.
    const tickerForData = yahooPreFetch?.ticker ?? stockSymbol

    // Supplementary context — both non-fatal: a failure here must never abort the
    // analysis. Uses the raw (uncached, session-less) fetchers for the Trigger.dev
    // runtime.
    const [priceHistory, news] = yield* Effect.all(
        [
            getPriceHistory(tickerForData).pipe(Effect.orElse(() => Effect.succeed(null))),
            getLatestNewsService(tickerForData).pipe(Effect.orElse(() => Effect.succeed(null))),
        ],
        { concurrency: 'unbounded' }
    )

    const technicals =
        priceHistory && priceHistory.length > 0 ? computeTechnicalIndicators(priceHistory) : null

    const hasContext = Boolean(yahooPreFetch?.data || technicals || news?.length)

    const context = hasContext
        ? `\n\n${buildYahooContext(
              yahooPreFetch?.data ?? {
                  scores: null,
                  reports: [],
                  sigDev: null,
                  financials: null,
                  fundamentals: null,
              },
              technicals,
              news
          )}`
        : ''

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol) + context

    const model = useBaseModel ? FREE_MODEL : PROD_MODEL

    const { output, usage, finishReason } = yield* Effect.tryPromise({
        try: async () => {
            const [{ generateText, Output }, { createAnthropic }] = await Promise.all([
                import('ai'),
                import('@ai-sdk/anthropic'),
            ])
            const anthropicClient = createAnthropic({
                apiKey: process.env.NEXT_ANTHROPIC_AI_KEY,
            })
            return generateText({
                model: anthropicClient(model),
                ...(useBaseModel
                    ? {}
                    : {
                          providerOptions: {
                              anthropic: {
                                  thinking: {
                                      type: 'enabled',
                                      budgetTokens: THINKING_BUDGET_TOKENS,
                                  },
                              },
                          },
                      }),
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt: resolvedPrompt,
                maxOutputTokens: useBaseModel ? MAX_OUTPUT_TOKENS_FREE : MAX_OUTPUT_TOKENS_PROD,
            }).then((result) => ({
                output: result.output,
                usage: result.usage,
                finishReason: result.finishReason,
            }))
        },
        catch: (cause) => {
            logger.error('getStockAnalysis error', { error: cause })
            return new AiGenerationError({
                symbol: `|${stockSymbol}|`,
                cause,
                error_hash: ErrorCode.ANALYSIS_AI_GENERATION,
            })
        },
    })

    const { analysis, sentiment } = output

    const tokenUsdCost = calculateTokenCost(model, usage.inputTokens, usage.outputTokens)

    logger.log('Analysis completed', {
        reportId: reportId,
        tokenUsdCost: tokenUsdCost,
        finishReason: finishReason,
        outputTokens: usage.outputTokens,
    })

    if (!analysis) {
        return yield* new AiGenerationError({
            symbol: `|${stockSymbol}|`,
            cause: 'Model returned incomplete output',
            error_hash: ErrorCode.ANALYSIS_AI_NO_OUTPUT,
        })
    }

    const finalTicker = yahooPreFetch?.ticker ?? null

    yield* Effect.all(
        [
            saveAnalysisToReport(
                reportId,
                analysis,
                finalTicker,
                tokenUsdCost,
                sentiment,
                supabaseClient
            ),

            yahooPreFetch?.isFresh
                ? saveYahooDataToTTL(finalTicker, yahooPreFetch.data, supabaseClient).pipe(
                      Effect.orElse(() => Effect.void)
                  )
                : Effect.void,
        ],
        { concurrency: 'unbounded' }
    )

    return { analysis, sentiment }
})
