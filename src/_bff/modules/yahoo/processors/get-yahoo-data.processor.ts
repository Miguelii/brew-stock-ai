import { logger } from '@trigger.dev/sdk'
import { Effect } from 'effect'
import { YahooClientError, YahooInsightsError, YahooQuoteSummaryError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type {
    RevenueTrendPoint,
    StockFundamentals,
    StockReports,
    StockScores,
    StockSigDev,
} from '@/types/ReportDTO'
import {
    mapFundamentals,
    mapRevenueTrend,
} from '@/_bff/modules/yahoo/helpers/map-fundamentals.helper'
import { mapFinancials } from '@/_bff/modules/yahoo/helpers/map-financials.helper'

export const getYahooData = Effect.fn('getYahooData')(function* (ticker: string) {
    const yahooClient = yield* Effect.tryPromise({
        try: async () => {
            const { default: YahooFinance } = await import('yahoo-finance2')
            return new YahooFinance({ suppressNotices: ['yahooSurvey'] })
        },
        catch: (cause) => {
            logger.error('getYahooData client init error', { ticker, error: cause })
            return new YahooClientError({
                symbol: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_CLIENT_INIT,
            })
        },
    })

    // Analyst insights (reports, significant developments, scores) — non-fatal
    const insightsEffect = Effect.tryPromise({
        try: () =>
            yahooClient.insights(ticker, {
                reportsCount: 3,
            }),
        catch: (cause) => {
            logger.error('getYahooData insights error', { ticker, error: cause })
            return new YahooInsightsError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_INSIGHTS_FETCH,
            })
        },
    }).pipe(Effect.catch(() => Effect.succeed(null)))

    // Fetch financial indicators via quoteSummary (non-fatal). The mapper runs inside `try`
    // so a throw there is a typed failure (recovered below), not a defect that would make
    // `Effect.all` interrupt the sibling calls.
    const financialsEffect = Effect.tryPromise({
        try: async () =>
            mapFinancials(
                await yahooClient.quoteSummary(ticker, {
                    modules: ['financialData', 'summaryDetail', 'defaultKeyStatistics'],
                })
            ),
        catch: (cause) => {
            logger.error('getYahooData financials quoteSummary error', { ticker, error: cause })
            return new YahooQuoteSummaryError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_QUOTE_SUMMARY,
            })
        },
    }).pipe(Effect.catch(() => Effect.succeed(null)))

    // Expanded fundamentals — fetched independently of the core `financials`
    // above so a failure here never compromises it. Earnings/estimates/ratings/
    // insiders come from quoteSummary; the revenue trend comes from
    // fundamentalsTimeSeries (the quoteSummary income-statement modules have been
    // emptied by Yahoo for most tickers since late 2024). Both are non-fatal.
    const fundamentalsPeriod1 = new Date()
    fundamentalsPeriod1.setFullYear(fundamentalsPeriod1.getFullYear() - 5)

    const fundamentalsSummaryEffect = Effect.tryPromise({
        try: () =>
            yahooClient.quoteSummary(ticker, {
                modules: [
                    'earningsHistory',
                    'earningsTrend',
                    'recommendationTrend',
                    'insiderTransactions',
                ],
            }),
        catch: (cause) => {
            logger.error('getYahooData fundamentals quoteSummary error', {
                ticker,
                error: cause,
            })
            return new YahooQuoteSummaryError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_QUOTE_SUMMARY,
            })
        },
    }).pipe(Effect.catch(() => Effect.succeed(null)))

    const revenueTrendEffect = Effect.tryPromise({
        try: async () =>
            mapRevenueTrend(
                await yahooClient.fundamentalsTimeSeries(ticker, {
                    period1: fundamentalsPeriod1,
                    type: 'annual',
                    module: 'financials',
                })
            ),
        catch: (cause) => {
            logger.error('getYahooData revenueTrend fundamentalsTimeSeries error', {
                ticker,
                error: cause,
            })
            return new YahooQuoteSummaryError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_QUOTE_SUMMARY,
            })
        },
    }).pipe(Effect.catch(() => Effect.succeed<RevenueTrendPoint[]>([])))

    // All four Yahoo calls are independent — run them in parallel.
    const [insights, financials, fundamentalsSummary, revenueTrend] = yield* Effect.all(
        [insightsEffect, financialsEffect, fundamentalsSummaryEffect, revenueTrendEffect],
        { concurrency: 'unbounded' }
    )

    // Recent significant development
    const latestSigDev = insights?.sigDevs?.at(0)
    const sigDev: StockSigDev | null = latestSigDev
        ? { headline: latestSigDev.headline, date: latestSigDev.date.toISOString() }
        : null

    // Get the 3 latests reports
    const reports: StockReports[] =
        insights?.reports?.map((item) => ({
            title: item.title ?? item.headHtml,
            provider: item.provider,
            reportDate: item.reportDate.toISOString(),
            reportTitle: item.reportTitle,
        })) ?? []

    let scores: StockScores | null = null

    // Company vs sector scores
    if (insights?.companySnapshot) {
        const company = insights.companySnapshot.company
        const sector = insights.companySnapshot.sector
        scores = {
            company: {
                innovativeness: company.innovativeness,
                hiring: company.hiring,
                sustainability: company.sustainability,
            },
            sector: {
                innovativeness: sector.innovativeness,
                hiring: sector.hiring,
                sustainability: sector.sustainability,
            },
        }
    }

    const fundamentals: StockFundamentals | null =
        fundamentalsSummary || revenueTrend.length > 0
            ? mapFundamentals(fundamentalsSummary, revenueTrend)
            : null

    return {
        scores,
        reports,
        sigDev,
        financials,
        fundamentals,
    }
})
