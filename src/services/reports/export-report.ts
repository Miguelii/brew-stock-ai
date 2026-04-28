import 'server-only'

import { Effect } from 'effect'
import puppeteer from 'puppeteer'
import { createSbServerClient } from '@/lib/utils.server'
import { PROMPT_TYPES } from '@/lib/constants'
import {
    CreateSbClientError,
    ExportReportError,
    UnauthenticatedError,
} from '@/services/utils/constants'
import type { ReportDTO } from '@/types/ReportDTO'
import type { PropmptsEnum } from '@/types/PropmptsEnum'
import { getSession } from '@/services/supabase/get-session'

function getSentimentLabel(sentiment: ReportDTO['sentiment']) {
    if (sentiment >= 69) return { label: 'Bullish', color: '#28a754' }
    if (sentiment >= 30) return { label: 'Neutral', color: '#f59e0b' }
    return { label: 'Bearish', color: '#ef4444' }
}

function buildHtml(params: {
    stock: ReportDTO['stock']
    type: ReportDTO['type']
    ai_response: ReportDTO['ai_response']
    sentiment: ReportDTO['sentiment']
    created_at: ReportDTO['created_at']
}) {
    const { stock, type, ai_response, sentiment, created_at } = params
    const label = PROMPT_TYPES[type as PropmptsEnum]?.label ?? type
    const { label: sentimentLabel, color: sentimentColor } = getSentimentLabel(sentiment)
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

    <div class="footer">
        <span>Generated by StockBrewAI — For informational purposes only.</span>
        <span>${date}</span>
    </div>
</body>
</html>`
}

export const exportReport = Effect.fn('exportReport')(function* (id: ReportDTO['id']) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'eexprptsbclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'eexprptunauthd' })
    }

    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('stock, type, ai_response, sentiment, created_at')
                .eq('id', id)
                .eq('user_id', user.id)
                .single(),
        catch: (cause) => new ExportReportError({ cause, error_hash: 'eexprptfetch' }),
    })

    if (error) {
        return yield* new ExportReportError({ cause: error, error_hash: 'eexprpterr' })
    }

    const html = buildHtml(report)

    const pdf = yield* Effect.tryPromise({
        try: async () => {
            // oxlint-disable-next-line import/no-named-as-default-member
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })
            const buffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0', right: '0', bottom: '0', left: '0' },
            })
            await browser.close()
            return buffer
        },
        catch: (cause) => new ExportReportError({ cause, error_hash: 'eexprptpdf' }),
    })

    return {
        pdf: Buffer.from(pdf).toString('base64'),
        stock: report.stock,
    }
})
