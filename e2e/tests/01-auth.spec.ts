import { test, expect } from '@playwright/test'
import { mockSendOtp, mockVerifyOtp } from '../support/mock-trpc'

// This test runs without auth cookies — override the global storageState
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Auth flow', () => {
    test('shows email step on /auth', async ({ page }) => {
        await page.goto('/auth')

        await expect(page.getByText('Welcome back')).toBeVisible()
        await expect(page.getByTestId('email-input')).toBeVisible()
        await expect(page.getByTestId('sign-in-button')).toBeVisible()
    })

    test('transitions to OTP step after submitting email', async ({ page }) => {
        await mockSendOtp(page)

        await page.goto('/auth')

        await page.getByTestId('email-input').fill('test@example.com')
        await page.getByTestId('sign-in-button').click()

        // OTP confirmation view
        await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible({ timeout: 5000 })
        await expect(page.getByText('Use a different email')).toBeVisible()
    })

    test('navigates away from /auth after OTP confirmation', async ({ page }) => {
        await mockSendOtp(page)
        await mockVerifyOtp(page)

        await page.goto('/auth')

        // Step 1 — email
        await page.getByTestId('email-input').fill('test@example.com')
        await page.getByTestId('sign-in-button').click()

        // Step 2 — OTP (6-digit input via InputOTP slots)
        await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible({ timeout: 5000 })

        // input-otp renders one hidden <input> that captures all keystrokes. The slot
        // divs are visual-only and intercept pointer events. Click the real input and
        // type all digits at once.
        const otpInput = page.getByTestId('otp-input')
        await otpInput.click()
        await page.keyboard.type('123456')

        await page.getByRole('button', { name: 'Confirm' }).click()

        // After mocked verifyOtp succeeds, the component calls window.location.href = returnTo ?? '/analysis'
        await page.waitForURL((url) => !url.pathname.includes('/auth'), { timeout: 10_000 })
        expect(page.url()).not.toContain('/auth')
    })
})
