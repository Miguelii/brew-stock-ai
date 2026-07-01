import { logger } from '@trigger.dev/sdk'
import { Effect } from 'effect'
import { YahooClientError, YahooInsightsError, YahooQuoteSummaryError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import type {
    RevenueTrendPoint,
    StockFinancials,
    StockFundamentals,
    StockReports,
    StockScores,
    StockSigDev,
} from '@/types/ReportDTO'
import {
    mapFundamentals,
    mapRevenueTrend,
} from '@/_backend/modules/yahoo/helpers/map-fundamentals.helper'

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
    const insights = yield* Effect.tryPromise({
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
    }).pipe(Effect.orElse(() => Effect.succeed(null)))

    // Recent significant development
    const sigDev: StockSigDev | null = (insights?.sigDevs?.at(0) as unknown as StockSigDev) ?? null

    // Get the 3 latests reports
    const reports: StockReports[] =
        insights?.reports?.map((item) => {
            return {
                title: item.title ?? item.headHtml,
                provider: item.provider,
                reportDate: item.reportDate,
                reportTitle: item.reportTitle,
            } as unknown as StockReports
        }) ?? []

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

    // Fetch financial indicators via quoteSummary — non-fatal
    const financials: StockFinancials | null = yield* Effect.tryPromise({
        try: () =>
            yahooClient.quoteSummary(ticker, {
                modules: ['financialData', 'summaryDetail', 'defaultKeyStatistics'],
            }),
        catch: (cause) => {
            logger.error('getYahooData financials quoteSummary error', { ticker, error: cause })
            return new YahooQuoteSummaryError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_QUOTE_SUMMARY,
            })
        },
    }).pipe(
        Effect.map((summary) => {
            const fd = summary.financialData
            const sd = summary.summaryDetail
            const ks = summary.defaultKeyStatistics

            return {
                currentPrice: fd?.currentPrice ?? null,
                marketCap: sd?.marketCap ?? null,
                trailingPE: sd?.trailingPE ?? null,
                forwardPE: sd?.forwardPE ?? null,
                priceToBook: ks?.priceToBook ?? null,
                fiftyTwoWeekHigh: sd?.fiftyTwoWeekHigh ?? null,
                fiftyTwoWeekLow: sd?.fiftyTwoWeekLow ?? null,
                beta: sd?.beta ?? null,
                debtToEquity: fd?.debtToEquity ?? null,
                revenueGrowth: fd?.revenueGrowth ?? null,
                earningsGrowth: fd?.earningsGrowth ?? null,
                freeCashflow: fd?.freeCashflow ?? null,
                operatingCashflow: fd?.operatingCashflow ?? null,
                profitMargins: fd?.profitMargins ?? null,
                operatingMargins: fd?.operatingMargins ?? null,
                returnOnEquity: fd?.returnOnEquity ?? null,
                totalRevenue: fd?.totalRevenue ?? null,
                ebitda: fd?.ebitda ?? null,
                totalDebt: fd?.totalDebt ?? null,
                enterpriseValue: ks?.enterpriseValue ?? null,
                targetMeanPrice: fd?.targetMeanPrice ?? null,
                targetHighPrice: fd?.targetHighPrice ?? null,
                targetLowPrice: fd?.targetLowPrice ?? null,
                dividendYield: sd?.dividendYield ?? null,
            } satisfies StockFinancials
        }),
        Effect.orElse(() => Effect.succeed(null))
    )

    // Expanded fundamentals — fetched independently of the core `financials`
    // above so a failure here never compromises it. Earnings/estimates/ratings/
    // insiders come from quoteSummary; the revenue trend comes from
    // fundamentalsTimeSeries (the quoteSummary income-statement modules have been
    // emptied by Yahoo for most tickers since late 2024). Both are non-fatal.
    const fundamentalsPeriod1 = new Date()
    fundamentalsPeriod1.setFullYear(fundamentalsPeriod1.getFullYear() - 5)

    const [fundamentalsSummary, revenueTrend] = yield* Effect.all(
        [
            Effect.tryPromise({
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
            }).pipe(Effect.orElse(() => Effect.succeed(null))),

            Effect.tryPromise({
                try: () =>
                    yahooClient.fundamentalsTimeSeries(ticker, {
                        period1: fundamentalsPeriod1,
                        type: 'annual',
                        module: 'financials',
                    }),
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
            }).pipe(
                Effect.map(mapRevenueTrend),
                Effect.orElse(() => Effect.succeed([] as RevenueTrendPoint[]))
            ),
        ],
        { concurrency: 'unbounded' }
    )

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
