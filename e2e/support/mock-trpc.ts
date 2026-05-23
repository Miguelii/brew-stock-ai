import type { Page } from '@playwright/test'
import {
    MOCK_CREDITS,
    MOCK_EXPORT_PDF,
    MOCK_NEWS_ITEMS,
    MOCK_REPORT_ID,
} from '../fixtures/mock-data'

// tRPC v11 with httpBatchLink wraps all responses as an array
function batchResponse(data: unknown) {
    return JSON.stringify([{ result: { data } }])
}

export async function mockGetCredits(page: Page, credits = MOCK_CREDITS) {
    await page.route('**/api/trpc/getCredits**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(credits) })
    )
}

export async function mockGetReports(page: Page, reports: unknown[] = []) {
    await page.route('**/api/trpc/getReports**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(reports) })
    )
}

export async function mockCreateReport(page: Page, reportId = MOCK_REPORT_ID) {
    await page.route('**/api/trpc/createReport**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse({ id: reportId }) })
    )
}

export async function mockExportReport(page: Page, pdf = MOCK_EXPORT_PDF) {
    await page.route('**/api/trpc/exportReport**', (route) =>
        route.fulfill({
            contentType: 'application/json',
            body: batchResponse({ pdf, stock: 'AAPL' }),
        })
    )
}

export async function mockSendOtp(page: Page) {
    await page.route('**/api/trpc/sendOtp**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse({ status: 200 }) })
    )
}

export async function mockVerifyOtp(page: Page) {
    await page.route('**/api/trpc/verifyOtp**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse({ status: 200 }) })
    )
}

export async function mockGetLatestNews(page: Page, items = MOCK_NEWS_ITEMS) {
    await page.route('**/api/trpc/getLatestNews**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(items) })
    )
}
