import { PDF_COLORS } from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import type { OverviewView } from '@/_bff/modules/reports/pdf/types'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

type GaugeView = OverviewView['gauge']

function segmentLabelTemplate(lines: readonly string[]): string {
    const [first, second] = lines.map((line) => escapeHtml(line))

    return second === undefined
        ? `<tspan x="0" dy="2">${first}</tspan>`
        : `<tspan x="0" dy="-1.5">${first}</tspan><tspan x="0" dy="6">${second}</tspan>`
}

function sentimentGaugeTemplate(gauge: GaugeView): string {
    const segments = gauge.segments
        .map(
            (seg) => `
            <path d="${seg.path}" fill="${seg.color}" />
            <g transform="${seg.labelTransform}">
                <text text-anchor="middle" font-size="${seg.fontSize}" font-weight="700" letter-spacing="0.2" fill="#ffffff">${segmentLabelTemplate(seg.lines)}</text>
            </g>`
        )
        .join('')

    const { needle, pivot } = gauge

    return `
        <svg class="sentiment-gauge" viewBox="${gauge.viewBox}" xmlns="http://www.w3.org/2000/svg">
            ${segments}
            <line x1="${needle.x1}" y1="${needle.y1}" x2="${needle.x2}" y2="${needle.y2}" stroke="${PDF_COLORS.muted}" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="${pivot.cx}" cy="${pivot.cy}" r="${pivot.r}" fill="${PDF_COLORS.muted}" />
        </svg>`
}

/** Top of the report: the engine's summary next to the sentiment (or risk) gauge. */
export function overviewTemplate({ thesisHtml, gaugeTitle, gauge }: OverviewView): string {
    const summary = thesisHtml
        ? sectionTemplate({
              title: '<span class="eyebrow summary-badge">Summary of what our engine found:</span>',
              body: `<div class="analysis">${thesisHtml}</div>`,
          })
        : ''

    const sentiment = sectionTemplate({
        title: gaugeTitle,
        body: `
        <div class="sentiment-card">
            ${sentimentGaugeTemplate(gauge)}
            <div class="sentiment-active" style="color:${gauge.activeColor};">${escapeHtml(gauge.activeLabel)}</div>
            <div class="sentiment-disclaimer">${escapeHtml(gauge.disclaimer)}</div>
        </div>`,
    })

    return `
    <div class="overview${thesisHtml ? '' : ' overview-single'}">
        ${summary}
        ${sentiment}
    </div>`
}
