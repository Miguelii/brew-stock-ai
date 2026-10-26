import { describe, it, expect } from 'vitest'
import type { QuoteSummaryResult } from 'yahoo-finance2/modules/quoteSummary-iface'
import { mapFinancials } from '@/_bff/modules/yahoo/helpers/map-financials.helper'
import type { DeepPartial } from '@/_bff/lib/tests-utils'

// The upstream yahoo-finance2 types are huge; fixtures only carry the fields the mapper reads.
const summaryOf = (modules: DeepPartial<QuoteSummaryResult>): QuoteSummaryResult =>
    modules as unknown as QuoteSummaryResult

describe('mapFinancials', () => {
    it('maps every field to null when the modules are missing', () => {
        const result = mapFinancials(summaryOf({}))

        expect(Object.values(result).every((v) => v === null)).toBe(true)
    })

    it('reads the core snapshot from the three modules', () => {
        const result = mapFinancials(
            summaryOf({
                financialData: { currentPrice: 150, totalRevenue: 100, targetMeanPrice: 175 },
                summaryDetail: { marketCap: 2500, trailingPE: 28.5, dividendYield: 0.006 },
                defaultKeyStatistics: { priceToBook: 8.2, enterpriseValue: 2600 },
            })
        )

        expect(result).toMatchObject({
            currentPrice: 150,
            totalRevenue: 100,
            targetMeanPrice: 175,
            marketCap: 2500,
            trailingPE: 28.5,
            dividendYield: 0.006,
            priceToBook: 8.2,
            enterpriseValue: 2600,
        })
    })

    it('keeps the expanded valuation, quality and liquidity fields', () => {
        const result = mapFinancials(
            summaryOf({
                financialData: {
                    grossMargins: 0.48,
                    ebitdaMargins: 0.36,
                    returnOnAssets: 0.27,
                    currentRatio: 1.003,
                    quickRatio: 0.812,
                    totalCash: 62_399_000_576,
                    totalCashPerShare: 4.276,
                    revenuePerShare: 31.707,
                },
                summaryDetail: { priceToSalesTrailing12Months: 10.5, payoutRatio: 0.12 },
                defaultKeyStatistics: {
                    pegRatio: 2.67,
                    enterpriseToEbitda: 29.4,
                    enterpriseToRevenue: 10.58,
                    trailingEps: 8.83,
                    forwardEps: 9.58,
                    bookValue: 7.36,
                    netIncomeToCommon: 128_929_996_800,
                },
            })
        )

        expect(result).toMatchObject({
            grossMargins: 0.48,
            ebitdaMargins: 0.36,
            returnOnAssets: 0.27,
            currentRatio: 1.003,
            quickRatio: 0.812,
            totalCash: 62_399_000_576,
            totalCashPerShare: 4.276,
            revenuePerShare: 31.707,
            priceToSales: 10.5,
            payoutRatio: 0.12,
            pegRatio: 2.67,
            enterpriseToEbitda: 29.4,
            enterpriseToRevenue: 10.58,
            trailingEps: 8.83,
            forwardEps: 9.58,
            bookValue: 7.36,
            netIncomeToCommon: 128_929_996_800,
        })
    })

    it('keeps the relative performance, positioning and consensus fields', () => {
        const result = mapFinancials(
            summaryOf({
                financialData: {
                    recommendationKey: 'buy',
                    recommendationMean: 2.2,
                    numberOfAnalystOpinions: 39,
                    targetMedianPrice: 340,
                },
                defaultKeyStatistics: {
                    '52WeekChange': 0.3727,
                    SandP52WeekChange: 0.146,
                    sharesOutstanding: 14_594_180_000,
                    floatShares: 14_569_078_010,
                    shortPercentOfFloat: 0.0096,
                    shortRatio: 2.97,
                    heldPercentInsiders: 0.0165,
                    heldPercentInstitutions: 0.6634,
                },
            })
        )

        expect(result).toMatchObject({
            recommendationKey: 'buy',
            recommendationMean: 2.2,
            numberOfAnalystOpinions: 39,
            targetMedianPrice: 340,
            fiftyTwoWeekChange: 0.3727,
            sp500FiftyTwoWeekChange: 0.146,
            sharesOutstanding: 14_594_180_000,
            floatShares: 14_569_078_010,
            shortPercentOfFloat: 0.0096,
            shortRatio: 2.97,
            heldPercentInsiders: 0.0165,
            heldPercentInstitutions: 0.6634,
        })
    })
})
