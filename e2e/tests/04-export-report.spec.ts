import { test, expect } from '@playwright/test'
import { mockGetLatestNews, mockExportReport } from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'
import { ReportPage } from '../pos/report.po'

test.describe('Export report', () => {
    test('clicking "Export PDF" triggers a file download', async ({ page }) => {
        await mockGetLatestNews(page)
        await mockExportReport(page)

        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await expect(report.exportButton).toBeVisible({ timeout: 10_000 })

        const downloadPromise = page.waitForEvent('download', { timeout: 15_000 })
        await report.exportButton.click()

        const download = await downloadPromise
        expect(download.suggestedFilename()).toBe('AAPL-analysis.pdf')
    })

    test('export button shows loading state while pending', async ({ page }) => {
        await mockGetLatestNews(page)

        // Delay the export response so we can observe the loading state
        await page.route('**/api/trpc/reports.export**', async (route) => {
            // oxlint-disable-next-line no-promise-executor-return
            await new Promise((resolve) => setTimeout(resolve, 1500))
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify([{ result: { data: { pdf: 'AAAA', stock: 'AAPL' } } }]),
            })
        })

        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await report.exportButton.click()

        // During loading the button should show "Generating..." and be disabled
        await expect(report.exportButton).toContainText('Generating...', { timeout: 3000 })
        await expect(report.exportButton).toBeDisabled()
    })
})
