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

        await expect(page.getByPlaceholder('Enter AAPL, TSLA, etc.')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Generate Report' })).toBeVisible()
    })

    test('submits the form and shows success toast + redirects to /reports', async ({ page }) => {
        await page.goto('/analysis')

        // Fill ticker
        await page.getByPlaceholder('Enter AAPL, TSLA, etc.').fill('AAPL')

        // Select analysis type via the combobox trigger
        await page.getByRole('combobox').click()
        await page.getByRole('option').first().click()

        // Submit
        await page.getByRole('button', { name: 'Generate Report' }).click()

        // Toast should appear
        await expect(page.getByText(/being generated/i)).toBeVisible({ timeout: 8000 })

        // Redirect to /reports (after the 2s delay in the handler)
        await page.waitForURL('**/reports', { timeout: 10_000 })
        expect(page.url()).toContain('/reports')
    })
})
