import { PDF_COLORS } from '@/_bff/modules/reports/pdf/constants'

// Mirrors the report page: tiles on paper, bold uppercase "display" type standing in for Anton
// (the PDF cannot load web fonts), and a print-friendly light palette.
export const PDF_CSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: ${PDF_COLORS.background};
            color: ${PDF_COLORS.ink};
            padding: 8px 44px 0;
            font-size: 12px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .display {
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.01em;
            line-height: 0.95;
        }
        .eyebrow {
            font-family: 'Courier New', Courier, monospace;
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: ${PDF_COLORS.muted};
        }
        .muted { color: ${PDF_COLORS.muted}; }
        .small { font-size: 10.5px; }
        .accent { color: ${PDF_COLORS.blue}; }

        .tile {
            background: ${PDF_COLORS.paper};
            border: 1px solid ${PDF_COLORS.border};
            border-radius: 12px;
            padding: 12px 14px;
            break-inside: avoid;
        }
        .pill {
            display: inline-block;
            border-radius: 999px;
            padding: 2px 9px;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
        }
        .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
        .grid-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 8px; }
        .bar-track { height: 5px; border-radius: 999px; background: ${PDF_COLORS.headingRule}; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 999px; }

        /* Header */
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 14px;
            margin-bottom: 16px;
            border-bottom: 1px solid ${PDF_COLORS.border};
        }
        .brand { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
        .brand-accent { color: ${PDF_COLORS.blue}; }
        .topbar-meta { text-align: right; font-size: 11px; color: ${PDF_COLORS.muted}; }
        .topbar-meta strong { display: block; font-size: 12px; color: ${PDF_COLORS.ink}; }
        .hero {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
            background: ${PDF_COLORS.paper};
            border: 1px solid ${PDF_COLORS.border};
            border-radius: 16px;
            padding: 20px 24px;
        }
        .hero-ticker { font-size: 60px; color: ${PDF_COLORS.blue}; margin-top: 8px; }
        .hero-subtitle { font-size: 14px; font-weight: 700; margin-top: 8px; }
        .hero-sentiment { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right; }
        .hero-sentiment-value { font-size: 22px; }

        /* Sections: white cards with the page's thick heading rule */
        .section {
            margin-top: 18px;
            border: 1px solid ${PDF_COLORS.border};
            border-radius: 16px;
            padding: 16px 18px;
        }
        .section-paper { background: ${PDF_COLORS.paper}; }
        .section-head {
            border-bottom: 2px solid ${PDF_COLORS.headingRule};
            padding-bottom: 10px;
            margin-bottom: 14px;
            break-after: avoid;
        }
        .section-title { font-size: 20px; }
        .section-subtitle { font-size: 10.5px; color: ${PDF_COLORS.muted}; margin-top: 4px; }

        .subsection { margin-top: 18px; }
        .subhead {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 12px;
            border-bottom: 1px solid ${PDF_COLORS.border};
            padding-bottom: 6px;
            margin-bottom: 10px;
            break-after: avoid;
        }
        .subhead-title { font-size: 15px; }

        /* Overview */
        .overview { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 12px; margin-top: 18px; }
        .overview-single { grid-template-columns: minmax(0, 1fr); }
        .overview .section { margin-top: 0; }
        .summary-badge {
            display: inline-block;
            background: #dbe6ff;
            color: ${PDF_COLORS.blue};
            border-radius: 999px;
            padding: 4px 12px;
        }
        .sentiment-card { text-align: center; break-inside: avoid; }
        .sentiment-gauge { width: 100%; max-width: 220px; margin: 0 auto; display: block; }
        .sentiment-active { font-size: 12px; font-weight: 800; letter-spacing: 0.04em; margin-top: 4px; }
        .sentiment-disclaimer { font-size: 9.5px; color: ${PDF_COLORS.muted}; margin-top: 6px; line-height: 1.5; }

        /* Metric tiles */
        .tile-label { display: block; }
        .tile-help { display: block; font-size: 9.5px; color: ${PDF_COLORS.faint}; margin-top: 2px; line-height: 1.35; }
        .tile-value { display: block; font-size: 26px; margin-top: 10px; }
        .tile-detail { display: block; font-size: 10px; color: ${PDF_COLORS.muted}; margin-top: 3px; }
        .tile .pill { margin-top: 8px; }
        .score-letter { font-size: 34px; }
        .score-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
        .score-row .bar-track { flex: 1; }
        .context-strip { display: flex; flex-wrap: wrap; gap: 4px 22px; font-size: 11px; margin-top: 8px; }
        .context-strip strong { margin-left: 6px; }

        /* Revenue chart */
        .rev-chart { display: flex; gap: 14px; margin-top: 6px; break-inside: avoid; }
        .rev-col { flex: 1; min-width: 0; text-align: center; }
        .rev-plot { position: relative; height: 110px; }
        .rev-value { position: absolute; left: 0; right: 0; font-size: 11px; font-weight: 700; }
        .rev-bar { position: absolute; left: 0; right: 0; bottom: 0; border-radius: 10px 10px 0 0; }

        .track-record { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 12px; margin-top: 18px; break-inside: avoid; }
        .track-record-single { grid-template-columns: minmax(0, 1fr); }
        .track-record .subsection { margin-top: 0; }

        /* Market outlook */
        .range-bar { position: relative; height: 10px; background: ${PDF_COLORS.track}; border-radius: 999px; overflow: hidden; margin: 8px 0 4px; }
        .range-legend { display: flex; justify-content: space-between; font-size: 10px; color: ${PDF_COLORS.muted}; }
        .row-between { display: flex; justify-content: space-between; align-items: center; gap: 12px; }

        /* Analysis prose */
        .analysis h2 { font-size: 15px; font-weight: 800; text-transform: uppercase; margin: 22px 0 8px; }
        .analysis h2:first-child { margin-top: 0; }
        .analysis h3 { font-size: 13px; font-weight: 700; margin: 14px 0 6px; }
        .analysis p { font-size: 12px; line-height: 1.7; margin-bottom: 9px; }
        .analysis ul { list-style: none; margin: 6px 0 12px; }
        .analysis li { font-size: 12px; line-height: 1.6; position: relative; padding-left: 16px; margin-bottom: 5px; }
        .analysis li::before { content: '•'; color: ${PDF_COLORS.blue}; font-weight: 700; position: absolute; left: 0; top: 0; }
        .analysis li > strong:first-child { display: block; }
        .analysis strong { color: ${PDF_COLORS.blue}; font-weight: 700; }
        .analysis em { color: ${PDF_COLORS.muted}; font-style: normal; }
        .analysis table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; font-size: 11px; }
        .analysis th, .analysis td { border-bottom: 1px solid ${PDF_COLORS.rowDivider}; padding: 5px 6px; text-align: left; }

        /* Significant development */
        .sigdev { display: flex; align-items: center; gap: 20px; break-inside: avoid; }
        .calendar {
            flex-shrink: 0;
            width: 88px;
            text-align: center;
            background: ${PDF_COLORS.amberSoft};
            color: ${PDF_COLORS.amberDeep};
            border-radius: 12px;
            padding: 8px 6px;
        }
        .calendar-day { font-size: 46px; color: ${PDF_COLORS.navy}; }
        .calendar-year { font-size: 10px; font-weight: 700; }
        .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${PDF_COLORS.amber}; margin-right: 6px; vertical-align: middle; }
        .sigdev-headline { font-size: 20px; font-weight: 800; line-height: 1.2; margin-top: 8px; }

        /* Expert coverage */
        .expert-list { list-style: none; }
        .expert-item { padding: 12px 0; border-bottom: 1px solid ${PDF_COLORS.rowDivider}; break-inside: avoid; }
        .expert-item:first-child { padding-top: 0; }
        .expert-item:last-child { border-bottom: none; padding-bottom: 0; }
        .expert-title { font-size: 13px; font-weight: 700; margin-top: 4px; }
        .expert-summary { font-size: 11px; color: #4a4b4f; line-height: 1.6; margin-top: 5px; }

        /* Sector scores */
        .score-card { text-align: center; }
        .score-description { font-size: 9.5px; color: ${PDF_COLORS.muted}; margin-top: 3px; line-height: 1.4; }
        .score-gauge-wrap { position: relative; margin: 10px auto 0; max-width: 170px; }
        .score-gauge { width: 100%; display: block; }
        .score-value { position: absolute; left: 0; right: 0; bottom: 0; font-size: 34px; }
        .score-delta { font-size: 10px; color: ${PDF_COLORS.muted}; margin-top: 5px; }
        .legend { display: flex; justify-content: center; gap: 22px; font-size: 10px; color: ${PDF_COLORS.muted}; margin-top: 12px; }
        .legend-mark { display: inline-block; vertical-align: middle; margin-right: 5px; }

        .footer {
            margin-top: 28px;
            padding-top: 14px;
            border-top: 1px solid ${PDF_COLORS.border};
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: ${PDF_COLORS.muted};
        }
    `
