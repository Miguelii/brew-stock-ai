import { describe, it, expect } from 'vitest'
import { getSentimentGaugeView } from '@/_bff/core/helpers/sentiment-gauge.helper'
import { RISK_DISCLAIMER, SENTIMENT_DISCLAIMER } from '@/_bff/core/constants/sentiment.constants'

describe('getSentimentGaugeView', () => {
    it('draws five segments and points the needle straight up at 50', () => {
        const view = getSentimentGaugeView(50)

        expect(view.segments).toHaveLength(5)
        expect(view.needle).toEqual({ x1: 100, y1: 100, x2: '100.00', y2: '38.00' })
        expect(view.activeLabel).toBe('NEUTRAL')
        expect(view.disclaimer).toBe(SENTIMENT_DISCLAIMER)
    })

    it('clamps the score to the gauge range', () => {
        expect(getSentimentGaugeView(150).needle.x2).toBe('162.00')
        expect(getSentimentGaugeView(-20).needle.x2).toBe('38.00')
    })

    it('uses the risk labels for risk analyses', () => {
        const view = getSentimentGaugeView(10, true)

        expect(view.segments[0]?.lines).toEqual(['VERY HIGH', 'RISK'])
        expect(view.activeLabel).toBe('VERY HIGH RISK')
        expect(view.disclaimer).toBe(RISK_DISCLAIMER)
    })
})
