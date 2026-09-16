import { describe, it, expect } from 'vitest'
import {
    evaluateMetric,
    getMetricRowState,
    metricHelp,
} from '@/_bff/core/helpers/metric-quality.helper'

describe('getMetricRowState', () => {
    it('grades a known metric with its verdict, quality tone and default help', () => {
        const evaluation = evaluateMetric('trailingPE', 30.4)

        expect(
            getMetricRowState({
                label: 'P/E',
                value: '30.4',
                rawValue: 30.4,
                metricKey: 'trailingPE',
            })
        ).toEqual({
            help: metricHelp('trailingPE'),
            verdict: evaluation?.verdict,
            tone: evaluation?.quality,
        })
    })

    it('prefers a custom helper over the default help', () => {
        const state = getMetricRowState({
            label: 'Growth',
            value: '4.8%',
            rawValue: 0.048,
            metricKey: 'revenueGrowth',
            helper: 'Custom help',
        })

        expect(state.help).toBe('Custom help')
    })

    it('mutes N/A values and never grades them', () => {
        expect(
            getMetricRowState({ label: 'Beta', value: 'N/A', rawValue: 1.2, metricKey: 'beta' })
        ).toEqual({ help: metricHelp('beta'), verdict: null, tone: 'na' })
    })

    it('never grades or explains context rows', () => {
        expect(
            getMetricRowState({
                label: 'Market Cap',
                value: '$2.95T',
                rawValue: 2.95e12,
                metricKey: 'ebitda',
                helper: 'ignored',
                context: true,
            })
        ).toEqual({ help: undefined, verdict: null, tone: 'plain' })
    })

    it('renders plain when the metric has no rule', () => {
        expect(getMetricRowState({ label: 'Other', value: '12', rawValue: 12 })).toEqual({
            help: undefined,
            verdict: null,
            tone: 'plain',
        })
    })
})
