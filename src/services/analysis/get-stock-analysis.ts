import 'server-only'

import { generateText, Output } from 'ai'
import { Effect } from 'effect'
import { anthropic } from '@/services/utils/init-anthropic'
import { SystemPrompt } from '@/services/utils/prompts'
import { AiGenerationError, InvalidPromptTypeError } from '@/services/utils/tagged-errors'
import type { ReportDTO } from '@/types/ReportDTO'
import { saveAnalysisToReport } from './save-analysis-to-report'
import { saveStockData } from './save-stock-data'
import { getYahooData } from './get-yahoo-data'
import { getYahooTicker } from './get-yahoo-ticker'
import { buildYahooContext } from './build-yahoo-context'
import type { GetYahooDataResult } from './get-yahoo-data'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PROMPTS_MAP, stockAnalysisSchema } from '@/services/utils/constants'

export const getStockAnalysis = Effect.fn('getStockAnalysis')(function* (
    stockSymbol: string,
    promptType: string,
    reportId: ReportDTO['id'],
    supabaseClient?: SupabaseClient,
    useBaseModel?: boolean
) {
    const basePrompt = PROMPTS_MAP[promptType]

    if (!basePrompt) {
        return yield* new InvalidPromptTypeError({ promptType, error_hash: 'elogprtntf' })
    }

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

    // Pre-fetch Yahoo ticker + data to enrich the AI prompt — fully non-fatal
    type YahooPreFetch = { ticker: string; data: GetYahooDataResult; isFresh: boolean } | null

    const yahooPreFetch: YahooPreFetch = yield* getYahooTicker(stockSymbol).pipe(
        Effect.flatMap((yahoo_ticker) => {
            if (!supabaseClient)
                return getYahooData(yahoo_ticker).pipe(
                    Effect.map((data) => ({ ticker: yahoo_ticker, data, isFresh: true }))
                )

            return Effect.tryPromise({
                try: () =>
                    supabaseClient
                        .from('stock_data')
                        .select('*, last_update_at')
                        .eq('id', yahoo_ticker)
                        .maybeSingle(),
                catch: (cause) => cause,
            }).pipe(
                Effect.flatMap((res) => {
                    const row = res.data
                    const isStale =
                        !row?.last_update_at ||
                        Date.now() - new Date(row.last_update_at).getTime() >= THIRTY_DAYS_MS

                    if (isStale) {
                        return getYahooData(yahoo_ticker).pipe(
                            Effect.map((data) => ({ ticker: yahoo_ticker, data, isFresh: true }))
                        )
                    }

                    return Effect.succeed({
                        ticker: yahoo_ticker,
                        data: row as unknown as GetYahooDataResult,
                        isFresh: false,
                    })
                }),
                Effect.orElse(() =>
                    getYahooData(yahoo_ticker).pipe(
                        Effect.map((data) => ({ ticker: yahoo_ticker, data, isFresh: true }))
                    )
                )
            )
        }),
        Effect.orElse(() => Effect.succeed(null))
    )
    const context = yahooPreFetch?.data ? `\n\n${buildYahooContext(yahooPreFetch.data)}` : ''

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol) + context

    const FREE_MODEL = 'claude-haiku-4-5'
    const PROD_MODEL = 'claude-sonnet-4-5-20250929'

    const { analysis, sentiment } = yield* Effect.tryPromise({
        try: () =>
            generateText({
                model: anthropic(useBaseModel ? FREE_MODEL : PROD_MODEL),
                ...(useBaseModel
                    ? {}
                    : {
                          providerOptions: {
                              anthropic: {
                                  thinking: { type: 'enabled', budgetTokens: 1500 },
                              },
                          },
                      }),
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt: resolvedPrompt,
                maxOutputTokens: useBaseModel ? 4000 : 5000,
            }).then((result) => result.output), // access .output inside try — throws AI_NoOutputGeneratedError otherwise
        catch: (cause) => {
            console.error('[getStockAnalysis] raw AI error:', cause)
            return new AiGenerationError({ cause, error_hash: 'elogaierf1' })
        },
    })

    if (!analysis) {
        return yield* new AiGenerationError({
            cause: 'Model returned incomplete output',
            error_hash: 'elogaioptnull',
        })
    }

    const finalTicker = yahooPreFetch?.ticker ?? null

    yield* saveAnalysisToReport(reportId, analysis, finalTicker, sentiment, supabaseClient)

    // Only save to stock_data if we fetched fresh data during pre-fetch
    if (yahooPreFetch?.isFresh) {
        yield* saveStockData(finalTicker, yahooPreFetch.data, supabaseClient).pipe(
            Effect.orElse(() => Effect.void)
        )
    }

    return { analysis, sentiment }
})
