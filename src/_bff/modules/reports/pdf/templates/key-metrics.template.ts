import {
    fmtDate,
    fmtLarge,
    fmtNum,
    fmtPct,
    fmtSignedCount,
} from '@/_bff/core/utils/formatters.utils'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { MetricTile } from '@/types/MetricTile'
import type { FinancialCategory } from '@/types/FinancialCategory'
import {
    getFinancialCategories,
    getForwardEstimateTiles,
} from '@/_bff/core/helpers/financial-categories.helper'
import {
    getMetricRowState,
    gradeCategory,
    gradeWord,
} from '@/_bff/core/helpers/metric-quality.helper'
import {
    getEarningsBeat,
    getEarningsBeatSummary,
    getInsiderSignal,
} from '@/_bff/core/helpers/financial-signals.helper'
import { getRevenueChartPoints } from '@/_bff/core/helpers/revenue-trend.helper'
import {
    METRIC_TONE_HEX,
    PDF_COLORS,
    QUALITY_BG_HEX,
    QUALITY_FILL_HEX,
    QUALITY_HEX,
    SIGNAL_BG_HEX,
    SIGNAL_HEX,
} from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

type Grade = ReturnType<typeof gradeCategory>

// Same structure as the on-screen ReportFinancialsCard: grade scoreboard, one block of number
// tiles per category, then earnings and insiders. Grading comes from the shared helpers.

function gradePillTemplate(grade: Grade): string {
    if (!grade) return ''

    return `<span class="pill" style="background:${QUALITY_BG_HEX[grade.quality]};color:${QUALITY_HEX[grade.quality]};"><span class="display" style="font-size:14px;">${grade.letter}</span> ${gradeWord(grade.quality)}</span>`
}

function scoreBoardTemplate(categories: FinancialCategory[], grades: Grade[]): string {
    const tiles = categories
        .map((c, i) => {
            const grade = grades[i] ?? null

            const score = grade
                ? `
            <div class="score-row">
                <div class="bar-track"><div class="bar-fill" style="width:${grade.score.toFixed(0)}%;background:${QUALITY_FILL_HEX[grade.quality]};"></div></div>
                <span class="small muted">${Math.round(grade.score)}</span>
            </div>`
                : ''

            return `
        <div class="tile">
            <span class="eyebrow">${escapeHtml(c.title)}</span>
            <div style="margin-top:6px;">
                <span class="display score-letter" style="color:${grade ? QUALITY_HEX[grade.quality] : PDF_COLORS.faint};">${grade?.letter ?? 'N/A'}</span>
                <span style="font-size:11px;font-weight:700;margin-left:4px;">${grade ? gradeWord(grade.quality) : 'No data'}</span>
            </div>
            ${score}
        </div>`
        })
        .join('')

    return `<div class="grid-4">${tiles}</div>`
}

function metricTileTemplate(metric: MetricTile, detail?: string): string {
    const { help, verdict, tone } = getMetricRowState(metric)
    const valueColor = tone === 'na' ? PDF_COLORS.faint : PDF_COLORS.ink

    const helpHtml = help ? `<span class="tile-help">${escapeHtml(help)}</span>` : ''
    const detailHtml = detail ? `<span class="tile-detail">${escapeHtml(detail)}</span>` : ''
    const verdictHtml =
        verdict == null || tone === 'na' || tone === 'plain'
            ? ''
            : `<span class="pill" style="background:${QUALITY_BG_HEX[tone]};color:${METRIC_TONE_HEX[tone]};">${escapeHtml(verdict)}</span>`

    return `
        <div class="tile">
            <span class="eyebrow tile-label">${escapeHtml(metric.label)}</span>
            ${helpHtml}
            <span class="display tile-value" style="color:${valueColor};">${escapeHtml(metric.value)}</span>
            ${detailHtml}
            ${verdictHtml}
        </div>`
}

function contextStripTemplate(context: MetricTile[]): string {
    if (context.length === 0) return ''

    const items = context
        .map(
            ({ label, value }) =>
                `<span><span class="muted">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></span>`
        )
        .join('')

    return `<div class="context-strip">${items}</div>`
}

function revenueChartTemplate(trend: StockFundamentals['revenueTrend']): string {
    const points = getRevenueChartPoints(trend)

    if (points.length === 0) return ''

    const columns = points
        .map(
            (p) => `
        <div class="rev-col">
            <div class="rev-plot">
                <div class="rev-value" style="bottom:calc(${p.barPct.toFixed(1)}% + 3px);">${fmtLarge(p.revenue)}</div>
                <div class="rev-bar" style="height:${p.barPct.toFixed(1)}%;background:${p.isLatest ? PDF_COLORS.blue : '#bfd0f2'};"></div>
            </div>
            <div class="eyebrow" style="color:${PDF_COLORS.ink};margin-top:5px;">${p.year}</div>
            <div class="small" style="color:${p.incomeQuality ? QUALITY_HEX[p.incomeQuality] : PDF_COLORS.muted};">Net ${fmtLarge(p.netIncome)}</div>
        </div>`
        )
        .join('')

    return `
    <div class="eyebrow" style="margin-top:14px;">Revenue and net income by year</div>
    <div class="rev-chart">${columns}</div>`
}

function growthExtrasTemplate(fundamentals: StockFundamentals | null): string {
    if (!fundamentals) return ''

    const estimates = getForwardEstimateTiles(fundamentals.forwardEstimates)
    const estimatesHtml =
        estimates.length > 0
            ? `
    <div class="eyebrow" style="margin-top:14px;margin-bottom:8px;">Analyst estimates</div>
    <div class="grid-auto">${estimates.map(({ metric, detail }) => metricTileTemplate(metric, detail)).join('')}</div>`
            : ''

    return estimatesHtml + revenueChartTemplate(fundamentals.revenueTrend)
}

function categoryTemplate(
    category: FinancialCategory,
    grade: Grade,
    fundamentals: StockFundamentals | null
): string {
    const tiles =
        category.tiles.length > 0
            ? `<div class="grid-auto">${category.tiles.map((m) => metricTileTemplate(m)).join('')}</div>`
            : ''

    return `
    <div class="subsection">
        <div class="subhead">
            <div>
                <div class="display subhead-title">${escapeHtml(category.title)}</div>
                <div class="small muted">${escapeHtml(category.question)}</div>
            </div>
            ${gradePillTemplate(grade)}
        </div>
        ${tiles}
        ${contextStripTemplate(category.context)}
        ${category.id === 'growth' ? growthExtrasTemplate(fundamentals) : ''}
    </div>`
}

function earningsHistoryTemplate(history: StockFundamentals['earningsHistory']): string {
    if (history.length === 0) return ''

    const { beats, graded } = getEarningsBeatSummary(history)

    const tiles = history
        .map((q) => {
            const beat = getEarningsBeat(q)
            const tone = beat ? 'positive' : 'negative'
            const badge =
                beat == null
                    ? ''
                    : `<span class="pill" style="background:${SIGNAL_BG_HEX[tone]};color:${SIGNAL_HEX[tone]};">${beat ? 'Beat' : 'Miss'} ${fmtPct(q.surprisePercent)}</span>`

            return `
        <div class="tile">
            <span class="eyebrow tile-label">${escapeHtml(q.quarter ? fmtDate(q.quarter, 'short') : q.period)}</span>
            <span class="display tile-value" style="color:${q.epsActual == null ? PDF_COLORS.faint : PDF_COLORS.ink};">${fmtNum(q.epsActual)}</span>
            <span class="tile-detail">EPS · est. ${fmtNum(q.epsEstimate)}</span>
            ${badge}
        </div>`
        })
        .join('')

    return `
    <div class="subsection">
        <div class="subhead">
            <div class="display subhead-title">Earnings vs estimates</div>
            ${graded > 0 ? `<span class="small muted">Beat ${beats} of ${graded}</span>` : ''}
        </div>
        <div class="grid-auto">${tiles}</div>
    </div>`
}

function insiderActivityTemplate(insiders: StockFundamentals['insiders']): string {
    if (!insiders) return ''

    const signal = getInsiderSignal(insiders.netShares)

    return `
    <div class="subsection">
        <div class="subhead"><div class="display subhead-title">Insider activity</div></div>
        <div class="tile">
            <span class="eyebrow tile-label">Net shares traded</span>
            <span class="display tile-value" style="color:${signal.tone === 'neutral' ? PDF_COLORS.ink : SIGNAL_HEX[signal.tone]};">${fmtSignedCount(insiders.netShares)}</span>
            <span class="pill" style="background:${SIGNAL_BG_HEX[signal.tone]};color:${SIGNAL_HEX[signal.tone]};">${signal.label}</span>
            <span class="tile-detail" style="margin-top:10px;">Shares bought minus shares sold.</span>
        </div>
    </div>`
}

function trackRecordTemplate(fundamentals: StockFundamentals | null): string {
    if (!fundamentals) return ''

    const earnings = earningsHistoryTemplate(fundamentals.earningsHistory)
    const insiders = insiderActivityTemplate(fundamentals.insiders)

    if (!earnings && !insiders) return ''

    return `
    <div class="track-record${earnings && insiders ? '' : ' track-record-single'}">
        ${earnings}
        ${insiders}
    </div>`
}

/** "Key Financial Metrics": grade scoreboard, four categories, earnings and insiders. Empty without data. */
export function keyMetricsTemplate(
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): string {
    if (!financials && !fundamentals) return ''

    const categories = getFinancialCategories(financials, fundamentals)
    const grades = categories.map((c) => gradeCategory(c.metrics))

    const body = `
    ${scoreBoardTemplate(categories, grades)}
    ${categories.map((c, i) => categoryTemplate(c, grades[i] ?? null, fundamentals)).join('')}
    ${trackRecordTemplate(fundamentals)}`

    return sectionTemplate({
        title: 'Key Financial Metrics',
        subtitle: 'How the company scores on price, profits, balance sheet and growth',
        body,
    })
}
