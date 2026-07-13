import { test, expect } from '@playwright/test'
import { mockGetCredits, mockCreateReport, mockGetReports } from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'

test.describe('Create report flow', () => {
    test.beforeEach(async ({ page }) => {
        await mockGetCredits(page)
        await mockCreateReport(page, MOCK_REPORT_ID)
        await mockGetReports(page, [])
    })

    test('shows the analysis form with Generate Report button', async ({ page }) => {
        await page.goto('/analysis')

        await expect(page.getByTestId('ticker-input')).toBeVisible()
        await expect(page.getByTestId('generate-report-button')).toBeVisible()
    })

    test('submits the form and shows success toast + redirects to /reports', async ({ page }) => {
        await page.goto('/analysis')

        // Fill ticker
        await page.getByTestId('ticker-input').fill('AAPL')

        // Select analysis type via the combobox trigger
        await page.getByTestId('analysis-type-select').click()
        await page.getByRole('option').first().click()

        // Submit
        await page.getByTestId('generate-report-button').click()

        // Toast should appear
        await expect(page.getByText(/being generated/iu)).toBeVisible({ timeout: 8000 })

        // Redirect to /reports (after the 2s delay in the handler)
        await page.waitForURL('**/reports', { timeout: 10_000 })
        expect(page.url()).toContain('/reports')
    })
})
