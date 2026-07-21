import { test, expect } from '@playwright/test'
import { mockGetCredits, mockCreateCheckoutSession, mockGetInvoices } from '../support/mock-trpc'
import { MOCK_CREDITS, MOCK_PENDING_INVOICE } from '../fixtures/mock-data'
import { TokensPage } from '../pos/tokens.po'

test.describe('Tokens page', () => {
    test.beforeEach(async ({ page }) => {
        await mockGetCredits(page)
        await mockGetInvoices(page)
        await mockCreateCheckoutSession(page)
    })

    test('renders Starter, Pro and Expert packages with Buy Now buttons', async ({ page }) => {
        const tokens = new TokensPage(page)
        await tokens.goto()

        await expect(tokens.pkg('starter')).toContainText('Starter')
        await expect(tokens.pkg('pro')).toContainText('Pro')
        await expect(tokens.pkg('expert')).toContainText('Expert')

        await expect(tokens.buyNowButtons).toHaveCount(3)

        await expect(tokens.pkg('starter')).toContainText('5 analysis credits')
        await expect(tokens.pkg('pro')).toContainText('15 analysis credits')
        await expect(tokens.pkg('expert')).toContainText('50 analysis credits')
    })

    test('shows current credit balance', async ({ page }) => {
        const tokens = new TokensPage(page)
        await tokens.goto()

        await expect(tokens.balance).toContainText(`${MOCK_CREDITS} Credits`, { timeout: 8000 })
    })

    test('shows success banner on ?success=true', async ({ page }) => {
        const tokens = new TokensPage(page)
        await tokens.goto('?success=true')

        await expect(tokens.successBanner).toContainText(/Payment successful/iu)
    })

    test('shows cancel banner on ?canceled=true', async ({ page }) => {
        const tokens = new TokensPage(page)
        await tokens.goto('?canceled=true')

        await expect(tokens.canceledBanner).toContainText(/Checkout was canceled/iu)
    })

    test('clicking Buy Now initiates checkout and redirects', async ({ page }) => {
        const tokens = new TokensPage(page)
        await tokens.goto()

        // Click the Starter "Buy Now" button (first in DOM)
        await tokens.buyNowButtons.first().click()

        // Mock returns http://localhost:3001/tokens?success=true so navigation is local
        await page.waitForURL('**/tokens**success**', { timeout: 8000 })

        await expect(tokens.successBanner).toContainText(/Payment successful/iu)
    })

    test('shows pending payment banner when an invoice is pending', async ({ page }) => {
        await mockGetInvoices(page, [MOCK_PENDING_INVOICE])

        const tokens = new TokensPage(page)
        await tokens.goto()

        await expect(tokens.pendingBanner).toContainText(/pending payment/iu, { timeout: 8000 })
        // Amount and description live in their own testids, disambiguated from the package card price
        await expect(tokens.pendingAmount).toContainText('€2.49')
        await expect(tokens.pendingDescription).toContainText('15 Analysis Tokens')
    })
})
