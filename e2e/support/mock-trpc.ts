import type { Page } from '@playwright/test'
import type { Invoice } from '@/types/Invoice'
import {
    MOCK_CREDITS,
    MOCK_EXPORT_PDF,
    MOCK_INVOICES,
    MOCK_NEWS_ITEMS,
    MOCK_REPORT_ID,
    MOCK_STRIPE_URL,
} from '../fixtures/mock-data'

// tRPC v11 with httpBatchLink wraps all responses as an array
function batchResponse(data: unknown) {
    return JSON.stringify([{ result: { data } }])
}

export async function mockGetCredits(page: Page, credits = MOCK_CREDITS) {
    // RegExp with a lookahead so `credits.get` never swallows `credits.getInvoices`
    await page.route(/\/api\/trpc\/credits\.get(?![A-Za-z])/, (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(credits) })
    )
}

export async function mockGetReports(page: Page, reports: unknown[] = []) {
    await page.route('**/api/trpc/reports.getAll**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(reports) })
    )
}

export async function mockCreateReport(page: Page, reportId = MOCK_REPORT_ID) {
    await page.route('**/api/trpc/reports.create**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse({ id: reportId }) })
    )
}

export async function mockExportReport(page: Page, pdf = MOCK_EXPORT_PDF) {
    await page.route('**/api/trpc/reports.export**', (route) =>
        route.fulfill({
            contentType: 'application/json',
            body: batchResponse({ pdf, stock: 'AAPL' }),
        })
    )
}

export async function mockSendOtp(page: Page) {
    await page.route('**/api/trpc/auth.sendOtp**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse({ status: 200 }) })
    )
}

export async function mockVerifyOtp(page: Page) {
    await page.route('**/api/trpc/auth.verifyOtp**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse({ status: 200 }) })
    )
}

export async function mockGetLatestNews(page: Page, items = MOCK_NEWS_ITEMS) {
    await page.route('**/api/trpc/finnhub.getLatestNews**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(items) })
    )
}

export async function mockCreateCheckoutSession(page: Page, url = MOCK_STRIPE_URL) {
    await page.route('**/api/trpc/credits.createCheckoutSession**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(url) })
    )
}

export async function mockGetInvoices(page: Page, invoices: Invoice[] = MOCK_INVOICES) {
    await page.route('**/api/trpc/credits.getInvoices**', (route) =>
        route.fulfill({ contentType: 'application/json', body: batchResponse(invoices) })
    )
}
