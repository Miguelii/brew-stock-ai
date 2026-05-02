import 'server-only'

import { Effect } from 'effect'
import { YahooClientError, YahooInsightsError } from '../utils/tagged-errors'
import YahooFinance from 'yahoo-finance2'
import type { StockReports, StockScores, StockSigDev } from '@/types/ReportDTO'

export const getYahooData = Effect.fn('getYahooData')(function* (ticker: string) {
    const yahooClient = yield* Effect.try({
        try: () => new YahooFinance({ suppressNotices: ['yahooSurvey'] }),
        catch: (cause) => new YahooClientError({ cause, error_hash: 'yhoclterr' }),
    })

    const insights = yield* Effect.tryPromise({
        try: () =>
            yahooClient.insights(ticker, {
                reportsCount: 3,
            }),
        catch: (cause) => new YahooInsightsError({ cause, error_hash: 'yhoclterr' }),
    })

    // Recent significant development
    const sigDev: StockSigDev | null = (insights.sigDevs.at(0) as unknown as StockSigDev) ?? null

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
    if (insights.companySnapshot) {
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

    return {
        scores,
        reports,
        sigDev,
    }
})

export type GetYahooDataResult = {
    scores: StockScores | null
    reports: StockReports[]
    sigDev: StockSigDev | null
}
