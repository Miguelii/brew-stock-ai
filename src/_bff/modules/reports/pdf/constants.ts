import type { ANALYST_RATING_SEGMENTS } from '@/_bff/core/constants/analyst-ratings.constants'
import type { SignalTone } from '@/_bff/core/helpers/financial-signals.helper'
import type { MetricQuality, MetricTone } from '@/_bff/core/helpers/metric-quality.helper'

type RatingKey = (typeof ANALYST_RATING_SEGMENTS)[number]['key']

// The PDF is rendered outside the app, so colors are inline hex values that mirror the
// page's semantic theme tokens (text-ink, text-positive, text-destructive, ...).
export const PDF_COLORS = {
    background: '#ffffff',
    ink: '#17181c',
    muted: '#7b7a76',
    faint: '#a09c93',
    blue: '#0047CC',
    positive: '#16a34a',
    negative: '#ef4444',
    caution: '#b45309',
    track: '#e5e7eb',
    tick: 'rgba(38,38,38,0.25)',
    border: '#e3ddd1',
    rowDivider: '#efeae0',
    surface: '#fafafa',
} as const

// Brand wordmark: "Stock" in brand blue, same as the site's BrandName component
export const BRAND_WORDMARK_HTML = 'Brew<span class="brand-accent">Stock</span>'

export const QUALITY_HEX: Record<MetricQuality, string> = {
    good: PDF_COLORS.positive,
    neutral: PDF_COLORS.ink,
    caution: PDF_COLORS.caution,
    concern: PDF_COLORS.negative,
}

export const QUALITY_BG_HEX: Record<MetricQuality, string> = {
    good: '#e8f5ee',
    neutral: '#f5f5f7',
    caution: '#fdf6ec',
    concern: '#fdecec',
}

export const METRIC_TONE_HEX: Record<MetricTone, string> = {
    ...QUALITY_HEX,
    na: PDF_COLORS.muted,
    plain: PDF_COLORS.ink,
}

export const SIGNAL_HEX: Record<SignalTone, string> = {
    positive: PDF_COLORS.positive,
    negative: PDF_COLORS.negative,
    neutral: PDF_COLORS.muted,
}

export const RATING_HEX: Record<RatingKey, string> = {
    strongBuy: PDF_COLORS.positive,
    buy: '#4ade80',
    hold: '#9ca3af',
    sell: '#f87171',
    strongSell: PDF_COLORS.negative,
}
