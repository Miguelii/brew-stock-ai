// oxlint-disable import/max-dependencies
import { Effect, Fiber } from 'effect'
import { ServerEnv } from '@/env/server'
import { AiGenerationError, InvalidPromptTypeError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import { getYahooDataWithFallbackService } from '@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service'
import { getLatestNewsService } from '@/_bff/modules/finnhub/services/get-latest-news.service'
import { computeTechnicalIndicators } from '@/_bff/modules/yahoo/helpers/compute-technical-indicators.helper'
import { buildYahooContext } from '@/_bff/modules/yahoo/helpers/build-yahoo-context.helper'
import type { GetYahooDataResult, YahooDataWithFallbackResult } from '@/_bff/modules/yahoo/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@trigger.dev/sdk'
import {
    FREE_MODEL,
    MAX_OUTPUT_TOKENS_FREE,
    MAX_OUTPUT_TOKENS_PROD,
    PROD_MODEL,
    PROMPTS_MAP,
    stockAnalysisSchema,
} from '@/_bff/modules/analysis/constants'
import { SystemPrompt } from '@/_bff/modules/analysis/prompts/system.prompt'
import { calculateTokenCost } from '@/_bff/modules/analysis/helpers/calculate-token-cost.helper'
import { normalizeSentiment } from '@/_bff/modules/analysis/helpers/normalize-sentiment.helper'
import { isAnalysisComplete } from '@/_bff/modules/analysis/helpers/is-analysis-complete.helper'
import { hasAnyStockData } from '@/_bff/modules/yahoo/helpers/get-yahoo-data-with-fallback.service.helper'
import { getYahooTicker } from '@/_bff/modules/yahoo/processors/get-yahoo-ticker.processor'
import { saveYahooData } from '@/_bff/modules/yahoo/processors/save-yahoo-data.processor'
import { saveAnalysisToReport } from '@/_bff/modules/reports/processors/save-analysis-to-report.processor'
import { getPriceHistoryService } from '@/_bff/modules/yahoo/services/get-price-history.service'
import type { AnalyzeReportInput, MarketData } from '@/_bff/modules/analysis/types'

const EMPTY_YAHOO_DATA: GetYahooDataResult = {
    scores: null,
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
}

/**
 * Pipeable: log the failure and replace it with a fallback value, for steps
 * whose failure must never abort the analysis.
 */
const logAndRecover =
    <B>(label: string, ticker: string, fallback: B) =>
    <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A | B, never, R> =>
        effect.pipe(
            Effect.tapError((error) => Effect.sync(() => logger.error(label, { ticker, error }))),
            Effect.orElse(() => Effect.succeed(fallback))
        )

const resolvePromptTemplate = Effect.fn('resolvePromptTemplate')(function* (promptType: string) {
    const promptTemplate = PROMPTS_MAP[promptType]

    if (!promptTemplate) {
        return yield* new InvalidPromptTypeError({
            promptType,
            error_hash: ErrorCode.ANALYSIS_INVALID_PROMPT,
        })
    }

    return promptTemplate
})

/**
 * Resolve the Yahoo ticker, then fetch Yahoo data, price history and news in
 * parallel. Every source is optional: a failure yields `null` instead of
 * aborting the analysis.
 */
const fetchMarketData = Effect.fn('fetchMarketData')(function* (
    stockSymbol: string,
    supabaseClient: SupabaseClient
) {
    const ticker = yield* getYahooTicker(stockSymbol).pipe(
        logAndRecover('getYahooTicker failed', stockSymbol, null)
    )

    const tickerForData = ticker ?? stockSymbol

    const [yahoo, priceHistory, news] = yield* Effect.all(
        [
            ticker ? getYahooDataWithFallbackService(ticker, supabaseClient) : Effect.succeed(null),
            getPriceHistoryService(tickerForData).pipe(
                logAndRecover('getPriceHistory failed', tickerForData, null)
            ),
            getLatestNewsService(tickerForData).pipe(
                logAndRecover('getLatestNewsService failed', tickerForData, null)
            ),
        ],
        { concurrency: 'unbounded' }
    )

    return { yahoo, priceHistory, news } satisfies MarketData
})

/** Persist Yahoo data only when it came fresh from Yahoo. Never fails. */
const saveFreshYahooData = Effect.fn('saveFreshYahooData')(function* (
    yahoo: YahooDataWithFallbackResult,
    supabaseClient: SupabaseClient
) {
    if (!yahoo?.isFresh) return

    yield* saveYahooData(yahoo.ticker, yahoo.data, supabaseClient).pipe(
        logAndRecover('saveYahooData failed', yahoo.ticker, null)
    )
})

/** Fill the prompt template with the ticker and append the market context, when there is any. */
const buildPrompt = (promptTemplate: string, stockSymbol: string, marketData: MarketData) => {
    const { yahoo, priceHistory, news } = marketData

    const technicals =
        priceHistory && priceHistory.length > 0 ? computeTechnicalIndicators(priceHistory) : null

    const hasContext = Boolean((yahoo && hasAnyStockData(yahoo.data)) || technicals || news?.length)

    const context = hasContext
        ? `\n\n${buildYahooContext(yahoo?.data ?? EMPTY_YAHOO_DATA, technicals, news)}`
        : ''

    return promptTemplate.replaceAll('##TICKER##', stockSymbol) + context
}

const generateAnalysis = Effect.fn('generateAnalysis')(function* (
    prompt: string,
    stockSymbol: string,
    useBaseModel?: boolean
) {
    const model = useBaseModel ? FREE_MODEL : PROD_MODEL

    // Adaptive thinking is only enabled for the production model
    const providerOptions = useBaseModel
        ? undefined
        : { anthropic: { thinking: { type: 'adaptive' } } }

    const { output, usage, finishReason } = yield* Effect.tryPromise({
        try: async () => {
            const [{ generateText, Output }, { createAnthropic }] = await Promise.all([
                import('ai'),
                import('@ai-sdk/anthropic'),
            ])

            const anthropicClient = createAnthropic({ apiKey: ServerEnv.NEXT_ANTHROPIC_AI_KEY })

            return generateText({
                model: anthropicClient(model),
                providerOptions,
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt,
                maxOutputTokens: useBaseModel ? MAX_OUTPUT_TOKENS_FREE : MAX_OUTPUT_TOKENS_PROD,
            })
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

    return { model, output, usage, finishReason }
})

const analyzeAndSaveReport = Effect.fn('analyzeAndSaveReport')(function* ({
    stockSymbol,
    promptTemplate,
    reportId,
    marketData,
    supabaseClient,
    useBaseModel,
}: AnalyzeReportInput) {
    const prompt = buildPrompt(promptTemplate, stockSymbol, marketData)

    const { model, output, usage, finishReason } = yield* generateAnalysis(
        prompt,
        stockSymbol,
        useBaseModel
    )

    const analysis = output.analysis

    const sentiment = normalizeSentiment(output.sentiment)

    const tokenUsdCost = calculateTokenCost(model, usage.inputTokens, usage.outputTokens)

    logger.log('Analysis completed', {
        reportId,
        tokenUsdCost,
        finishReason,
        outputTokens: usage.outputTokens,
        hasPriceHistory: (marketData.priceHistory?.length ?? 0) > 0,
        hasNews: (marketData.news?.length ?? 0) > 0,
        hasYahooFreshData: marketData.yahoo?.isFresh ?? false,
    })

    // Never save a truncated analysis: failing lets the job mark the report FAILED and refund.
    // Skipped for the base model, which only runs in dev, where any output is good enough.
    const shouldRejectIncomplete = !useBaseModel && !isAnalysisComplete(analysis, finishReason)

    if (shouldRejectIncomplete) {
        logger.error('Incomplete analysis', {
            reportId,
            finishReason,
            outputTokens: usage.outputTokens,
            analysisLength: analysis.length,
        })

        return yield* new AiGenerationError({
            symbol: `|${stockSymbol}|`,
            cause: 'Model returned incomplete analysis',
            error_hash: ErrorCode.ANALYSIS_AI_INCOMPLETE,
        })
    }

    yield* saveAnalysisToReport(
        reportId,
        analysis,
        marketData.yahoo?.ticker ?? null,
        tokenUsdCost,
        sentiment,
        supabaseClient
    )

    return { analysis, sentiment }
})

export const getStockAnalysis = Effect.fn('getStockAnalysis')(function* (
    stockSymbol: string,
    promptType: string,
    reportId: ReportDTO['id'],
    supabaseClient: SupabaseClient,
    useBaseModel?: boolean
) {
    const promptTemplate = yield* resolvePromptTemplate(promptType)

    const marketData = yield* fetchMarketData(stockSymbol, supabaseClient)

    // Persist fresh Yahoo data in the background while the model generates
    const saveYahooFiber = yield* Effect.fork(saveFreshYahooData(marketData.yahoo, supabaseClient))

    // Join the save even when the analysis fails, so the child fiber is never interrupted mid-write
    return yield* analyzeAndSaveReport({
        stockSymbol,
        promptTemplate,
        reportId,
        marketData,
        supabaseClient,
        useBaseModel,
    }).pipe(Effect.ensuring(Fiber.join(saveYahooFiber)))
})
