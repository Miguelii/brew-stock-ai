import { Effect, Fiber } from 'effect'
import { ServerEnv } from '@/env/server'
import { AiGenerationError, InvalidPromptTypeError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import { getYahooDataWithFallbackService } from '@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service'
import { getLatestNewsService } from '@/_bff/modules/finnhub/services/get-latest-news.service'
import { computeTechnicalIndicators } from '@/_bff/modules/yahoo/helpers/compute-technical-indicators.helper'
import { buildYahooContext } from '@/_bff/modules/yahoo/helpers/build-yahoo-context.helper'
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
} from '@/_bff/modules/analysis/constants'
import { SystemPrompt } from '@/_bff/modules/analysis/prompts/system.prompt'
import { calculateTokenCost } from '@/_bff/modules/analysis/helpers/calculate-token-cost.helper'
import { saveYahooData } from '@/_bff/modules/yahoo/processors/save-yahoo-data.processor'
import { saveAnalysisToReport } from '@/_bff/modules/reports/processors/save-analysis-to-report.processor'
import { getPriceHistoryService } from '@/_bff/modules/yahoo/services/get-price-history.service'

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

    const yahooPreFetch = yield* getYahooDataWithFallbackService(stockSymbol, supabaseClient)

    const tickerForData = yahooPreFetch?.ticker ?? stockSymbol

    const finalTicker = yahooPreFetch?.ticker ?? null

    // Persist fresh Yahoo data immediately (in parallel with the rest of the pipeline)
    const saveYahooFiber = yahooPreFetch?.isFresh
        ? yield* Effect.fork(
              saveYahooData(finalTicker, yahooPreFetch.data, supabaseClient).pipe(
                  Effect.tapError((error) =>
                      Effect.sync(() =>
                          logger.error('saveYahooData failed', {
                              ticker: finalTicker,
                              error,
                          })
                      )
                  ),
                  Effect.orElse(() => Effect.void)
              )
          )
        : null

    // Adicional context - a failure here must never abort the const
    const [priceHistory, news] = yield* Effect.all(
        [
            getPriceHistoryService(tickerForData).pipe(
                Effect.tapError((error) =>
                    Effect.sync(() =>
                        logger.error('getPriceHistory failed', {
                            ticker: tickerForData,
                            error,
                        })
                    )
                ),
                Effect.orElse(() => Effect.succeed(null))
            ),
            getLatestNewsService(tickerForData).pipe(
                Effect.tapError((error) =>
                    Effect.sync(() =>
                        logger.error('getLatestNewsService failed', {
                            ticker: tickerForData,
                            error,
                        })
                    )
                ),
                Effect.orElse(() => Effect.succeed(null))
            ),
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
                apiKey: ServerEnv.NEXT_ANTHROPIC_AI_KEY,
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
        hasPriceHistory: (priceHistory?.length ?? 0) > 0,
        hasNews: (news?.length ?? 0) > 0,
        hasYahooPreFetch: yahooPreFetch?.data != null,
    })

    if (!analysis) {
        return yield* new AiGenerationError({
            symbol: `|${stockSymbol}|`,
            cause: 'Model returned incomplete output',
            error_hash: ErrorCode.ANALYSIS_AI_NO_OUTPUT,
        })
    }

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

            saveYahooFiber ? Fiber.join(saveYahooFiber) : Effect.void,
        ],
        { concurrency: 'unbounded' }
    )

    return { analysis, sentiment }
})
