import 'server-only'

import { Effect } from 'effect'
import { SystemPrompt } from '@/services/analysis/helpers/prompts'
import { AiGenerationError, InvalidPromptTypeError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import { saveAnalysisToReport } from '@/services/analysis/save-analysis-to-report'
import { saveStockData } from '@/services/analysis/save-stock-data'
import { getYahooTtlData } from '@/services/analysis/get-yahoo-ttl-data'
import { buildYahooContext } from '@/services/analysis/helpers/build-yahoo-context'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PROMPTS_MAP, stockAnalysisSchema } from '@/services/analysis/helpers/constants'
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

    const context = yahooPreFetch?.data ? `\n\n${buildYahooContext(yahooPreFetch.data)}` : ''

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol) + context

    const FREE_MODEL = 'claude-haiku-4-5'
    const PROD_MODEL = 'claude-sonnet-4-5-20250929'

    const model = useBaseModel ? FREE_MODEL : PROD_MODEL

    const { output, usage } = yield* Effect.tryPromise({
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
                                  thinking: { type: 'enabled', budgetTokens: 4000 },
                              },
                          },
                      }),
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt: resolvedPrompt,
                maxOutputTokens: useBaseModel ? 4000 : 5000,
            }).then((result) => ({ output: result.output, usage: result.usage }))
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

    logger.log('Analysis completed', { reportId: reportId, tokenUsdCost: tokenUsdCost })

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
                ? saveStockData(finalTicker, yahooPreFetch.data, supabaseClient).pipe(
                      Effect.orElse(() => Effect.void)
                  )
                : Effect.void,
        ],
        { concurrency: 'unbounded' }
    )

    return { analysis, sentiment }
})
