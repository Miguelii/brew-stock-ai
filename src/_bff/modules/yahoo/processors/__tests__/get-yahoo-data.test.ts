import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { logger } from '@trigger.dev/sdk'
import { getYahooData } from '@/_bff/modules/yahoo/processors/get-yahoo-data.processor'
import { failureTag } from '@/_bff/lib/tests-utils'

const { constructorMock, insightsMock, quoteSummaryMock, fundamentalsTimeSeriesMock } = vi.hoisted(
    () => ({
        constructorMock: vi.fn(),
        insightsMock: vi.fn(),
        quoteSummaryMock: vi.fn(),
        fundamentalsTimeSeriesMock: vi.fn(),
    })
)

vi.mock('@trigger.dev/sdk', () => ({ logger: { log: vi.fn(), error: vi.fn() } }))
vi.mock('yahoo-finance2', () => ({
    default: class MockYahooFinance {
        insights = insightsMock
        quoteSummary = quoteSummaryMock
        fundamentalsTimeSeries = fundamentalsTimeSeriesMock

        constructor(options: ConstructorParameters<typeof import('yahoo-finance2').default>[0]) {
            constructorMock(options)
        }
    },
}))

const INSIGHTS = {
    sigDevs: [
        { headline: 'Latest development', date: new Date('2026-10-01') },
        { headline: 'Older development', date: new Date('2026-09-01') },
    ],
    reports: [
        {
            title: 'Upgrade to Buy',
            headHtml: 'ignored',
            provider: 'Argus',
            reportDate: new Date('2026-10-10'),
            reportTitle: 'AAPL: upgrade',
        },
        {
            headHtml: 'Head only report',
            provider: 'Morningstar',
            reportDate: new Date('2026-10-05'),
            reportTitle: 'AAPL: fair value',
        },
    ],
    companySnapshot: {
        company: { innovativeness: 0.9, hiring: 0.5, sustainability: 0.7, dividends: 0.2 },
        sector: { innovativeness: 0.6, hiring: 0.4, sustainability: 0.5 },
    },
}

const FINANCIALS_SUMMARY = {
    financialData: { currentPrice: 190, totalRevenue: 400 },
    summaryDetail: { marketCap: 3_000_000, trailingPE: 30 },
    defaultKeyStatistics: { priceToBook: 40 },
}

const FUNDAMENTALS_SUMMARY = {
    earningsHistory: {
        history: [
            {
                period: '-1q',
                quarter: new Date('2026-06-30'),
                epsActual: 1.5,
                epsEstimate: 1.4,
                surprisePercent: 0.07,
            },
        ],
    },
    recommendationTrend: {
        trend: [{ period: '0m', strongBuy: 5, buy: 10, hold: 3, sell: 1, strongSell: 0 }],
    },
}

const TIME_SERIES = [
    {
        TYPE: 'FINANCIALS',
        date: new Date('2025-12-31'),
        totalRevenue: 400,
        netIncomeCommonStockholders: 90,
    },
]

const EXPECTED_SCORES = {
    company: { innovativeness: 0.9, hiring: 0.5, sustainability: 0.7 },
    sector: { innovativeness: 0.6, hiring: 0.4, sustainability: 0.5 },
}

const EXPECTED_REVENUE_TREND = [{ endDate: '2025-12-31', totalRevenue: 400, netIncome: 90 }]

// Both quoteSummary calls go through the same client method, told apart by their modules.
const mockQuoteSummary = <F, G>(financials: () => Promise<F>, fundamentals: () => Promise<G>) =>
    quoteSummaryMock.mockImplementation((_ticker: string, { modules }: { modules: string[] }) =>
        modules.includes('financialData') ? financials() : fundamentals()
    )

const run = () => Effect.runPromise(getYahooData('AAPL'))

describe('getYahooData', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        insightsMock.mockReset().mockResolvedValue(INSIGHTS)
        mockQuoteSummary(
            () => Promise.resolve(FINANCIALS_SUMMARY),
            () => Promise.resolve(FUNDAMENTALS_SUMMARY)
        )
        fundamentalsTimeSeriesMock.mockReset().mockResolvedValue(TIME_SERIES)
    })

    describe('when every call succeeds', () => {
        it('calls the four Yahoo endpoints for the ticker', async () => {
            await run()

            expect(constructorMock).toHaveBeenCalledWith({ suppressNotices: ['yahooSurvey'] })
            expect(insightsMock).toHaveBeenCalledWith('AAPL', { reportsCount: 3 })
            expect(quoteSummaryMock).toHaveBeenCalledWith('AAPL', {
                modules: ['financialData', 'summaryDetail', 'defaultKeyStatistics'],
            })
            expect(quoteSummaryMock).toHaveBeenCalledWith('AAPL', {
                modules: [
                    'earningsHistory',
                    'earningsTrend',
                    'recommendationTrend',
                    'insiderTransactions',
                ],
            })
            expect(fundamentalsTimeSeriesMock).toHaveBeenCalledWith(
                'AAPL',
                expect.objectContaining({ type: 'annual', module: 'financials' })
            )
        })

        it('requests five years of annual fundamentals', async () => {
            await run()

            const { period1 } = fundamentalsTimeSeriesMock.mock.calls[0][1] as { period1: Date }
            expect(new Date().getFullYear() - period1.getFullYear()).toBe(5)
        })

        it('starts every call before any of them settles', async () => {
            // A never-settling insights call must not delay the sibling requests
            insightsMock.mockReturnValue(new Promise(() => {}))
            void Effect.runPromise(getYahooData('AAPL'))
            await vi.waitFor(() => expect(fundamentalsTimeSeriesMock).toHaveBeenCalled())

            expect(insightsMock).toHaveBeenCalled()
            expect(quoteSummaryMock).toHaveBeenCalledTimes(2)
        })

        it('maps insights, financials and fundamentals', async () => {
            const result = await run()

            expect(result.sigDev).toEqual({
                ...INSIGHTS.sigDevs[0],
                date: '2026-10-01T00:00:00.000Z',
            })
            expect(result.reports).toEqual([
                {
                    title: 'Upgrade to Buy',
                    provider: 'Argus',
                    reportDate: '2026-10-10T00:00:00.000Z',
                    reportTitle: 'AAPL: upgrade',
                },
                {
                    title: 'Head only report',
                    provider: 'Morningstar',
                    reportDate: '2026-10-05T00:00:00.000Z',
                    reportTitle: 'AAPL: fair value',
                },
            ])
            expect(result.scores).toEqual(EXPECTED_SCORES)
            expect(result.financials).toMatchObject({
                currentPrice: 190,
                marketCap: 3_000_000,
                trailingPE: 30,
                priceToBook: 40,
                forwardPE: null,
            })
            expect(result.fundamentals).toEqual({
                earningsHistory: [
                    {
                        period: '-1q',
                        quarter: '2026-06-30',
                        epsActual: 1.5,
                        epsEstimate: 1.4,
                        surprisePercent: 0.07,
                    },
                ],
                forwardEstimates: [],
                revenueTrend: EXPECTED_REVENUE_TREND,
                analystRatings: {
                    period: '0m',
                    strongBuy: 5,
                    buy: 10,
                    hold: 3,
                    sell: 1,
                    strongSell: 0,
                },
                insiders: null,
            })
        })

        it('returns null scores when insights has no company snapshot', async () => {
            insightsMock.mockResolvedValue({ ...INSIGHTS, companySnapshot: undefined })

            const result = await run()
            expect(result.scores).toBeNull()
            expect(result.reports).toHaveLength(2)
        })
    })

    describe('call independence', () => {
        it('keeps financials and fundamentals when insights rejects', async () => {
            insightsMock.mockRejectedValue(new Error('insights internal error'))

            const result = await run()
            expect(result.sigDev).toBeNull()
            expect(result.reports).toEqual([])
            expect(result.scores).toBeNull()
            expect(result.financials).toMatchObject({ currentPrice: 190 })
            expect(result.fundamentals?.revenueTrend).toEqual(EXPECTED_REVENUE_TREND)
            expect(result.fundamentals?.earningsHistory).toHaveLength(1)
            expect(logger.error).toHaveBeenCalledWith(
                'getYahooData insights error',
                expect.objectContaining({ ticker: 'AAPL' })
            )
        })

        it('keeps insights and fundamentals when the financials quoteSummary rejects', async () => {
            mockQuoteSummary(
                () => Promise.reject(new Error('quoteSummary down')),
                () => Promise.resolve(FUNDAMENTALS_SUMMARY)
            )

            const result = await run()
            expect(result.financials).toBeNull()
            expect(result.scores).toEqual(EXPECTED_SCORES)
            expect(result.fundamentals?.revenueTrend).toEqual(EXPECTED_REVENUE_TREND)
            expect(result.fundamentals?.earningsHistory).toHaveLength(1)
        })

        it('keeps the revenue trend when the fundamentals quoteSummary rejects', async () => {
            mockQuoteSummary(
                () => Promise.resolve(FINANCIALS_SUMMARY),
                () => Promise.reject(new Error('quoteSummary down'))
            )

            const result = await run()
            expect(result.financials).toMatchObject({ currentPrice: 190 })
            expect(result.fundamentals).toEqual({
                earningsHistory: [],
                forwardEstimates: [],
                revenueTrend: EXPECTED_REVENUE_TREND,
                analystRatings: null,
                insiders: null,
            })
        })

        it('keeps the quoteSummary fundamentals when fundamentalsTimeSeries rejects', async () => {
            fundamentalsTimeSeriesMock.mockRejectedValue(new Error('timeseries down'))

            const result = await run()
            expect(result.financials).toMatchObject({ currentPrice: 190 })
            expect(result.fundamentals?.revenueTrend).toEqual([])
            expect(result.fundamentals?.earningsHistory).toHaveLength(1)
            expect(result.fundamentals?.analystRatings).not.toBeNull()
        })

        it('returns null fundamentals when both fundamentals sources fail', async () => {
            mockQuoteSummary(
                () => Promise.resolve(FINANCIALS_SUMMARY),
                () => Promise.reject(new Error('quoteSummary down'))
            )
            fundamentalsTimeSeriesMock.mockRejectedValue(new Error('timeseries down'))

            const result = await run()
            expect(result.fundamentals).toBeNull()
            expect(result.financials).toMatchObject({ currentPrice: 190 })
            expect(result.scores).toEqual(EXPECTED_SCORES)
        })

        it('succeeds with an empty result when every call rejects', async () => {
            insightsMock.mockRejectedValue(new Error('down'))
            mockQuoteSummary(
                () => Promise.reject(new Error('down')),
                () => Promise.reject(new Error('down'))
            )
            fundamentalsTimeSeriesMock.mockRejectedValue(new Error('down'))

            const result = await run()
            expect(result).toEqual({
                scores: null,
                reports: [],
                sigDev: null,
                financials: null,
                fundamentals: null,
            })
        })

        it('treats a throwing financials mapper as a failure of that call only', async () => {
            // A null payload makes mapFinancials throw a TypeError
            mockQuoteSummary(
                () => Promise.resolve(null),
                () => Promise.resolve(FUNDAMENTALS_SUMMARY)
            )

            const result = await run()
            expect(result.financials).toBeNull()
            expect(result.scores).toEqual(EXPECTED_SCORES)
            expect(result.fundamentals?.revenueTrend).toEqual(EXPECTED_REVENUE_TREND)
        })

        it('treats a throwing revenue trend mapper as a failure of that call only', async () => {
            // A null payload makes mapRevenueTrend throw a TypeError
            fundamentalsTimeSeriesMock.mockResolvedValue(null)

            const result = await run()
            expect(result.fundamentals?.revenueTrend).toEqual([])
            expect(result.fundamentals?.earningsHistory).toHaveLength(1)
            expect(result.financials).toMatchObject({ currentPrice: 190 })
        })

        it('maps invalid dates to null instead of failing', async () => {
            fundamentalsTimeSeriesMock.mockResolvedValue([
                { ...TIME_SERIES[0], date: new Date('not a date') },
            ])

            const result = await run()
            expect(result.fundamentals?.revenueTrend).toEqual([
                { endDate: null, totalRevenue: 400, netIncome: 90 },
            ])
        })
    })

    it('fails with YahooClientError when the client cannot be created', async () => {
        constructorMock.mockImplementationOnce(() => {
            throw new Error('init failed')
        })

        const exit = await Effect.runPromiseExit(getYahooData('AAPL'))
        expect(failureTag(exit)).toBe('YahooClientError')
        expect(insightsMock).not.toHaveBeenCalled()
    })
})
