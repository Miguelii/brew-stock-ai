import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getYahooTicker } from '@/_bff/modules/yahoo/processors/get-yahoo-ticker.processor'
import { failureTag } from '@/_bff/__tests__/utils'

const { searchMock } = vi.hoisted(() => ({ searchMock: vi.fn() }))

vi.mock('yahoo-finance2', () => ({
    default: class MockYahooFinance {
        search = searchMock
    },
}))

describe('getYahooTicker', () => {
    beforeEach(() => {
        searchMock.mockReset()
    })

    it('picks the first EQUITY over ETF and other quote types', async () => {
        searchMock.mockResolvedValue({
            quotes: [
                { symbol: 'SPY', quoteType: 'ETF', isYahooFinance: true },
                { symbol: 'AAPL', quoteType: 'EQUITY', isYahooFinance: true },
                { symbol: 'MSFT', quoteType: 'EQUITY', isYahooFinance: true },
            ],
        })
        await expect(Effect.runPromise(getYahooTicker('apple'))).resolves.toBe('AAPL')
    })

    it('falls back to the first ETF when there is no EQUITY', async () => {
        searchMock.mockResolvedValue({
            quotes: [
                { symbol: 'BTC-USD', quoteType: 'CRYPTOCURRENCY', isYahooFinance: true },
                { symbol: 'SPY', quoteType: 'ETF', isYahooFinance: true },
            ],
        })
        await expect(Effect.runPromise(getYahooTicker('sp500'))).resolves.toBe('SPY')
    })

    it('falls back to the first symbol of any type when there is no EQUITY or ETF', async () => {
        searchMock.mockResolvedValue({
            quotes: [
                { symbol: '^GSPC', quoteType: 'INDEX', isYahooFinance: true },
                { symbol: 'BTC-USD', quoteType: 'CRYPTOCURRENCY', isYahooFinance: true },
            ],
        })
        await expect(Effect.runPromise(getYahooTicker('sp500'))).resolves.toBe('^GSPC')
    })

    it('falls back to the input symbol when the search returns no quotes', async () => {
        searchMock.mockResolvedValue({ quotes: [] })
        await expect(Effect.runPromise(getYahooTicker('UNKNOWN'))).resolves.toBe('UNKNOWN')
    })

    it('ignores quotes not sourced from Yahoo Finance or without a quote type', async () => {
        searchMock.mockResolvedValue({
            quotes: [
                { symbol: 'FAKE', quoteType: 'EQUITY', isYahooFinance: false },
                { symbol: 'NOTYPE', isYahooFinance: true },
                { symbol: 'SPY', quoteType: 'ETF', isYahooFinance: true },
            ],
        })
        await expect(Effect.runPromise(getYahooTicker('spy'))).resolves.toBe('SPY')
    })

    it('fails with YahooSearchError when the search request rejects', async () => {
        searchMock.mockRejectedValue(new Error('network down'))
        const exit = await Effect.runPromiseExit(getYahooTicker('AAPL'))
        expect(failureTag(exit)).toBe('YahooSearchError')
    })
})
