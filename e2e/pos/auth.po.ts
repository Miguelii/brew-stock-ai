import type { Locator, Page } from '@playwright/test'

export class AuthPage {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('/auth')
    }

    get title(): Locator {
        return this.page.getByTestId('auth-title')
    }

    get emailInput(): Locator {
        return this.page.getByTestId('email-input')
    }

    get signInButton(): Locator {
        return this.page.getByTestId('sign-in-button')
    }

    get otpInput(): Locator {
        return this.page.getByTestId('otp-input')
    }

    get confirmButton(): Locator {
        return this.page.getByTestId('confirm-otp-button')
    }

    get useDifferentEmail(): Locator {
        return this.page.getByTestId('use-different-email-button')
    }
}
