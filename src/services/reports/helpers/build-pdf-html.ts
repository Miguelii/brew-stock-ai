// oxlint-disable max-lines
import { PROMPT_TYPES } from '@/lib/constants'
import { getSentimentInfo, getRiskLevelInfo } from '@/lib/sentiment'
import { fmtLarge, fmtPct, fmtX, fmtNum, fmtPrice } from '@/lib/formatters'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import type { ReportDTO, StockData, StockScores, StockFinancials } from '@/types/ReportDTO'

function buildScoreRows(scores: StockScores): string {
    const rows = [
        {
            label: 'Innovation',
            company: scores.company.innovativeness,
            sector: scores.sector.innovativeness,
        },
        { label: 'Hiring Velocity', company: scores.company.hiring, sector: scores.sector.hiring },
        {
            label: 'Sustainability',
            company: scores.company.sustainability,
            sector: scores.sector.sustainability,
        },
    ]

    return rows
        .map(({ label, company, sector }) => {
            const isNA = company === null || company === undefined
            const sectorPct = sector != null ? sector * 100 : 50

            const bar = isNA
                ? `<div style="position:absolute;inset:0;background:#e5e7eb;border-radius:4px;"></div>`
                : `<div style="position:absolute;top:0;bottom:0;left:0;width:${(company! * 100).toFixed(1)}%;background:#0047CC;border-radius:4px;"></div>`

            const tick =
                sector != null
                    ? `<div style="position:absolute;top:0;bottom:0;left:${sectorPct.toFixed(1)}%;width:2px;background:rgba(38,38,38,0.25);z-index:1;"></div>`
                    : ''

            const valueText = isNA
                ? `<span style="color:#909097;">N/A</span>`
                : `<span style="font-weight:600;">${company!.toFixed(2)}</span>`

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
        })
        .join('')
}

function signStyle(n: number | null | undefined): string {
    if (n == null) return 'color:#262626;'
    return n >= 0 ? 'color:#16a34a;' : 'color:#ef4444;'
}

function tile(label: string, value: string, colored = false, raw?: number | null): string {
    const valueStyle = colored ? signStyle(raw) : 'color:#262626;'
    const valueColor = value === 'N/A' ? 'color:#909097;' : valueStyle
    return `<div class="fin-tile"><div class="fin-tile-label">${label}</div><div class="fin-tile-value" style="${valueColor}">${value}</div></div>`
}

function tile3(label: string, value: string, colored = false, raw?: number | null): string {
    const valueStyle = colored ? signStyle(raw) : 'color:#262626;'
    const valueColor = value === 'N/A' ? 'color:#909097;' : valueStyle
    return `<div class="fin-tile-3"><div class="fin-tile-label">${label}</div><div class="fin-tile-value" style="${valueColor}">${value}</div></div>`
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
        ? `<div style="position:absolute;top:0;bottom:0;left:0;width:${currentPct.toFixed(1)}%;background:#0047CC33;border-radius:4px;"></div>
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

function buildFinancialsSection(f: StockFinancials): string {
    const hasRange =
        f.fiftyTwoWeekLow != null && f.fiftyTwoWeekHigh != null && f.currentPrice != null
    const upside =
        f.targetMeanPrice != null && f.currentPrice != null && f.currentPrice > 0
            ? (((f.targetMeanPrice - f.currentPrice) / f.currentPrice) * 100).toFixed(1)
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

    const targetBar =
        f.targetMeanPrice != null
            ? buildRangeBar(
                  f.targetLowPrice,
                  f.targetHighPrice,
                  f.currentPrice,
                  f.targetMeanPrice,
                  fmtPrice(f.targetLowPrice),
                  fmtPrice(f.targetHighPrice),
                  `Current ${fmtPrice(f.currentPrice)}`,
                  `Mean target ${fmtPrice(f.targetMeanPrice)}`
              )
            : ''

    const upsideBadge =
        upside != null
            ? `<span style="font-size:10px;font-weight:600;${parseFloat(upside) >= 0 ? 'color:#16a34a;' : 'color:#ef4444;'}">${parseFloat(upside) >= 0 ? '+' : ''}${upside}% to mean</span>`
            : ''

    return `
    <div class="fin-group-title">52-Week Range</div>
    ${rangeBar}

    ${
        f.targetMeanPrice != null
            ? `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div class="fin-group-title" style="margin:0;">Analyst Price Target</div>
        ${upsideBadge}
    </div>
    ${targetBar}`
            : ''
    }

    <div class="fin-group-title">Revenue &amp; Profitability</div>
    <div class="fin-grid">
        ${tile3('Total Revenue', fmtLarge(f.totalRevenue))}
        ${tile3('Revenue Growth', fmtPct(f.revenueGrowth), true, f.revenueGrowth)}
        ${tile3('Earnings Growth', fmtPct(f.earningsGrowth), true, f.earningsGrowth)}
        ${tile3('EBITDA', fmtLarge(f.ebitda), true, f.ebitda)}
        ${tile3('Profit Margin', fmtPct(f.profitMargins), true, f.profitMargins)}
        ${tile3('Operating Margin', fmtPct(f.operatingMargins), true, f.operatingMargins)}
    </div>

    <div class="fin-group-title">Valuation &amp; Returns</div>
    <div class="fin-grid">
        ${tile('Market Cap', fmtLarge(f.marketCap))}
        ${tile('Enterprise Value', fmtLarge(f.enterpriseValue))}
        ${tile('P/E (TTM)', fmtX(f.trailingPE))}
        ${tile('Forward P/E', fmtX(f.forwardPE))}
        ${tile('Price/Book', fmtX(f.priceToBook))}
        ${tile('Beta', fmtNum(f.beta))}
        ${tile('Dividend Yield', fmtPct(f.dividendYield))}
        ${tile('ROE', fmtPct(f.returnOnEquity), true, f.returnOnEquity)}
    </div>

    <div class="fin-group-title">Cash Flow &amp; Debt</div>
    <div class="fin-grid">
        ${tile('Free Cash Flow', fmtLarge(f.freeCashflow), true, f.freeCashflow)}
        ${tile('Operating Cash Flow', fmtLarge(f.operatingCashflow), true, f.operatingCashflow)}
        ${tile('Total Debt', fmtLarge(f.totalDebt))}
        ${tile('Debt/Equity', fmtNum(f.debtToEquity))}
    </div>`
}

// oxlint-disable-next-line max-lines-per-function
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
    const date = new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #fbfbfd;
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
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #909097;
            margin-bottom: 16px;
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
    </style>
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
            <div class="stock-ticker">${stock}</div>
            <div class="report-type">${label}</div>
        </div>
        <div class="sentiment-badge">
            <span class="sentiment-label">${isRiskAnalysis ? 'Risk Level' : 'Sentiment'}</span>
            <span class="sentiment-value" style="color: ${sentimentColor}">${sentimentLabel}</span>
        </div>
    </div>

    ${
        stockData?.financials
            ? `
    <div class="extra-section">
        <div class="extra-section-title">Key Financial Metrics</div>
        ${buildFinancialsSection(stockData.financials)}
    </div>`
            : ''
    }

    <hr class="divider" />

    <div class="analysis">
        ${ai_response}
    </div>

    ${
        stockData?.sig_dev?.headline
            ? `
    <div class="extra-section">
        <div class="extra-section-title">Recent Significant Development</div>
        <p class="sig-dev-headline">${stockData.sig_dev.headline}</p>
        ${stockData.sig_dev.date ? `<span class="sig-dev-date">${new Date(stockData.sig_dev.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>` : ''}
    </div>`
            : ''
    }

    ${
        stockData?.reports?.length
            ? `
    <div class="extra-section">
        <div class="extra-section-title">Latest News</div>
        <ul class="news-list">
            ${stockData.reports
                .map(
                    (item) => `
            <li class="news-item">
                <p class="news-headline">${item.title ?? ''}</p>
                <p class="news-text">${item.reportTitle ?? ''}</p>
                <span class="news-meta">${item.provider ?? ''}${item.reportDate ? ` · ${new Date(item.reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` : ''}</span>
            </li>`
                )
                .join('')}
        </ul>
    </div>`
            : ''
    }

    ${
        stockData?.scores
            ? `
    <div class="extra-section">
        <div class="extra-section-title">Company vs Sector Scores</div>
        <p class="scores-desc">Comparison of AI-derived metrics against industry sector averages (Scale 0.0 – 1.0).</p>
        ${buildScoreRows(stockData.scores)}
    </div>`
            : ''
    }

    <div class="footer">
        <span>Generated by StockBrewAI — For informational purposes only.</span>
        <span>${date}</span>
    </div>
</body>
</html>`
}
