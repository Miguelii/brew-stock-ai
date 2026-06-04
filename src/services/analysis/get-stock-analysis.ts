import 'server-only'

import { Effect } from 'effect'
import { SystemPrompt } from '@/services/analysis/helpers/prompts'
import { AiGenerationError, InvalidPromptTypeError } from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import { saveAnalysisToReport } from '@/services/reports/save-analysis-to-report'
import { saveYahooDataToTTL } from '@/services/yahoo/save-yahoo-data-to-ttl'
import { getYahooTtlData } from '@/services/yahoo/get-yahoo-ttl-data'
import { getPriceHistory } from '@/services/yahoo/get-price-history'
import { getLatestNews } from '@/services/finnhub/get-latest-news'
import { computeTechnicalIndicators } from '@/services/yahoo/helpers/compute-technical-indicators'
import { buildYahooContext } from '@/services/yahoo/helpers/build-yahoo-context'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
    FREE_MODEL,
    MAX_OUTPUT_TOKENS_FREE,
    MAX_OUTPUT_TOKENS_PROD,
    PROD_MODEL,
    PROMPTS_MAP,
    THINKING_BUDGET_TOKENS,
    stockAnalysisSchema,
} from '@/services/analysis/constants'
import { calculateTokenCost } from '@/services/analysis/helpers/calculate-token-cost'
import { logger } from '@trigger.dev/sdk'

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
            getLatestNews(tickerForData).pipe(Effect.orElse(() => Effect.succeed(null))),
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
