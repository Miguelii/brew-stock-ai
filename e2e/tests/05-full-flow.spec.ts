import { test, expect } from '@playwright/test'
import {
    mockGetCredits,
    mockCreateReport,
    mockGetReports,
    mockGetLatestNews,
    mockExportReport,
} from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'

test.describe('Full happy path', () => {
    test('create → view → export report without errors', async ({ page }) => {
        // Set up all mocks upfront
        await mockGetCredits(page)
        await mockCreateReport(page, MOCK_REPORT_ID)
        await mockGetReports(page, [])
        await mockGetLatestNews(page)
        await mockExportReport(page)

        // 1. Navigate to analysis and create a report
        await page.goto('/analysis')

        await expect(page.getByTestId('ticker-input')).toBeVisible()
        await page.getByTestId('ticker-input').fill('AAPL')
        await page.getByTestId('analysis-type-select').click()
        await page.getByRole('option').first().click()
        await page.getByTestId('generate-report-button').click()

        // Toast confirms report is being generated
        await expect(page.getByText(/being generated/i)).toBeVisible({ timeout: 8000 })

        // Wait for redirect to /reports list
        await page.waitForURL('**/reports', { timeout: 10_000 })

        // 2. Navigate directly to the seeded report page
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        // Verify key sections are present
        await expect(page.getByRole('heading', { name: 'AAPL', exact: true })).toBeVisible({
            timeout: 10_000,
        })
        await expect(page.getByText('Summary of what our AI found:')).toBeVisible()
        await expect(page.locator('#key-metrics').getByText('Key Financial Metrics')).toBeVisible()
        await expect(page.getByText('AI Sentiment Score')).toBeVisible()
        await expect(page.getByText("What's Happening Now")).toBeVisible()
        await expect(page.getByText('What Experts Are Saying')).toBeVisible()
        await expect(page.getByText('How It Compares')).toBeVisible()

        // 3. Export the report
        const downloadPromise = page.waitForEvent('download', { timeout: 15_000 })
        await page.getByTestId('export-pdf-button').click()

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
