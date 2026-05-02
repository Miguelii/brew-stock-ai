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

    const resolvedPrompt = basePrompt.replaceAll('##TICKER##', stockSymbol)

    const FREE_MODEL = 'claude-haiku-4-5'
    const PROD_MODEL = 'claude-sonnet-4-5-20250929'

    const { output } = yield* Effect.tryPromise({
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
            }),
        catch: (cause) => {
            console.error('[getStockAnalysis] raw AI error:', cause)
            return new AiGenerationError({ cause, error_hash: 'elogaierf1' })
        },
    })

    const { analysis, sentiment, yahoo_ticker } = output

    if (!analysis) {
        return yield* new AiGenerationError({
            cause: 'Model returned incomplete output',
            error_hash: 'elogaioptnull',
        })
    }

    yield* saveAnalysisToReport(reportId, analysis, yahoo_ticker, sentiment, supabaseClient)

    // Yahoo enrichment — non-fatal: if Yahoo fails the report still completes
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

    const shouldFetchYahoo = supabaseClient
        ? yield* Effect.tryPromise({
              try: () =>
                  supabaseClient
                      .from('stock_data')
                      .select('last_update_at')
                      .eq('id', yahoo_ticker)
                      .maybeSingle(),
              catch: (cause) => cause,
          }).pipe(
              Effect.map((res) => {
                  if (!res.data?.last_update_at) return true
                  const elapsed = Date.now() - new Date(res.data.last_update_at).getTime()
                  return elapsed >= THIRTY_DAYS_MS
              }),
              Effect.orElse(() => Effect.succeed(true))
          )
        : true

    if (shouldFetchYahoo) {
        yield* getYahooData(yahoo_ticker).pipe(
            Effect.flatMap((yahooData) => saveStockData(yahoo_ticker, yahooData, supabaseClient)),
            Effect.orElse(() => Effect.void)
        )
    }

    return { analysis, sentiment }
})
