import { fmtNum, fmtPct } from '@/_bff/core/utils/formatters.utils'
import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { MetricTile } from '@/types/MetricTile'
import {
    getGrowth,
    getHealth,
    getProfitability,
    getValuation,
} from '@/_bff/core/helpers/metric-builders.helper'
import {
    getMetricRowState,
    gradeCategory,
    gradeWord,
} from '@/_bff/core/helpers/metric-quality.helper'
import { getEarningsBeat, getInsiderSignal } from '@/_bff/core/helpers/financial-signals.helper'
import {
    METRIC_TONE_HEX,
    PDF_COLORS,
    QUALITY_BG_HEX,
    QUALITY_HEX,
    SIGNAL_HEX,
} from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

// Mirrors the on-screen ReportFinancialsCard: graded category cards, then the earnings and
// insider blocks. Grading and signals come from the same helpers the page uses.

function metricRowTemplate(metric: MetricTile): string {
    const { help, verdict, tone } = getMetricRowState(metric)
    const color = METRIC_TONE_HEX[tone]

    const helpHtml = help ? `<div class="fin-metric-help">${escapeHtml(help)}</div>` : ''
    const verdictHtml =
        verdict == null
            ? ''
            : `<div class="fin-metric-verdict" style="color:${color};">${escapeHtml(verdict)}</div>`

    return `
    <div class="fin-metric-row">
        <div class="fin-metric-main">
            <div class="fin-metric-label">${escapeHtml(metric.label)}</div>
            ${helpHtml}
        </div>
        <div class="fin-metric-side">
            <div class="fin-metric-value" style="color:${color};">${escapeHtml(metric.value)}</div>
            ${verdictHtml}
        </div>
    </div>`
}

function categoryCardTemplate(title: string, question: string, metrics: MetricTile[]): string {
    const grade = gradeCategory(metrics)

    const badge = grade
        ? `<div class="fin-grade" style="background:${QUALITY_BG_HEX[grade.quality]};color:${QUALITY_HEX[grade.quality]};">
               <span class="fin-grade-letter">${grade.letter}</span>
               <span class="fin-grade-word">${gradeWord(grade.quality)}</span>
           </div>`
        : ''

    return `
    <div class="fin-cat-card">
        <div class="fin-cat-head">
            <div class="fin-cat-heading">
                <span class="fin-cat-title">${escapeHtml(title)}</span>
                <span class="fin-cat-question">${escapeHtml(question)}</span>
            </div>
            ${badge}
        </div>
        <div class="fin-cat-rows">${metrics.map((metric) => metricRowTemplate(metric)).join('')}</div>
    </div>`
}

function earningsHistoryTemplate(history: StockFundamentals['earningsHistory']): string {
    if (history.length === 0) return ''

    const rows = history
        .map((quarter) => {
            const beat = getEarningsBeat(quarter)
            const badge =
                beat == null
                    ? ''
                    : `<span style="font-weight:600;color:${SIGNAL_HEX[beat ? 'positive' : 'negative']};">${beat ? 'Beat' : 'Miss'} ${fmtPct(quarter.surprisePercent)}</span>`

            return `
            <div class="fin-block-row fin-block-row-sep">
                <span style="color:${PDF_COLORS.muted};">${escapeHtml(quarter.quarter ?? quarter.period)}</span>
                <span style="color:${PDF_COLORS.ink};">Act ${fmtNum(quarter.epsActual)} / Est ${fmtNum(quarter.epsEstimate)} &nbsp; ${badge}</span>
            </div>`
        })
        .join('')

    return `
    <div class="fin-block">
        <div class="fin-block-title">Earnings vs estimates</div>
        ${rows}
    </div>`
}

function insiderActivityTemplate(insiders: StockFundamentals['insiders']): string {
    if (!insiders) return ''

    const signal = getInsiderSignal(insiders.netShares)

    return `
    <div class="fin-block">
        <div class="fin-block-title">Insider activity</div>
        <div class="fin-block-row">
            <span style="color:${PDF_COLORS.muted};">${insiders.buyCount} buys / ${insiders.sellCount} sells</span>
            <span style="font-weight:600;color:${SIGNAL_HEX[signal.tone]};">${signal.label} (${fmtNum(insiders.netShares, 0)} shares)</span>
        </div>
    </div>`
}

/** "Key Financial Metrics": four graded categories plus earnings and insiders. Empty without data. */
export function keyMetricsTemplate(
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): string {
    if (!financials && !fundamentals) return ''

    const body = `
    <div class="fin-cat-grid">
        ${categoryCardTemplate('Valuation', 'Cheap or expensive?', getValuation(financials))}
        ${categoryCardTemplate('Profitability', 'Does it make good money?', getProfitability(financials))}
        ${categoryCardTemplate('Financial Health', 'Can it cover its debts?', getHealth(financials))}
    </div>
    ${categoryCardTemplate('Growth', 'Is it growing?', getGrowth(financials, fundamentals))}
    ${fundamentals ? earningsHistoryTemplate(fundamentals.earningsHistory) : ''}
    ${fundamentals ? insiderActivityTemplate(fundamentals.insiders) : ''}`

    return sectionTemplate({ title: 'Key Financial Metrics', body })
}
