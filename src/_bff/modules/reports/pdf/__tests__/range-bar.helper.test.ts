import { describe, it, expect } from 'vitest'
import { getRangeBarView } from '@/_bff/modules/reports/pdf/helpers/range-bar.helper'

describe('getRangeBarView', () => {
    it('positions the current value inside the range', () => {
        expect(getRangeBarView({ low: 100, high: 200, current: 150 })).toEqual({
            hasData: true,
            currentPct: 50,
        })
    })

    it('clamps values outside the range to 0-100', () => {
        expect(getRangeBarView({ low: 100, high: 200, current: 250 })).toEqual({
            hasData: true,
            currentPct: 100,
        })
        expect(getRangeBarView({ low: 100, high: 200, current: 50 })).toEqual({
            hasData: true,
            currentPct: 0,
        })
    })

    it('has no data when a bound is missing or the range is empty', () => {
        expect(getRangeBarView({ low: null, high: 200, current: 150 })).toEqual({ hasData: false })
        expect(getRangeBarView({ low: 100, high: 200, current: null })).toEqual({ hasData: false })
        expect(getRangeBarView({ low: 200, high: 200, current: 200 })).toEqual({ hasData: false })
        expect(getRangeBarView({ low: 200, high: 100, current: 150 })).toEqual({ hasData: false })
    })
})
