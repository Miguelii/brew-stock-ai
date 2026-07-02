import { describe, it, expect } from 'vitest'
import {
    mapRevenueTrend,
    mapFundamentals,
} from '@/_bff/modules/yahoo/helpers/map-fundamentals.helper'
import type { QuoteSummaryResult } from 'yahoo-finance2/modules/quoteSummary-iface'
import type { FundamentalsTimeSeriesResult } from 'yahoo-finance2/modules/fundamentalsTimeSeries'
import type { RevenueTrendPoint } from '@/types/ReportDTO'

// The upstream yahoo-finance2 types are huge; fixtures only carry the fields
// the mappers read, so they are built loose and cast at the call site.
const timeSeriesRow = (row: Record<string, unknown>): FundamentalsTimeSeriesResult =>
    row as unknown as FundamentalsTimeSeriesResult

const summaryOf = (modules: Record<string, unknown>): QuoteSummaryResult =>
    modules as unknown as QuoteSummaryResult

describe('mapRevenueTrend', () => {
    it('returns an empty array for an empty series', () => {
        expect(mapRevenueTrend([])).toEqual([])
    })

    it('keeps only FINANCIALS rows', () => {
        const series = [
            timeSeriesRow({ TYPE: 'BALANCE_SHEET', date: new Date('2024-12-31'), totalRevenue: 1 }),
            timeSeriesRow({ TYPE: 'FINANCIALS', date: new Date('2024-12-31'), totalRevenue: 500 }),
        ]
        const result = mapRevenueTrend(series)
        expect(result).toHaveLength(1)
        expect(result[0].totalRevenue).toBe(500)
    })

    it('sorts newest first and caps at 4 years', () => {
        const series = [2020, 2022, 2021, 2024, 2023].map((year) =>
            timeSeriesRow({
                TYPE: 'FINANCIALS',
                date: new Date(`${year}-12-31`),
                totalRevenue: year,
            })
        )
        const result = mapRevenueTrend(series)
        expect(result).toHaveLength(4)
        expect(result.map((p) => p.totalRevenue)).toEqual([2024, 2023, 2022, 2021])
    })

    it('formats endDate as an ISO date string', () => {
        const result = mapRevenueTrend([
            timeSeriesRow({ TYPE: 'FINANCIALS', date: new Date('2024-12-31'), totalRevenue: 1 }),
        ])
        expect(result[0].endDate).toBe('2024-12-31')
    })

    it('falls back through the net-income field chain', () => {
        const base = { TYPE: 'FINANCIALS', date: new Date('2024-12-31'), totalRevenue: 100 }
        const pick = (row: Record<string, unknown>) => mapRevenueTrend([timeSeriesRow(row)])[0]

        expect(
            pick({
                ...base,
                netIncomeCommonStockholders: 10,
                netIncomeContinuousOperations: 20,
                netIncomeIncludingNoncontrollingInterests: 30,
            }).netIncome
        ).toBe(10)
        expect(
            pick({
                ...base,
                netIncomeContinuousOperations: 20,
                netIncomeIncludingNoncontrollingInterests: 30,
            }).netIncome
        ).toBe(20)
        expect(pick({ ...base, netIncomeIncludingNoncontrollingInterests: 30 }).netIncome).toBe(30)
        expect(pick(base).netIncome).toBeNull()
    })

    it('maps a missing totalRevenue to null', () => {
        const result = mapRevenueTrend([
            timeSeriesRow({ TYPE: 'FINANCIALS', date: new Date('2024-12-31') }),
        ])
        expect(result[0].totalRevenue).toBeNull()
    })
})

describe('mapFundamentals', () => {
    it('returns empty collections and passes the revenue trend through when summary is null', () => {
        const revenueTrend: RevenueTrendPoint[] = [
            { endDate: '2024-12-31', totalRevenue: 100, netIncome: 10 },
        ]
        const result = mapFundamentals(null, revenueTrend)
        expect(result).toEqual({
            earningsHistory: [],
            forwardEstimates: [],
            revenueTrend,
            analystRatings: null,
            insiders: null,
        })
    })

    it('returns empty collections when the summary has no modules', () => {
        const result = mapFundamentals(summaryOf({}), [])
        expect(result.earningsHistory).toEqual([])
        expect(result.forwardEstimates).toEqual([])
        expect(result.analystRatings).toBeNull()
        expect(result.insiders).toBeNull()
    })

    describe('earningsHistory', () => {
        it('keeps only the last 4 quarters', () => {
            const history = Array.from({ length: 6 }, (_, i) => ({
                period: `-${6 - i}q`,
                quarter: new Date(`2024-0${i + 1}-01`),
                epsActual: i,
                epsEstimate: i,
                surprisePercent: 0,
            }))
            const result = mapFundamentals(summaryOf({ earningsHistory: { history } }), [])
            expect(result.earningsHistory).toHaveLength(4)
            expect(result.earningsHistory.map((q) => q.epsActual)).toEqual([2, 3, 4, 5])
        })

        it('maps missing EPS fields to null and formats the quarter as ISO', () => {
            const result = mapFundamentals(
                summaryOf({
                    earningsHistory: {
                        history: [{ period: '-1q', quarter: new Date('2024-03-31') }],
                    },
                }),
                []
            )
            expect(result.earningsHistory).toEqual([
                {
                    period: '-1q',
                    quarter: '2024-03-31',
                    epsActual: null,
                    epsEstimate: null,
                    surprisePercent: null,
                },
            ])
        })
    })

    describe('forwardEstimates', () => {
        it('keeps only the forward-looking periods', () => {
            const trend = ['-1q', '0q', '+1q', '0y', '+1y', '+5y'].map((period) => ({
                period,
                earningsEstimate: { avg: 1, growth: 0.1 },
                revenueEstimate: { avg: 2, growth: 0.2 },
            }))
            const result = mapFundamentals(summaryOf({ earningsTrend: { trend } }), [])
            expect(result.forwardEstimates.map((e) => e.period)).toEqual(['0q', '+1q', '0y', '+1y'])
        })

        it('maps missing estimate blocks to null fields', () => {
            const result = mapFundamentals(
                summaryOf({ earningsTrend: { trend: [{ period: '0q' }] } }),
                []
            )
            expect(result.forwardEstimates).toEqual([
                {
                    period: '0q',
                    epsAvg: null,
                    epsGrowth: null,
                    revenueAvg: null,
                    revenueGrowth: null,
                },
            ])
        })
    })

    describe('analystRatings', () => {
        it('takes the most recent rating distribution', () => {
            const trend = [
                { period: '0m', strongBuy: 10, buy: 5, hold: 3, sell: 1, strongSell: 0 },
                { period: '-1m', strongBuy: 8, buy: 6, hold: 4, sell: 2, strongSell: 1 },
            ]
            const result = mapFundamentals(summaryOf({ recommendationTrend: { trend } }), [])
            expect(result.analystRatings).toEqual({
                period: '0m',
                strongBuy: 10,
                buy: 5,
                hold: 3,
                sell: 1,
                strongSell: 0,
            })
        })

        it('returns null when the trend is empty', () => {
            const result = mapFundamentals(summaryOf({ recommendationTrend: { trend: [] } }), [])
            expect(result.analystRatings).toBeNull()
        })
    })

    describe('insiders', () => {
        const withTransactions = (transactions: Record<string, unknown>[]) =>
            mapFundamentals(summaryOf({ insiderTransactions: { transactions } }), []).insiders

        it('returns null when there are no transactions', () => {
            expect(withTransactions([])).toBeNull()
        })

        it('returns null when no transaction text is classifiable', () => {
            expect(
                withTransactions([{ transactionText: 'Conversion of derivative', shares: 100 }])
            ).toBeNull()
        })

        it('classifies buys and sells from the transaction text and nets the shares', () => {
            expect(
                withTransactions([
                    { transactionText: 'Purchase at price 10.00 per share', shares: 100 },
                    { transactionText: 'Grant of restricted stock', shares: 50 },
                    { transactionText: 'Sale at price 12.00 per share', shares: 30 },
                    { transactionText: 'Disposition of shares', shares: 20 },
                ])
            ).toEqual({ buyCount: 2, sellCount: 2, netShares: 100 + 50 - 30 - 20 })
        })

        it('treats missing share counts as zero', () => {
            expect(
                withTransactions([
                    { transactionText: 'Purchase' },
                    { transactionText: 'Sale', shares: 40 },
                ])
            ).toEqual({ buyCount: 1, sellCount: 1, netShares: -40 })
        })
    })
})
