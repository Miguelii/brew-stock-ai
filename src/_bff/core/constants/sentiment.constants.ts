// Sentiment scale colors (hex, usable in SVG, the PDF and inline styles). Used by the
// sentiment helpers (report page and PDF) and by the gauge on the report page.
export const EXTREME_BEARISH_COLOR = '#ef4444'

export const BEARISH_COLOR = '#f97316'

export const NEUTRAL_COLOR = '#f59e0b'

export const BULLISH_COLOR = '#84cc16'

export const EXTREME_BULLISH_COLOR = '#22c55e'

type GaugeSegment = {
    startScore: number
    endScore: number
    color: string
    lines: readonly string[]
}

export const SENTIMENT_GAUGE_SEGMENTS: readonly GaugeSegment[] = [
    { startScore: 0, endScore: 24, color: EXTREME_BEARISH_COLOR, lines: ['EXTREME', 'BEARISH'] },
    { startScore: 25, endScore: 42, color: BEARISH_COLOR, lines: ['BEARISH'] },
    { startScore: 43, endScore: 57, color: NEUTRAL_COLOR, lines: ['NEUTRAL'] },
    { startScore: 58, endScore: 75, color: BULLISH_COLOR, lines: ['BULLISH'] },
    { startScore: 76, endScore: 100, color: EXTREME_BULLISH_COLOR, lines: ['EXTREME', 'BULLISH'] },
]

export const RISK_GAUGE_SEGMENTS: readonly GaugeSegment[] = [
    { startScore: 0, endScore: 24, color: EXTREME_BEARISH_COLOR, lines: ['VERY HIGH', 'RISK'] },
    { startScore: 25, endScore: 42, color: BEARISH_COLOR, lines: ['HIGH RISK'] },
    { startScore: 43, endScore: 57, color: NEUTRAL_COLOR, lines: ['MODERATE', 'RISK'] },
    { startScore: 58, endScore: 75, color: BULLISH_COLOR, lines: ['LOW RISK'] },
    { startScore: 76, endScore: 100, color: EXTREME_BULLISH_COLOR, lines: ['VERY LOW', 'RISK'] },
]

export const SENTIMENT_DISCLAIMER =
    'This score reflects the sentiment inferred from the Engine analysis only and does not constitute financial advice or an investment recommendation.'

export const RISK_DISCLAIMER =
    'This score reflects the risk level inferred from the Engine analysis only and does not constitute financial advice.'
