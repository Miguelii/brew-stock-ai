import { PROMPT_TYPES } from '@/lib/constants'
import { getSentimentInfo } from '@/lib/sentiment'
import type { PropmptsEnum } from '@/types/PropmptsEnum'
import type { ReportDTO, StockData, StockScores } from '@/types/ReportDTO'

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
                ? `<div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,#d1d5db 0px,#d1d5db 3px,transparent 3px,transparent 8px);"></div>`
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
    const { label: sentimentLabel, color: sentimentColor } = getSentimentInfo(sentiment)
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
            <span class="sentiment-label">Sentiment</span>
            <span class="sentiment-value" style="color: ${sentimentColor}">${sentimentLabel}</span>
        </div>
    </div>

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
