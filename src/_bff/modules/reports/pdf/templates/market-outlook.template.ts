import { fmtPrice, signedPct1 } from '@/_bff/core/utils/formatters.utils'
import { ANALYST_RATING_SEGMENTS } from '@/_bff/core/constants/analyst-ratings.constants'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import {
    getAnalystRatingsTotal,
    getTargetUpsidePct,
} from '@/_bff/core/helpers/financial-signals.helper'
import { PDF_COLORS, RATING_HEX, SIGNAL_HEX } from '@/_bff/modules/reports/pdf/constants'
import { getRangeBarView } from '@/_bff/modules/reports/pdf/helpers/range-bar.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

/** 52-week range: a bar filled up to the current price, with the low/high labels below. */
function priceRangeTemplate(f: StockFinancials): string {
    const view = getRangeBarView({
        low: f.fiftyTwoWeekLow,
        high: f.fiftyTwoWeekHigh,
        current: f.currentPrice,
    })

    if (!view.hasData) {
        return `
    <div class="fin-range-wrap">
        <div class="fin-range-bar"><div style="position:absolute;inset:0;background:${PDF_COLORS.track};border-radius:4px;"></div></div>
        <div class="fin-range-meta"><span style="color:${PDF_COLORS.muted};">Data N/A</span></div>
    </div>`
    }

    const position = `${view.currentPct.toFixed(1)}%`

    return `
    <div class="fin-range-wrap">
        <div class="fin-range-bar">
            <div style="position:absolute;top:0;bottom:0;left:0;width:${position};background:${PDF_COLORS.blue};border-radius:4px;"></div>
            <div style="position:absolute;top:0;bottom:0;left:${position};width:2px;background:${PDF_COLORS.blue};z-index:1;"></div>
        </div>
        <div class="fin-range-legend"><span>${fmtPrice(f.fiftyTwoWeekLow)}</span><span>${fmtPrice(f.fiftyTwoWeekHigh)}</span></div>
        <div class="fin-range-meta">
            <span><span style="display:inline-block;width:10px;height:2px;background:${PDF_COLORS.blue};vertical-align:middle;margin-right:4px;"></span>Current ${fmtPrice(f.currentPrice)}</span>
        </div>
    </div>`
}

function targetTileTemplate(label: string, value: string): string {
    const color = value === 'N/A' ? PDF_COLORS.muted : PDF_COLORS.ink

    return `<div class="fin-tile-3"><div class="fin-tile-label">${label}</div><div class="fin-tile-value" style="color:${color};">${value}</div></div>`
}

/** Analyst price targets, with how far the average target is from the current price. */
function analystTargetsTemplate(f: StockFinancials): string {
    const upside = getTargetUpsidePct(f)

    const upsideBadge =
        upside == null
            ? ''
            : `<span style="font-size:10px;font-weight:600;color:${SIGNAL_HEX[upside >= 0 ? 'positive' : 'negative']};">${signedPct1(upside)} to consensus</span>`

    return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div class="fin-group-title" style="margin:0;">What analysts think the stock is worth</div>
        ${upsideBadge}
    </div>
    <div class="fin-grid">
        ${targetTileTemplate('Lowest analyst target', fmtPrice(f.targetLowPrice))}
        ${targetTileTemplate('Average analyst target', fmtPrice(f.targetMeanPrice))}
        ${targetTileTemplate('Highest analyst target', fmtPrice(f.targetHighPrice))}
    </div>`
}

/** Stacked bar of analyst recommendations with a legend. Empty when nobody covers the stock. */
function analystRatingsTemplate(ratings: StockFundamentals['analystRatings']): string {
    if (!ratings) return ''

    const total = getAnalystRatingsTotal(ratings)

    if (total === 0) return ''

    const bar = ANALYST_RATING_SEGMENTS.filter(({ key }) => ratings[key] > 0)
        .map(
            ({ key }) =>
                `<div style="width:${((ratings[key] / total) * 100).toFixed(1)}%;background:${RATING_HEX[key]};"></div>`
        )
        .join('')

    const legend = ANALYST_RATING_SEGMENTS.map(
        ({ key, label }) =>
            `<span style="margin-right:12px;white-space:nowrap;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${RATING_HEX[key]};vertical-align:middle;margin-right:4px;"></span>${label} <strong>${ratings[key]}</strong></span>`
    ).join('')

    return `
    <div class="fin-group-title">Analyst recommendations (${total})</div>
    <div style="display:flex;height:10px;width:100%;border-radius:4px;overflow:hidden;background:${PDF_COLORS.track};margin-bottom:6px;">${bar}</div>
    <div style="font-size:11px;color:${PDF_COLORS.ink};margin-bottom:4px;">${legend}</div>`
}

/** "Market & Analyst Outlook": price range, analyst targets and ratings. Empty without data. */
export function marketOutlookTemplate(
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): string {
    const priceAndTargets = financials
        ? `
    <div class="fin-group-title">Where the stock has traded in the last year</div>
    ${priceRangeTemplate(financials)}
${analystTargetsTemplate(financials)}`
        : ''

    const ratings = fundamentals ? analystRatingsTemplate(fundamentals.analystRatings) : ''

    if (!priceAndTargets && !ratings) return ''

    return sectionTemplate({
        title: 'Market &amp; Analyst Outlook',
        body: priceAndTargets + ratings,
    })
}
