import { fmtPrice, signedPct1 } from '@/_bff/core/utils/formatters.utils'
import { ANALYST_RATING_SEGMENTS } from '@/_bff/core/constants/analyst-ratings.constants'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import {
    getAnalystRatingsTotal,
    getTargetUpsidePct,
} from '@/_bff/core/helpers/financial-signals.helper'
import {
    PDF_COLORS,
    RATING_HEX,
    SIGNAL_BG_HEX,
    SIGNAL_HEX,
} from '@/_bff/modules/reports/pdf/constants'
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
    <div class="range-bar"></div>
    <div class="range-legend"><span>Data N/A</span></div>`
    }

    const position = `${view.currentPct.toFixed(1)}%`

    return `
    <div class="range-bar">
        <div style="position:absolute;top:0;bottom:0;left:0;width:${position};background:${PDF_COLORS.blue};border-radius:999px;"></div>
    </div>
    <div class="range-legend">
        <span>${fmtPrice(f.fiftyTwoWeekLow)}</span>
        <span style="color:${PDF_COLORS.ink};font-weight:700;">Current ${fmtPrice(f.currentPrice)}</span>
        <span>${fmtPrice(f.fiftyTwoWeekHigh)}</span>
    </div>`
}

function targetTileTemplate(label: string, value: string): string {
    const color = value === 'N/A' ? PDF_COLORS.faint : PDF_COLORS.ink

    return `
        <div class="tile">
            <span class="eyebrow tile-label">${label}</span>
            <span class="display tile-value" style="color:${color};">${value}</span>
        </div>`
}

/** Analyst price targets, with how far the average target is from the current price. */
function analystTargetsTemplate(f: StockFinancials): string {
    const upside = getTargetUpsidePct(f)
    const tone = upside != null && upside >= 0 ? 'positive' : 'negative'

    const upsideBadge =
        upside == null
            ? ''
            : `<span class="pill" style="background:${SIGNAL_BG_HEX[tone]};color:${SIGNAL_HEX[tone]};">${signedPct1(upside)} to consensus</span>`

    return `
    <div class="row-between" style="margin:16px 0 8px;">
        <span class="eyebrow">What analysts think the stock is worth</span>
        ${upsideBadge}
    </div>
    <div class="grid-3">
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
            `<span style="white-space:nowrap;"><span class="legend-mark" style="width:8px;height:8px;border-radius:50%;background:${RATING_HEX[key]};"></span>${label} <strong>${ratings[key]}</strong></span>`
    ).join('')

    return `
    <div class="eyebrow" style="margin:16px 0 8px;">Analyst recommendations (${total})</div>
    <div style="display:flex;height:10px;width:100%;border-radius:999px;overflow:hidden;background:${PDF_COLORS.track};margin-bottom:8px;">${bar}</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:10.5px;">${legend}</div>`
}

/** "Market & Analyst Outlook": price range, analyst targets and ratings. Empty without data. */
export function marketOutlookTemplate(
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): string {
    const priceAndTargets = financials
        ? `
    <div class="eyebrow">Where the stock has traded in the last year</div>
    ${priceRangeTemplate(financials)}
    ${analystTargetsTemplate(financials)}`
        : ''

    const ratings = fundamentals ? analystRatingsTemplate(fundamentals.analystRatings) : ''

    if (!priceAndTargets && !ratings) return ''

    return sectionTemplate({
        title: 'Market &amp; Analyst Outlook',
        body: priceAndTargets + ratings,
        isCompact: true,
    })
}
