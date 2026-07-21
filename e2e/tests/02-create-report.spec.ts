import { test, expect } from '@playwright/test'
import { mockGetCredits, mockCreateReport, mockGetReports } from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'
import { AnalysisFormPage } from '../pos/analysis-form.po'

test.describe('Create report flow', () => {
    test.beforeEach(async ({ page }) => {
        await mockGetCredits(page)
        await mockCreateReport(page, MOCK_REPORT_ID)
        await mockGetReports(page, [])
    })

    test('shows the analysis form with Generate Report button', async ({ page }) => {
        const analysis = new AnalysisFormPage(page)
        await analysis.goto()

        await expect(analysis.tickerInput).toBeVisible()
        await expect(analysis.generateButton).toBeVisible()
    })

    test('submits the form and shows success toast + redirects to /reports', async ({ page }) => {
        const analysis = new AnalysisFormPage(page)
        await analysis.goto()

        await analysis.fillAndSubmit('AAPL')

        // Toast should appear
        await expect(analysis.createdToast).toBeVisible({ timeout: 8000 })

        // Redirect to /reports (after the 2s delay in the handler)
        await page.waitForURL('**/reports', { timeout: 10_000 })
        expect(page.url()).toContain('/reports')
    })
})
