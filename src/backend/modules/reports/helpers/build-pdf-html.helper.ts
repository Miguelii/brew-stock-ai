// oxlint-disable max-lines
import { PROMPT_TYPES } from '@/lib/constants'
import { getSentimentInfo, getRiskLevelInfo } from '@/lib/analysis/sentiment'
import {
    fmtLarge,
    fmtPct,
    fmtX,
    fmtNum,
    fmtPrice,
    fmtDate,
    fmtEstimatePeriod,
    escapeHtml,
} from '@/lib/formatters'
import { sanitizeReportHtml } from '@/backend/modules/reports/helpers/sanitize-report-html.helper'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import type {
    ReportDTO,
    StockData,
    StockScores,
    StockFinancials,
    StockFundamentals,
    StockSigDev,
    StockReports,
} from '@/types/ReportDTO'

const SCORE_ROW_DEFS = [
    { label: 'Innovation', key: 'innovativeness' },
    { label: 'Workforce Growth', key: 'hiring' },
    { label: 'Sustainability', key: 'sustainability' },
] as const

function buildScoreRows(scores: StockScores): string {
    return SCORE_ROW_DEFS.map(({ label, key }) => {
        const company = scores.company[key]
        const sector = scores.sector[key]
        const isNA = company == null
        const sectorPct = sector != null ? sector * 100 : 50

        const bar = isNA
            ? `<div style="position:absolute;inset:0;background:#e5e7eb;border-radius:4px;"></div>`
            : `<div style="position:absolute;top:0;bottom:0;left:0;width:${(company * 100).toFixed(1)}%;background:#0047CC;border-radius:4px;"></div>`

        const tick =
            sector != null
                ? `<div style="position:absolute;top:0;bottom:0;left:${sectorPct.toFixed(1)}%;width:2px;background:rgba(38,38,38,0.25);z-index:1;"></div>`
                : ''

        const valueText = isNA
            ? `<span style="color:#909097;">N/A</span>`
            : `<span style="font-weight:600;">${company.toFixed(2)}</span>`

        const sectorText = sector != null ? sector.toFixed(2) : 'N/A'

        return `
            <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;">
                    <span style="font-weight:600;">${label}</span>
                    <span>${valueText}<span style="color:#909097;font-weight:400;"> vs ${sectorText}</span></span>
                </div>
                <div style="position:relative;height:10px;background:${isNA ? '#ffffff' : '#d4d4d4'};border-radius:4px;overflow:hidden;">
                    ${bar}${tick}
                </div>
            </div>`
    }).join('')
}

function signStyle(n: number | null | undefined): string {
    if (n == null) return 'color:#262626;'
    return n >= 0 ? 'color:#16a34a;' : 'color:#ef4444;'
}

function tile(
    label: string,
    value: string,
    cls: 'fin-tile' | 'fin-tile-3',
    colored = false,
    raw?: number | null
): string {
    const valueStyle = colored ? signStyle(raw) : 'color:#262626;'
    const valueColor = value === 'N/A' ? 'color:#909097;' : valueStyle
    return `<div class="${cls}"><div class="fin-tile-label">${label}</div><div class="fin-tile-value" style="${valueColor}">${value}</div></div>`
}

function buildRangeBar(
    low: number | null,
    high: number | null,
    current: number | null,
    mean?: number | null,
    lowLabel?: string,
    highLabel?: string,
    currentLabel?: string,
    meanLabel?: string
): string {
    const hasData = low != null && high != null && current != null && high > low
    const range = hasData ? high! - low! : 1
    const currentPct = hasData ? Math.min(Math.max(((current! - low!) / range) * 100, 0), 100) : 0
    const meanPct =
        mean != null && hasData ? Math.min(Math.max(((mean - low!) / range) * 100, 0), 100) : null

    const barInner = hasData
        ? `<div style="position:absolute;top:0;bottom:0;left:0;width:${currentPct.toFixed(1)}%;background:#0047CC;border-radius:4px;"></div>
           <div style="position:absolute;top:0;bottom:0;left:${currentPct.toFixed(1)}%;width:2px;background:#0047CC;z-index:1;"></div>
           ${meanPct != null ? `<div style="position:absolute;top:0;bottom:0;left:${meanPct.toFixed(1)}%;width:2px;background:rgba(38,38,38,0.3);z-index:1;"></div>` : ''}`
        : `<div style="position:absolute;inset:0;background:#e5e7eb;border-radius:4px;"></div>`

    const legend = hasData
        ? `<div class="fin-range-legend"><span>${lowLabel ?? ''}</span><span>${highLabel ?? ''}</span></div>
           <div class="fin-range-meta">
               <span><span style="display:inline-block;width:10px;height:2px;background:#0047CC;vertical-align:middle;margin-right:4px;"></span>${currentLabel ?? ''}</span>
               ${meanLabel ? `<span><span style="display:inline-block;width:10px;height:2px;background:rgba(38,38,38,0.35);vertical-align:middle;margin-right:4px;"></span>${meanLabel}</span>` : ''}
           </div>`
        : `<div class="fin-range-meta"><span style="color:#909097;">Data N/A</span></div>`

    return `
    <div class="fin-range-wrap">
        <div class="fin-range-bar">${barInner}</div>
        ${legend}
    </div>`
}

// "Market & Analyst Outlook" portion: 52-week range + analyst target prices.
function buildAnalystOutlookFinancials(f: StockFinancials): string {
    const hasRange =
        f.fiftyTwoWeekLow != null && f.fiftyTwoWeekHigh != null && f.currentPrice != null
    const upsideNum =
        f.targetMeanPrice != null && f.currentPrice != null && f.currentPrice > 0
            ? ((f.targetMeanPrice - f.currentPrice) / f.currentPrice) * 100
            : null

    const rangeBar = buildRangeBar(
        f.fiftyTwoWeekLow,
        f.fiftyTwoWeekHigh,
        f.currentPrice,
        null,
        hasRange ? fmtPrice(f.fiftyTwoWeekLow) : undefined,
        hasRange ? fmtPrice(f.fiftyTwoWeekHigh) : undefined,
        hasRange ? `Current ${fmtPrice(f.currentPrice)}` : undefined
    )

    const upsideBadge =
        upsideNum != null
            ? `<span style="font-size:10px;font-weight:600;${upsideNum >= 0 ? 'color:#16a34a;' : 'color:#ef4444;'}">${upsideNum >= 0 ? '+' : ''}${upsideNum.toFixed(1)}% to consensus</span>`
            : ''

    return `
    <div class="fin-group-title">Where the stock has traded in the last year</div>
    ${rangeBar}

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div class="fin-group-title" style="margin:0;">What analysts think the stock is worth</div>
        ${upsideBadge}
    </div>
    <div class="fin-grid">
        ${tile('Lowest analyst target', fmtPrice(f.targetLowPrice), 'fin-tile-3')}
        ${tile('Average analyst target', fmtPrice(f.targetMeanPrice), 'fin-tile-3')}
        ${tile('Highest analyst target', fmtPrice(f.targetHighPrice), 'fin-tile-3')}
    </div>`
}

// "Key Financial Metrics" portion: the three metric groups.
function buildFinancialMetricsGroups(f: StockFinancials): string {
    return `
    <div class="fin-group-title">Revenue &amp; Profitability</div>
    <div class="fin-grid">
        ${tile('Total Revenue', fmtLarge(f.totalRevenue), 'fin-tile-3')}
        ${tile('Revenue Growth', fmtPct(f.revenueGrowth), 'fin-tile-3', true, f.revenueGrowth)}
        ${tile('Earnings Growth', fmtPct(f.earningsGrowth), 'fin-tile-3', true, f.earningsGrowth)}
        ${tile('EBITDA', fmtLarge(f.ebitda), 'fin-tile-3', true, f.ebitda)}
        ${tile('Profit Margin', fmtPct(f.profitMargins), 'fin-tile-3', true, f.profitMargins)}
        ${tile('Operating Margin', fmtPct(f.operatingMargins), 'fin-tile-3', true, f.operatingMargins)}
    </div>

    <div class="fin-group-title">Valuation &amp; Returns</div>
    <div class="fin-grid">
        ${tile('Market Cap', fmtLarge(f.marketCap), 'fin-tile')}
        ${tile('Enterprise Value', fmtLarge(f.enterpriseValue), 'fin-tile')}
        ${tile('P/E (TTM)', fmtX(f.trailingPE), 'fin-tile')}
        ${tile('Forward P/E', fmtX(f.forwardPE), 'fin-tile')}
        ${tile('Price/Book', fmtX(f.priceToBook), 'fin-tile')}
        ${tile('Beta', fmtNum(f.beta), 'fin-tile')}
        ${tile('Dividend Yield', fmtPct(f.dividendYield), 'fin-tile')}
        ${tile('ROE', fmtPct(f.returnOnEquity), 'fin-tile', true, f.returnOnEquity)}
    </div>

    <div class="fin-group-title">Financial Health</div>
    <div class="fin-grid">
        ${tile('Free Cash Flow', fmtLarge(f.freeCashflow), 'fin-tile', true, f.freeCashflow)}
        ${tile('Operating Cash Flow', fmtLarge(f.operatingCashflow), 'fin-tile', true, f.operatingCashflow)}
        ${tile('Total Debt', fmtLarge(f.totalDebt), 'fin-tile')}
        ${tile('Debt/Equity', fmtNum(f.debtToEquity), 'fin-tile')}
    </div>`
}

const RATING_SEGMENTS = [
    { key: 'strongBuy', label: 'Strong Buy', color: '#16a34a' },
    { key: 'buy', label: 'Buy', color: '#4ade80' },
    { key: 'hold', label: 'Hold', color: '#9ca3af' },
    { key: 'sell', label: 'Sell', color: '#f87171' },
    { key: 'strongSell', label: 'Strong Sell', color: '#ef4444' },
] as const

function buildAnalystRatingsBlock(ratings: StockFundamentals['analystRatings']): string {
    if (!ratings) return ''
    const total = ratings.strongBuy + ratings.buy + ratings.hold + ratings.sell + ratings.strongSell
    if (total === 0) return ''

    const bar = RATING_SEGMENTS.filter((s) => ratings[s.key] > 0)
        .map(
            (s) =>
                `<div style="width:${((ratings[s.key] / total) * 100).toFixed(1)}%;background:${s.color};"></div>`
        )
        .join('')

    const legend = RATING_SEGMENTS.map(
        (s) =>
            `<span style="margin-right:12px;white-space:nowrap;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color};vertical-align:middle;margin-right:4px;"></span>${s.label} <strong>${ratings[s.key]}</strong></span>`
    ).join('')

    return `
    <div class="fin-group-title">Analyst recommendations (${total})</div>
    <div style="display:flex;height:10px;width:100%;border-radius:4px;overflow:hidden;background:#e5e7eb;margin-bottom:6px;">${bar}</div>
    <div style="font-size:11px;color:#262626;margin-bottom:4px;">${legend}</div>`
}

function buildEarningsHistoryBlock(history: StockFundamentals['earningsHistory']): string {
    if (history.length === 0) return ''

    const rows = history
        .map((q) => {
            const beat =
                q.epsActual != null && q.epsEstimate != null ? q.epsActual >= q.epsEstimate : null
            const badge =
                beat == null
                    ? ''
                    : `<span style="font-weight:600;${beat ? 'color:#16a34a;' : 'color:#ef4444;'}">${beat ? 'Beat' : 'Miss'} ${fmtPct(q.surprisePercent)}</span>`
            return `
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:5px 0;border-bottom:1px solid #eee;">
                <span style="color:#909097;">${escapeHtml(q.quarter ?? q.period)}</span>
                <span style="color:#262626;">Act ${fmtNum(q.epsActual)} / Est ${fmtNum(q.epsEstimate)} &nbsp; ${badge}</span>
            </div>`
        })
        .join('')

    return `
    <div class="fin-group-title">Earnings vs estimates</div>
    <div style="margin-bottom:4px;">${rows}</div>`
}

function buildFundamentalsSection(f: StockFundamentals): string {
    const forwardTiles = f.forwardEstimates
        .map((e) => {
            const epsValue =
                e.epsAvg != null
                    ? `${fmtNum(e.epsAvg)}${e.epsGrowth != null ? ` · ${fmtPct(e.epsGrowth)}` : ''}`
                    : 'N/A'
            const revValue =
                e.revenueAvg != null
                    ? `${fmtLarge(e.revenueAvg)}${e.revenueGrowth != null ? ` · ${fmtPct(e.revenueGrowth)}` : ''}`
                    : 'N/A'
            return (
                tile(
                    `${escapeHtml(fmtEstimatePeriod(e.period))} EPS`,
                    epsValue,
                    'fin-tile',
                    true,
                    e.epsGrowth
                ) +
                tile(
                    `${escapeHtml(fmtEstimatePeriod(e.period))} Revenue`,
                    revValue,
                    'fin-tile',
                    true,
                    e.revenueGrowth
                )
            )
        })
        .join('')

    const revenueTiles = f.revenueTrend
        .map((r) => {
            const year = r.endDate ? r.endDate.slice(0, 4) : '—'
            return (
                tile(`Revenue ${year}`, fmtLarge(r.totalRevenue), 'fin-tile') +
                tile(`Net Income ${year}`, fmtLarge(r.netIncome), 'fin-tile', true, r.netIncome)
            )
        })
        .join('')

    const forwardBlock = forwardTiles
        ? `<div class="fin-group-title">Forward Estimates</div><div class="fin-grid">${forwardTiles}</div>`
        : ''
    const revenueBlock = revenueTiles
        ? `<div class="fin-group-title">Revenue Trend</div><div class="fin-grid">${revenueTiles}</div>`
        : ''

    const insiders = f.insiders
    const insiderBlock = insiders
        ? (() => {
              const isNeutral = insiders.netShares == null || insiders.netShares === 0
              const direction = isNeutral
                  ? 'Roughly neutral'
                  : insiders.netShares! > 0
                    ? 'Net buying'
                    : 'Net selling'
              const color = isNeutral
                  ? 'color:#909097;'
                  : insiders.netShares! > 0
                    ? 'color:#16a34a;'
                    : 'color:#ef4444;'
              return `
        <div class="fin-group-title">Insider activity</div>
        <div style="font-size:11px;color:#262626;margin-bottom:4px;">${insiders.buyCount} buys / ${insiders.sellCount} sells — <span style="font-weight:600;${color}">${direction} (${fmtNum(insiders.netShares, 0)} shares)</span></div>`
          })()
        : ''

    return `${forwardBlock}${buildEarningsHistoryBlock(f.earningsHistory)}${revenueBlock}${insiderBlock}`
}

function buildSigDevSection(sigDev: StockSigDev): string {
    return `
    <div class="extra-section">
        <div class="extra-section-title">What's Happening Now</div>
        <div class="extra-section-subtitle">The most notable recent event our AI identified for this company</div>
        <p class="sig-dev-headline">${escapeHtml(sigDev.headline)}</p>
        ${sigDev.date ? `<span class="sig-dev-date">${fmtDate(sigDev.date)}</span>` : ''}
    </div>`
}

function buildNewsSection(reports: StockReports[]): string {
    return `
    <div class="extra-section">
        <div class="extra-section-title">What Experts Are Saying</div>
        <div class="extra-section-subtitle">Recent reports and research from professional investors and analysts</div>
        <ul class="news-list">
            ${reports
                .map(
                    (item) => `
            <li class="news-item">
                <p class="news-headline">${escapeHtml(item.title)}</p>
                <p class="news-text">${escapeHtml(item.reportTitle)}</p>
                <span class="news-meta">${escapeHtml(item.provider)}${item.reportDate ? ` · ${fmtDate(item.reportDate, 'short')}` : ''}</span>
            </li>`
                )
                .join('')}
        </ul>
    </div>`
}

function buildScoresSection(scores: StockScores): string {
    return `
    <div class="extra-section">
        <div class="extra-section-title">How It Compares</div>
        <div class="extra-section-subtitle">How this company stacks up against others in the same sector (scale 0–1, higher is better)</div>
        ${buildScoreRows(scores)}
    </div>`
}

const PDF_CSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #ffffff;
            color: #262626;
            padding: 48px 56px;
            font-size: 14px;
            line-height: 1.6;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 24px;
            border-bottom: 1px solid #e8e8e8;
            margin-bottom: 32px;
        }
        .brand {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .brand span { color: #0047CC; font-family: monospace; }
        .meta { text-align: right; font-size: 12px; color: #909097; }
        .meta strong { display: block; font-size: 13px; color: #262626; margin-bottom: 2px; }

        .title-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 32px;
        }
        .stock-ticker {
            font-size: 40px;
            font-weight: 800;
            color: #0047CC;
            font-family: monospace;
            letter-spacing: -0.02em;
            line-height: 1;
        }
        .report-type {
            font-size: 13px;
            color: #909097;
            margin-top: 6px;
        }
        .sentiment-badge {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
        }
        .sentiment-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 600;
            color: #909097;
        }
        .sentiment-value {
            font-size: 22px;
            font-weight: 700;
        }

        .divider {
            border: none;
            border-top: 1px solid #e8e8e8;
            margin: 24px 0;
        }

        .analysis h2 {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #909097;
            margin-bottom: 10px;
            margin-top: 28px;
        }
        .analysis h2:first-child { margin-top: 0; }
        .analysis h3 {
            font-size: 13px;
            font-weight: 600;
            color: #262626;
            margin-top: 16px;
            margin-bottom: 6px;
        }
        .analysis p {
            font-size: 13px;
            color: #262626;
            line-height: 1.7;
            margin-bottom: 10px;
        }
        .analysis ul {
            list-style: none;
            padding: 0;
            margin: 8px 0 12px;
        }
        .analysis li {
            font-size: 13px;
            color: #262626;
            line-height: 1.6;
            position: relative;
            padding-left: 1.25rem;
            margin-bottom: 6px;
        }
        .analysis li::before {
            content: '•';
            color: #0047CC;
            font-weight: 700;
            position: absolute;
            left: 0;
            top: 0;
        }
        .analysis li > strong:first-child { display: block; }
        .analysis strong { color: #0047CC; font-weight: 600; }
        .analysis em { color: #909097; font-style: normal; }

        .footer {
            margin-top: 48px;
            padding-top: 20px;
            border-top: 1px solid #e8e8e8;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #909097;
        }

        .extra-section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e8e8e8;
        }
        .extra-section-title {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: -0.01em;
            color: #262626;
        }
        .extra-section-subtitle {
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0;
            color: #909097;
            margin-top: 3px;
            margin-bottom: 14px;
        }
        .sig-dev-headline {
            font-size: 13px;
            font-weight: 600;
            color: #262626;
            line-height: 1.5;
            margin-bottom: 4px;
        }
        .sig-dev-date { font-size: 11px; color: #909097; }
        .news-list { list-style: none; padding: 0; margin: 0; }
        .news-item {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .news-item:last-child { border-bottom: none; }
        .news-headline { font-size: 12px; font-weight: 600; color: #262626; line-height: 1.5; margin-bottom: 3px; }
        .news-text { font-size: 11px; color: #262626; }
        .news-meta { font-size: 11px; color: #909097; }
        .scores-desc { font-size: 12px; color: #909097; margin-bottom: 18px; }
        .fin-group-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #909097; margin-bottom: 8px; margin-top: 4px; }
        .fin-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .fin-tile { flex: 1 1 calc(25% - 6px); min-width: 90px; background: #f5f5f7; border-radius: 4px; padding: 8px 10px; }
        .fin-tile-3 { flex: 1 1 calc(33.333% - 6px); min-width: 90px; background: #f5f5f7; border-radius: 4px; padding: 8px 10px; }
        .fin-tile-label { font-size: 10px; color: #909097; margin-bottom: 3px; }
        .fin-tile-value { font-size: 12px; font-weight: 600; color: #262626; }
        .fin-range-wrap { margin-bottom: 14px; }
        .fin-range-bar { position: relative; height: 10px; background: #e5e7eb; border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
        .fin-range-legend { display: flex; justify-content: space-between; font-size: 10px; color: #909097; }
        .fin-range-meta { display: flex; gap: 14px; margin-top: 4px; font-size: 10px; color: #909097; }
    `

export function buildPdfHtml(params: {
    stock: ReportDTO['stock']
    type: ReportDTO['type']
    ai_response: ReportDTO['ai_response']
    sentiment: ReportDTO['sentiment']
    created_at: ReportDTO['created_at']
    stockData?: StockData | null
}) {
    const { stock, type, ai_response, sentiment, created_at, stockData } = params
    const label = PROMPT_TYPES[type as PropmptsEnum]?.label ?? type
    const isRiskAnalysis = type === PropmptsEnum.RISK_ANALYSIS
    const { label: sentimentLabel, color: sentimentColor } = isRiskAnalysis
        ? getRiskLevelInfo(sentiment)
        : getSentimentInfo(sentiment)
    const date = fmtDate(created_at)

    // Two sections mirroring the on-screen split: "Market & Analyst Outlook" then
    // "Key Financial Metrics". Each wrapper only renders when it has content.
    const marketOutlookInner =
        (stockData?.financials ? buildAnalystOutlookFinancials(stockData.financials) : '') +
        (stockData?.fundamentals
            ? buildAnalystRatingsBlock(stockData.fundamentals.analystRatings)
            : '')

    const keyMetricsInner =
        (stockData?.financials ? buildFinancialMetricsGroups(stockData.financials) : '') +
        (stockData?.fundamentals ? buildFundamentalsSection(stockData.fundamentals) : '')

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${PDF_CSS}</style>
</head>
<body>
    <div class="header">
        <div class="brand">StockBrew<span>AI</span></div>
        <div class="meta">
            <strong>${date}</strong>
            AI-Driven Analysis Report
        </div>
    </div>

    <div class="title-section">
        <div>
            <div class="stock-ticker">${escapeHtml(stock)}</div>
            <div class="report-type">${escapeHtml(label)}</div>
        </div>
        <div class="sentiment-badge">
            <span class="sentiment-label">${isRiskAnalysis ? 'Risk Level' : 'Sentiment'}</span>
            <span class="sentiment-value" style="color: ${sentimentColor}">${sentimentLabel}</span>
        </div>
    </div>

    ${
        marketOutlookInner
            ? `
    <div class="extra-section">
        <div class="extra-section-title" style="margin-bottom: 14px;">Market &amp; Analyst Outlook</div>
        ${marketOutlookInner}
    </div>`
            : ''
    }

    ${
        keyMetricsInner
            ? `
    <div class="extra-section">
        <div class="extra-section-title" style="margin-bottom: 14px;">Key Financial Metrics</div>
        ${keyMetricsInner}
    </div>`
            : ''
    }

    <hr class="divider" />

    <div class="analysis">
        ${sanitizeReportHtml(ai_response)}
    </div>

    ${stockData?.sig_dev?.headline ? buildSigDevSection(stockData.sig_dev) : ''}

    ${stockData?.reports?.length ? buildNewsSection(stockData.reports) : ''}

    ${stockData?.scores ? buildScoresSection(stockData.scores) : ''}

    <div class="footer">
        <span>Generated by StockBrewAI — For informational purposes only.</span>
        <span>${date}</span>
    </div>
</body>
</html>`
}
