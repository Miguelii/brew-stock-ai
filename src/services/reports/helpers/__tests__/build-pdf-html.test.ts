import { describe, it, expect } from 'vitest'
import { buildPdfHtml } from '@/services/reports/helpers/build-pdf-html'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import type { StockData } from '@/types/ReportDTO'

const baseParams = {
    stock: 'AAPL',
    type: PropmptsEnum.STOCK_ANALYSIS,
    ai_response: '<h2>Analysis</h2><p>Apple is strong.</p>',
    sentiment: 72,
    created_at: '2024-06-15T10:00:00Z',
}

describe('buildPdfHtml', () => {
    it('returns valid HTML with doctype', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('<!DOCTYPE html>')
        expect(html).toContain('<html lang="en">')
        expect(html).toContain('</html>')
    })

    it('includes the stock ticker', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('AAPL')
    })

    it('includes the AI response content', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('Apple is strong.')
    })

    it('includes formatted date', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('June 15, 2024')
    })

    it('shows sentiment label for stock analysis', () => {
        const html = buildPdfHtml({ ...baseParams, sentiment: 72 })
        expect(html).toContain('Bullish')
    })

    it('shows risk level label for risk analysis', () => {
        const html = buildPdfHtml({
            ...baseParams,
            type: PropmptsEnum.RISK_ANALYSIS,
            sentiment: 30,
        })
        expect(html).toContain('High Risk')
    })

    it('includes significant development when provided', () => {
        const stockData: StockData = {
            ticker: 'AAPL',
            reports: null,
            scores: null,
            sig_dev: { headline: 'Apple announces new product', date: '2024-06-10' },
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Apple announces new product')
        expect(html).toContain('Recent Significant Development')
    })

    it('includes news reports when provided', () => {
        const stockData: StockData = {
            ticker: 'AAPL',
            reports: [
                {
                    title: 'Q3 Results',
                    provider: 'Reuters',
                    reportDate: '2024-06-12',
                    reportTitle: 'Strong Q3',
                },
            ],
            scores: null,
            sig_dev: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Q3 Results')
        expect(html).toContain('Reuters')
        expect(html).toContain('Latest News')
    })

    it('includes scores section when provided', () => {
        const stockData: StockData = {
            ticker: 'AAPL',
            reports: null,
            scores: {
                company: { innovativeness: 0.9, hiring: 0.7, sustainability: 0.8 },
                sector: { innovativeness: 0.6, hiring: 0.5, sustainability: 0.5 },
            },
            sig_dev: null,
        }
        const html = buildPdfHtml({ ...baseParams, stockData })
        expect(html).toContain('Company vs Sector Scores')
        expect(html).toContain('Innovation')
        expect(html).toContain('Hiring Velocity')
        expect(html).toContain('Sustainability')
    })

    it('renders without stockData', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).not.toContain('Recent Significant Development')
        expect(html).not.toContain('Latest News')
        expect(html).not.toContain('Company vs Sector Scores')
    })

    it('includes brand name', () => {
        const html = buildPdfHtml(baseParams)
        expect(html).toContain('StockBrew')
    })
})
