import { test, expect } from '@playwright/test'
import { mockGetLatestNews } from '../support/mock-trpc'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'

// The report page is server-rendered using data from the mock Supabase server (globalSetup)
test.describe('View report page', () => {
    test.beforeEach(async ({ page }) => {
        await mockGetLatestNews(page)
    })

    test('renders the stock ticker in the heading', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByRole('heading', { name: 'AAPL', exact: true })).toBeVisible({
            timeout: 10_000,
        })
    })

    test('shows the report type badge', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByText(/Full Wall Street Style Stock Analysis/i).first()).toBeVisible()
    })

    test('section nav has plain-English labels', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByRole('button', { name: 'Summary' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Key Financial Metrics' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Full AI Report' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Sig. Dev.' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Expert Coverage' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Sector Scores' })).toBeVisible()
    })

    test('"Summary" section is visible', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByText('Summary of what our AI found:')).toBeVisible()
        // Scope to #overview to avoid matching the same text in the full AI report section
        await expect(page.locator('#overview').getByText(/pricing power/i)).toBeVisible()
    })

    test('"Key Financial Metrics" section renders financial metrics', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        // Scope to #key-metrics to avoid matching the nav button and the AI response paragraph
        const section = page.locator('#key-metrics')

        await expect(section.getByText('Key Financial Metrics')).toBeVisible()
        await expect(section.getByText(/Where the stock has traded/i)).toBeVisible()
        await expect(section.getByText(/What analysts think/i)).toBeVisible()
        await expect(section.getByText('Revenue & Profitability')).toBeVisible()
        await expect(section.getByText('Valuation & Returns')).toBeVisible()
        await expect(section.getByText('Financial Health')).toBeVisible()
    })

    test('"AI Sentiment Score" gauge is visible', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByText('AI Sentiment Score')).toBeVisible()
    })

    test('"What\'s Happening Now" section is visible', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByText("What's Happening Now")).toBeVisible()
        await expect(
            page.getByText(
                'Apple reports record Q1 2024 earnings, beating analyst expectations by 8%'
            )
        ).toBeVisible()
    })

    test('"What Experts Are Saying" section is visible', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByText('What Experts Are Saying')).toBeVisible()
        await expect(page.getByText('Goldman Sachs')).toBeVisible()
    })

    test('"How It Compares" section is visible with plain labels', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await expect(page.getByText('How It Compares')).toBeVisible()
        await expect(page.getByText('Workforce Growth')).toBeVisible()
        await expect(page.getByText('This company', { exact: true })).toBeVisible()
        await expect(page.getByText('Sector average')).toBeVisible()
    })

    test('clicking a nav label scrolls to the corresponding section', async ({ page }) => {
        await page.goto(`/reports/${MOCK_REPORT_ID}`)

        await page.getByRole('button', { name: 'Key Financial Metrics' }).click()

        // The section should be roughly in the viewport
        const section = page.locator('#key-metrics')
        await expect(section).toBeInViewport({ timeout: 3000 })
    })
})
