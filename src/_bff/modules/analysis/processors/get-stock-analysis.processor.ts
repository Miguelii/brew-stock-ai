// oxlint-disable import/max-dependencies
import { Effect, Fiber } from 'effect'
import { ServerEnv } from '@/env/server'
import { AiGenerationError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@trigger.dev/sdk'
import {
    MAX_OUTPUT_TOKENS_PROD,
    MOCK_ANALYSIS_DELAY,
    PROD_MODEL,
    stockAnalysisSchema,
} from '@/_bff/modules/analysis/constants'
import stockAnalysisMock from '@/_bff/modules/analysis/mocks/stock-analysis.mock.json'
import { SystemPrompt } from '@/_bff/modules/analysis/prompts/system.prompt'
import { calculateTokenCost } from '@/_bff/modules/analysis/helpers/calculate-token-cost.helper'
import { normalizeSentiment } from '@/_bff/modules/analysis/helpers/normalize-sentiment.helper'
import { isAnalysisComplete } from '@/_bff/modules/analysis/helpers/is-analysis-complete.helper'
import { saveAnalysisToReport } from '@/_bff/modules/reports/processors/save-analysis-to-report.processor'
import {
    buildMarketContext,
    fetchMarketData,
    saveFreshYahooData,
} from '@/_bff/modules/analysis/processors/fetch-market-data.processor'
import { resolvePromptTemplate } from '@/_bff/modules/analysis/processors/resolve-prompt-template.processor'
import type { AnalyzeReportInput, MarketData, OnSourceError } from '@/_bff/modules/analysis/types'

/** Report a failed data source in the Trigger.dev run logs. */
const logSourceError: OnSourceError = ({ label, ticker, error }) =>
    logger.error(label, { ticker, error })

/** Fill the prompt template with the ticker and append the market context, when there is any. */
const buildPrompt = (promptTemplate: string, stockSymbol: string, marketData: MarketData) =>
    promptTemplate.replaceAll('##TICKER##', stockSymbol) + buildMarketContext(marketData)

const generateAnalysis = Effect.fn('generateAnalysis')(function* (
    prompt: string,
    stockSymbol: string
) {
    const { output, usage, finishReason } = yield* Effect.tryPromise({
        try: async () => {
            const [{ generateText, Output }, { createAnthropic }] = await Promise.all([
                import('ai'),
                import('@ai-sdk/anthropic'),
            ])

            const anthropicClient = createAnthropic({ apiKey: ServerEnv.NEXT_ANTHROPIC_AI_KEY })

            return generateText({
                model: anthropicClient(PROD_MODEL),
                providerOptions: { anthropic: { thinking: { type: 'adaptive' } } },
                output: Output.object({ schema: stockAnalysisSchema }),
                system: SystemPrompt,
                prompt,
                maxOutputTokens: MAX_OUTPUT_TOKENS_PROD,
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

    return { model: PROD_MODEL, output, usage, finishReason }
})

/** Dev mode stand-in for generateAnalysis: same shape, no model call, no cost. */
const generateMockAnalysis = Effect.fn('generateMockAnalysis')(function* (stockSymbol: string) {
    logger.log('Mock analysis: the AI model is not called', {
        stockSymbol,
        delay: MOCK_ANALYSIS_DELAY,
    })

    yield* Effect.sleep(MOCK_ANALYSIS_DELAY)

    return {
        model: 'mock',
        output: {
            analysis: stockAnalysisMock.analysis.replaceAll('##TICKER##', stockSymbol),
            sentiment: stockAnalysisMock.sentiment,
        },
        usage: { inputTokens: undefined, outputTokens: undefined },
        finishReason: 'stop' as const,
    }
})

const analyzeAndSaveReport = Effect.fn('analyzeAndSaveReport')(function* ({
    stockSymbol,
    promptTemplate,
    reportId,
    marketData,
    supabaseClient,
    mockAnalysis,
}: AnalyzeReportInput) {
    const prompt = buildPrompt(promptTemplate, stockSymbol, marketData)

    const { model, output, usage, finishReason } = mockAnalysis
        ? yield* generateMockAnalysis(stockSymbol)
        : yield* generateAnalysis(prompt, stockSymbol)

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

    // Never save a truncated analysis: failing lets the job mark the report FAILED and refund
    if (!isAnalysisComplete(analysis, finishReason)) {
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
    mockAnalysis?: boolean
) {
    const promptTemplate = yield* resolvePromptTemplate(promptType)

    const marketData = yield* fetchMarketData(stockSymbol, supabaseClient, logSourceError)

    // Persist fresh Yahoo data in the background while the model generates
    const saveYahooFiber = yield* Effect.forkChild(
        saveFreshYahooData(marketData.yahoo, supabaseClient, logSourceError)
    )

    // Join the save even when the analysis fails, so the child fiber is never interrupted mid-write
    return yield* analyzeAndSaveReport({
        stockSymbol,
        promptTemplate,
        reportId,
        marketData,
        supabaseClient,
        mockAnalysis,
    }).pipe(Effect.ensuring(Fiber.join(saveYahooFiber)))
})
