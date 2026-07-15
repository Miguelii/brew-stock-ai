import { test, expect } from '@playwright/test'
import { mockGetLatestNews, mockExportReport } from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'

test.describe('Export report', () => {
    test('clicking "Export PDF" triggers a file download', async ({ page }) => {
        await mockGetLatestNews(page)
        await mockExportReport(page)

        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByTestId('export-pdf-button')).toBeVisible({
            timeout: 10_000,
        })

        const downloadPromise = page.waitForEvent('download', { timeout: 15_000 })
        await page.getByTestId('export-pdf-button').click()

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

        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await page.getByTestId('export-pdf-button').click()

        // During loading the button should show "Generating..." and be disabled
        await expect(page.getByRole('button', { name: 'Generating...' })).toBeVisible({
            timeout: 3000,
        })
        await expect(page.getByRole('button', { name: 'Generating...' })).toBeDisabled()
    })
})
