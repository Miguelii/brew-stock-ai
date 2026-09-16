import { PDF_COLORS } from '@/_bff/modules/reports/pdf/constants'

export const PDF_CSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: ${PDF_COLORS.background};
            color: ${PDF_COLORS.ink};
            padding: 48px 56px;
            font-size: 14px;
            line-height: 1.6;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 24px;
            border-bottom: 1px solid ${PDF_COLORS.border};
            margin-bottom: 32px;
        }
        .brand {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .brand-accent { color: ${PDF_COLORS.blue}; }
        .meta { text-align: right; font-size: 12px; color: ${PDF_COLORS.muted}; }
        .meta strong { display: block; font-size: 13px; color: ${PDF_COLORS.ink}; margin-bottom: 2px; }

        .title-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 32px;
        }
        .stock-ticker {
            font-size: 40px;
            font-weight: 800;
            color: ${PDF_COLORS.blue};
            font-family: monospace;
            letter-spacing: -0.02em;
            line-height: 1;
        }
        .report-type {
            font-size: 13px;
            color: ${PDF_COLORS.muted};
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
            color: ${PDF_COLORS.muted};
        }
        .sentiment-value {
            font-size: 22px;
            font-weight: 700;
        }

        .divider {
            border: none;
            border-top: 1px solid ${PDF_COLORS.border};
            margin: 24px 0;
        }

        .analysis h2 {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: ${PDF_COLORS.muted};
            margin-bottom: 10px;
            margin-top: 28px;
        }
        .analysis h2:first-child { margin-top: 0; }
        .analysis h3 {
            font-size: 13px;
            font-weight: 600;
            color: ${PDF_COLORS.ink};
            margin-top: 16px;
            margin-bottom: 6px;
        }
        .analysis p {
            font-size: 13px;
            color: ${PDF_COLORS.ink};
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
            color: ${PDF_COLORS.ink};
            line-height: 1.6;
            position: relative;
            padding-left: 1.25rem;
            margin-bottom: 6px;
        }
        .analysis li::before {
            content: '•';
            color: ${PDF_COLORS.blue};
            font-weight: 700;
            position: absolute;
            left: 0;
            top: 0;
        }
        .analysis li > strong:first-child { display: block; }
        .analysis strong { color: ${PDF_COLORS.blue}; font-weight: 600; }
        .analysis em { color: ${PDF_COLORS.muted}; font-style: normal; }

        .footer {
            margin-top: 48px;
            padding-top: 20px;
            border-top: 1px solid ${PDF_COLORS.border};
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: ${PDF_COLORS.muted};
        }

        .extra-section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid ${PDF_COLORS.border};
        }
        .extra-section-title {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: -0.01em;
            color: ${PDF_COLORS.ink};
        }
        .extra-section-subtitle {
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0;
            color: ${PDF_COLORS.muted};
            margin-top: 3px;
            margin-bottom: 14px;
        }
        .sig-dev-headline {
            font-size: 13px;
            font-weight: 600;
            color: ${PDF_COLORS.ink};
            line-height: 1.5;
            margin-bottom: 4px;
        }
        .sig-dev-date { font-size: 11px; color: ${PDF_COLORS.muted}; }
        .news-list { list-style: none; padding: 0; margin: 0; }
        .news-item {
            padding: 10px 0;
            border-bottom: 1px solid ${PDF_COLORS.rowDivider};
        }
        .news-item:last-child { border-bottom: none; }
        .news-headline { font-size: 12px; font-weight: 600; color: ${PDF_COLORS.ink}; line-height: 1.5; margin-bottom: 3px; }
        .news-text { font-size: 11px; color: ${PDF_COLORS.ink}; }
        .news-meta { font-size: 11px; color: ${PDF_COLORS.muted}; }
        .fin-group-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${PDF_COLORS.muted}; margin-bottom: 8px; margin-top: 4px; }
        .fin-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .fin-tile-3 { flex: 1 1 calc(33.333% - 6px); min-width: 90px; background: ${PDF_COLORS.surface}; border-radius: 4px; padding: 8px 10px; }
        .fin-tile-label { font-size: 10px; color: ${PDF_COLORS.muted}; margin-bottom: 3px; }
        .fin-tile-value { font-size: 12px; font-weight: 600; color: ${PDF_COLORS.ink}; }
        .fin-range-wrap { margin-bottom: 14px; }
        .fin-range-bar { position: relative; height: 10px; background: ${PDF_COLORS.track}; border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
        .fin-range-legend { display: flex; justify-content: space-between; font-size: 10px; color: ${PDF_COLORS.muted}; }
        .fin-range-meta { display: flex; gap: 14px; margin-top: 4px; font-size: 10px; color: ${PDF_COLORS.muted}; }

        /* Graded category cards, mirroring the on-screen financials layout. */
        .fin-cat-grid { display: flex; gap: 8px; margin-bottom: 8px; }
        .fin-cat-grid .fin-cat-card { flex: 1 1 0; min-width: 0; margin-bottom: 0; }
        .fin-cat-card {
            border: 1px solid ${PDF_COLORS.border};
            background: ${PDF_COLORS.surface};
            padding: 12px;
            margin-bottom: 8px;
        }
        .fin-cat-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            border-bottom: 1px solid ${PDF_COLORS.border};
            padding-bottom: 6px;
            margin-bottom: 4px;
        }
        .fin-cat-heading { display: flex; flex-direction: column; min-width: 0; }
        .fin-cat-title { font-size: 13px; font-weight: 600; color: ${PDF_COLORS.ink}; }
        .fin-cat-question { font-size: 11px; color: ${PDF_COLORS.muted}; }
        .fin-grade {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 44px;
            padding: 3px 10px;
            flex-shrink: 0;
        }
        .fin-grade-letter { font-size: 18px; font-weight: 700; line-height: 1; }
        .fin-grade-word { font-size: 9px; line-height: 1.3; }
        .fin-cat-rows { display: flex; flex-direction: column; }
        .fin-metric-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
            padding: 5px 0;
            border-top: 1px solid ${PDF_COLORS.rowDivider};
        }
        .fin-metric-row:first-child { border-top: none; }
        .fin-metric-main { min-width: 0; }
        .fin-metric-label { font-size: 11px; color: ${PDF_COLORS.muted}; line-height: 1.3; }
        .fin-metric-help { font-size: 9px; color: ${PDF_COLORS.faint}; line-height: 1.3; }
        .fin-metric-side { text-align: right; flex-shrink: 0; }
        .fin-metric-value { font-size: 11px; font-weight: 600; line-height: 1.3; }
        .fin-metric-verdict { font-size: 9px; font-weight: 500; line-height: 1.2; }

        .fin-block { border: 1px solid ${PDF_COLORS.border}; background: ${PDF_COLORS.surface}; padding: 12px; margin-bottom: 8px; }
        .fin-block-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${PDF_COLORS.muted}; margin-bottom: 4px; }
        .fin-block-row { display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding: 5px 0; }
        .fin-block-row-sep { border-top: 1px solid ${PDF_COLORS.rowDivider}; }
        .fin-block-row-sep:first-of-type { border-top: none; }
    `
