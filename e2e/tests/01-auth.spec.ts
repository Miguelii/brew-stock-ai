import { test, expect } from '@playwright/test'
import { mockSendOtp, mockVerifyOtp } from '../support/mock-trpc'
import { AuthPage } from '../pos/auth.po'

// This test runs without auth cookies — override the global storageState
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Auth flow', () => {
    test('shows email step on /auth', async ({ page }) => {
        const auth = new AuthPage(page)
        await auth.goto()

        await expect(auth.title).toHaveText('Welcome back')
        await expect(auth.emailInput).toBeVisible()
        await expect(auth.signInButton).toBeVisible()
    })

    test('transitions to OTP step after submitting email', async ({ page }) => {
        await mockSendOtp(page)

        const auth = new AuthPage(page)
        await auth.goto()

        await auth.emailInput.fill('test@example.com')
        await auth.signInButton.click()

        // OTP confirmation view
        await expect(auth.confirmButton).toBeVisible({ timeout: 5000 })
        await expect(auth.useDifferentEmail).toBeVisible()
    })

    test('navigates away from /auth after OTP confirmation', async ({ page }) => {
        await mockSendOtp(page)
        await mockVerifyOtp(page)

        const auth = new AuthPage(page)
        await auth.goto()

        // Step 1 — email
        await auth.emailInput.fill('test@example.com')
        await auth.signInButton.click()

        // Step 2 — OTP (6-digit input via InputOTP slots)
        await expect(auth.confirmButton).toBeVisible({ timeout: 5000 })

        // input-otp renders one hidden <input> that captures all keystrokes. The slot
        // divs are visual-only and intercept pointer events. Click the real input and
        // type all digits at once.
        await auth.otpInput.click()
        await page.keyboard.type('123456')

        await auth.confirmButton.click()

        // After mocked verifyOtp succeeds, the component calls window.location.href = returnTo ?? '/analysis'
        await page.waitForURL((url) => !url.pathname.includes('/auth'), { timeout: 10_000 })
        expect(page.url()).not.toContain('/auth')
    })
})
