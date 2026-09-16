import { describe, it, expect } from 'vitest'
import type { EarningsQuarter, StockFinancials } from '@/types/ReportDTO'
import {
    getAnalystRatingsTotal,
    getEarningsBeat,
    getInsiderSignal,
    getTargetUpsidePct,
} from '@/_bff/core/helpers/financial-signals.helper'

const withPrices = (currentPrice: number | null, targetMeanPrice: number | null) =>
    ({ currentPrice, targetMeanPrice }) as StockFinancials

const quarter = (epsActual: number | null, epsEstimate: number | null): EarningsQuarter => ({
    period: '-1q',
    quarter: '2024-03-31',
    epsActual,
    epsEstimate,
    surprisePercent: null,
})

describe('getTargetUpsidePct', () => {
    it('returns the percentage from the current price to the mean target', () => {
        expect(getTargetUpsidePct(withPrices(100, 125))).toBe(25)
        expect(getTargetUpsidePct(withPrices(200, 150))).toBe(-25)
    })

    it('returns null when a price is missing or the current price is not positive', () => {
        expect(getTargetUpsidePct(null)).toBeNull()
        expect(getTargetUpsidePct(withPrices(null, 125))).toBeNull()
        expect(getTargetUpsidePct(withPrices(100, null))).toBeNull()
        expect(getTargetUpsidePct(withPrices(0, 125))).toBeNull()
    })
})

describe('getInsiderSignal', () => {
    it('classifies net buying and net selling', () => {
        expect(getInsiderSignal(1200)).toEqual({ label: 'Net buying', tone: 'positive' })
        expect(getInsiderSignal(-50)).toEqual({ label: 'Net selling', tone: 'negative' })
    })

    it('is neutral when there is no net activity', () => {
        expect(getInsiderSignal(0)).toEqual({ label: 'Roughly neutral', tone: 'neutral' })
        expect(getInsiderSignal(null)).toEqual({ label: 'Roughly neutral', tone: 'neutral' })
    })
})

describe('getEarningsBeat', () => {
    it('is a beat when actual EPS meets or exceeds the estimate', () => {
        expect(getEarningsBeat(quarter(1.5, 1.5))).toBe(true)
        expect(getEarningsBeat(quarter(1.2, 1.4))).toBe(false)
    })

    it('returns null when either EPS value is missing', () => {
        expect(getEarningsBeat(quarter(null, 1.4))).toBeNull()
        expect(getEarningsBeat(quarter(1.2, null))).toBeNull()
    })
})

describe('getAnalystRatingsTotal', () => {
    it('sums every recommendation bucket', () => {
        expect(
            getAnalystRatingsTotal({
                period: '0m',
                strongBuy: 12,
                buy: 20,
                hold: 8,
                sell: 1,
                strongSell: 0,
            })
        ).toBe(41)
    })
})
