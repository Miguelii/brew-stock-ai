import { test, expect } from '@playwright/test'
import { mockGetCredits, mockCreateCheckoutSession, mockGetInvoices } from '../support/mock-trpc'
import { MOCK_CREDITS, MOCK_PENDING_INVOICE } from '../fixtures/mock-data'

test.describe('Tokens page', () => {
    test.beforeEach(async ({ page }) => {
        await mockGetCredits(page)
        await mockGetInvoices(page)
        await mockCreateCheckoutSession(page)
    })

    test('renders Starter, Pro and Expert packages with Buy Now buttons', async ({ page }) => {
        await page.goto('/tokens')

        await expect(page.getByText('Starter', { exact: true })).toBeVisible()
        await expect(page.getByText('Pro', { exact: true })).toBeVisible()
        await expect(page.getByText('Expert', { exact: true })).toBeVisible()

        const buyButtons = page.getByRole('button', { name: 'Buy Now' })
        await expect(buyButtons).toHaveCount(3)

        await expect(page.getByText('5 analysis credits', { exact: true })).toBeVisible()
        await expect(page.getByText('15 analysis credits', { exact: true })).toBeVisible()
        await expect(page.getByText('50 analysis credits', { exact: true })).toBeVisible()
    })

    test('shows current credit balance', async ({ page }) => {
        await page.goto('/tokens')

        await expect(page.getByText(new RegExp(`${MOCK_CREDITS}\\s*Credits`, 'u'))).toBeVisible({
            timeout: 8000,
        })
    })

    test('shows success banner on ?success=true', async ({ page }) => {
        await page.goto('/tokens?success=true')

        await expect(page.getByText(/Payment successful/iu)).toBeVisible()
    })

    test('shows cancel banner on ?canceled=true', async ({ page }) => {
        await page.goto('/tokens?canceled=true')

        await expect(page.getByText(/Checkout was canceled/iu)).toBeVisible()
    })

    test('clicking Buy Now initiates checkout and redirects', async ({ page }) => {
        await page.goto('/tokens')

        // Click the Starter "Buy Now" button (first in DOM)
        await page.getByRole('button', { name: 'Buy Now' }).first().click()

        // Mock returns http://localhost:3001/tokens?success=true so navigation is local
        await page.waitForURL('**/tokens**success**', { timeout: 8000 })

        await expect(page.getByText(/Payment successful/iu)).toBeVisible()
    })

    test('shows pending payment banner when an invoice is pending', async ({ page }) => {
        await mockGetInvoices(page, [MOCK_PENDING_INVOICE])

        await page.goto('/tokens')

        await expect(page.getByText(/pending payment/iu)).toBeVisible({ timeout: 8000 })
        // Use locator('strong') to disambiguate from the same amount shown in the package card price
        await expect(page.locator('strong').filter({ hasText: '€2.49' })).toBeVisible()
        await expect(page.locator('strong').filter({ hasText: '15 Analysis Tokens' })).toBeVisible()
    })
})
