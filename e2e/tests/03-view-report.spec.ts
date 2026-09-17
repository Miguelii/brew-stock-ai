import { test, expect } from '@playwright/test'
import { mockGetLatestNews } from '../support/mock-trpc'
import { mockRemoteImages } from '../support/mock-images'
import { MOCK_REPORT_ID } from '../fixtures/mock-data'
import { ReportPage } from '../pos/report.po'

// The report page is server-rendered using data from the mock Supabase server (globalSetup)
test.describe('View report page', () => {
    test.beforeEach(async ({ page }) => {
        await mockGetLatestNews(page)
        await mockRemoteImages(page)
    })

    test('"Recent news" features the photo story and lists the latest headlines', async ({
        page,
    }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await expect(report.section('latest-news')).toContainText('Recent news mentioning')

        // The Benzinga story is the most recent one with a real photo, so it is featured
        // even though two Yahoo items (placeholder logo only) are newer
        await expect(report.latestNewsLeadHeadline).toHaveText(
            'Warren Buffett increases Berkshire stake in Apple to 5.9%'
        )
        await expect(report.latestNewsLeadImage).toBeVisible()
        await expect(report.latestNewsLeadCover).toHaveCount(0)

        // The rest are the most recent headlines in order, capped at four
        await expect(report.latestNewsItems).toHaveCount(4)
        await expect(report.latestNewsItemHeadlines.nth(0)).toContainText(
            'Apple Vision Pro launches to strong demand in US market'
        )
        await expect(report.latestNewsItemHeadlines.nth(1)).toContainText(
            'Apple services revenue hits record $23.1B in Q1 2024'
        )
        await expect(report.latestNewsItemHeadlines.nth(3)).toContainText(
            'Apple: the services flywheel keeps compounding'
        )
    })

    test('renders the stock ticker in the heading', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await expect(report.tickerHeading).toHaveText('AAPL', { timeout: 10_000 })
    })

    test('shows the report type badge', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await expect(report.typeBadge).toContainText('Full Wall Street Style Stock Analysis')
    })

    test('section nav has plain-English labels', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await expect(report.nav('overview')).toHaveText('Summary')
        await expect(report.nav('market-outlook')).toHaveText('Market & Analyst Outlook')
        await expect(report.nav('key-metrics')).toHaveText('Key Financial Metrics')
        await expect(report.nav('analysis')).toHaveText('Full Report')
        await expect(report.nav('sig-dev')).toHaveText('Happening Now')
        await expect(report.nav('media-mentions')).toHaveText('Expert Coverage')
        await expect(report.nav('sector-scores')).toHaveText('Sector Scores')
    })

    test('"Summary" section is visible', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('overview')
        await expect(section).toContainText('Summary of what our engine found:')
        await expect(section).toContainText(/pricing power/iu)
    })

    test('"Market & Analyst Outlook" section renders price chart and analyst views', async ({
        page,
    }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('market-outlook')

        await expect(section).toContainText('Market & Analyst Outlook')
        await expect(section).toContainText(/Where the stock has traded/iu)
        await expect(section).toContainText(/What analysts think/iu)

        // Analyst recommendations bar (counts in MOCK_FUNDAMENTALS sum to 35)
        await expect(section).toContainText('Analyst recommendations (35)')
        await expect(section).toContainText('Strong Buy')
        await expect(section).toContainText('Hold')
    })

    test('"Key Financial Metrics" section renders financial metrics', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('key-metrics')

        await expect(section).toContainText('Key Financial Metrics')
        // Metrics are grouped into graded category scorecards
        await expect(section).toContainText('Growth')
        await expect(section).toContainText('Profitability')
        await expect(section).toContainText('Valuation')
        await expect(section).toContainText('Financial Health')
    })

    test('"Key Financial Metrics" section renders the fundamentals blocks', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('key-metrics')

        // Forward estimates fold into the Growth card — '+1q' maps to a friendly "Next Quarter" label
        await expect(section).toContainText('Next Quarter EPS')

        // Earnings history with a beat badge (epsActual > epsEstimate)
        await expect(section).toContainText('Earnings vs estimates')
        await expect(section).toContainText(/Beat/iu)

        // Multi-year revenue trend folds into the Growth card — endDate 2025-09-30 yields a "Revenue 2025" row
        await expect(section).toContainText('Revenue 2025')

        // Insider activity — negative net shares reads as net selling
        await expect(section).toContainText('Insider activity')
        await expect(section).toContainText(/Net selling/iu)
    })

    test('"Sentiment Score" gauge is visible', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await expect(report.sentimentScore).toHaveText('Sentiment Score')
    })

    test('"What\'s Happening Now" section is visible', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('sig-dev')
        await expect(section).toContainText("What's Happening Now")
        await expect(section).toContainText(
            'Apple reports record Q1 2024 earnings, beating analyst expectations by 8%'
        )
    })

    test('"What Experts Are Saying" section is visible', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('media-mentions')
        await expect(section).toContainText('What Experts Are Saying')
        await expect(section).toContainText('Goldman Sachs')
    })

    test('"How It Compares" section is visible with plain labels', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        const section = report.section('sector-scores')
        await expect(section).toContainText('How It Compares')
        await expect(section).toContainText('Workforce Growth')
        await expect(section).toContainText('This company')
        await expect(section).toContainText('Sector average')
    })

    test('clicking a nav label scrolls to the corresponding section', async ({ page }) => {
        const report = new ReportPage(page)
        await report.goto(MOCK_REPORT_ID)

        await report.nav('key-metrics').click()

        // The section should be roughly in the viewport
        await expect(report.section('key-metrics')).toBeInViewport({ timeout: 3000 })
    })
})
