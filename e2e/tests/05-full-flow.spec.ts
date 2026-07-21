import { test, expect } from '@playwright/test'
import {
    mockGetCredits,
    mockCreateReport,
    mockGetReports,
    mockGetLatestNews,
    mockExportReport,
} from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'
import { AnalysisFormPage } from '../pos/analysis-form.po'
import { ReportPage } from '../pos/report.po'

test.describe('Full happy path', () => {
    test('create → view → export report without errors', async ({ page }) => {
        // Set up all mocks upfront
        await mockGetCredits(page)
        await mockCreateReport(page, MOCK_REPORT_ID)
        await mockGetReports(page, [])
        await mockGetLatestNews(page)
        await mockExportReport(page)

        // 1. Navigate to analysis and create a report
        const analysis = new AnalysisFormPage(page)
        await analysis.goto()

        await expect(analysis.tickerInput).toBeVisible()
        await analysis.fillAndSubmit('AAPL')

        // Toast confirms report is being generated
        await expect(analysis.createdToast).toBeVisible({ timeout: 8000 })

        // Wait for redirect to /reports list
        await page.waitForURL('**/reports', { timeout: 10_000 })

        // 2. Navigate directly to the seeded report page
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        // Verify key sections are present
        await expect(report.tickerHeading).toHaveText('AAPL', { timeout: 10_000 })
        await expect(report.section('overview')).toContainText('Summary of what our engine found:')
        await expect(report.section('key-metrics')).toContainText('Key Financial Metrics')
        await expect(report.sentimentScore).toHaveText('Sentiment Score')
        await expect(report.section('sig-dev')).toContainText("What's Happening Now")
        await expect(report.section('media-mentions')).toContainText('What Experts Are Saying')
        await expect(report.section('sector-scores')).toContainText('How It Compares')

        // 3. Export the report
        const downloadPromise = page.waitForEvent('download', { timeout: 15_000 })
        await report.exportButton.click()

        const download = await downloadPromise
        expect(download.suggestedFilename()).toBe('AAPL-analysis.pdf')

        // No console errors during the full flow
        const consoleErrors: string[] = []
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text())
        })

        expect(consoleErrors.filter((e) => !e.includes('favicon'))).toHaveLength(0)
    })
})
