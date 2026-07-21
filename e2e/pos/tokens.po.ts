import type { Locator, Page } from '@playwright/test'

type PackageId = 'starter' | 'pro' | 'expert'

export class TokensPage {
    constructor(private readonly page: Page) {}

    async goto(query = '') {
        await this.page.goto(`/tokens${query}`)
    }

    pkg(id: PackageId): Locator {
        return this.page.getByTestId(`token-package-${id}`)
    }

    get buyNowButtons(): Locator {
        return this.page.getByTestId('buy-now-button')
    }

    get balance(): Locator {
        return this.page.getByTestId('token-balance')
    }

    get successBanner(): Locator {
        return this.page.getByTestId('payment-success-banner')
    }

    get canceledBanner(): Locator {
        return this.page.getByTestId('payment-canceled-banner')
    }

    get pendingBanner(): Locator {
        return this.page.getByTestId('pending-payment-banner')
    }

    get pendingAmount(): Locator {
        return this.page.getByTestId('pending-payment-amount')
    }

    get pendingDescription(): Locator {
        return this.page.getByTestId('pending-payment-description')
    }
}
