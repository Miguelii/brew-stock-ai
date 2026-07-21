import type { Locator, Page } from '@playwright/test'

export class AnalysisFormPage {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('/analysis')
    }

    get tickerInput(): Locator {
        return this.page.getByTestId('ticker-input')
    }

    get analysisTypeSelect(): Locator {
        return this.page.getByTestId('analysis-type-select')
    }

    get firstAnalysisTypeOption(): Locator {
        return this.page.getByTestId('analysis-type-option').first()
    }

    get generateButton(): Locator {
        return this.page.getByTestId('generate-report-button')
    }

    get createdToast(): Locator {
        return this.page.getByTestId('report-created-toast')
    }

    async fillAndSubmit(ticker: string) {
        await this.tickerInput.fill(ticker)
        await this.analysisTypeSelect.click()
        await this.firstAnalysisTypeOption.click()
        await this.generateButton.click()
    }
}
