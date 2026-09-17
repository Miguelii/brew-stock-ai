import type { Locator, Page } from '@playwright/test'

type SectionId =
    | 'overview'
    | 'market-outlook'
    | 'key-metrics'
    | 'analysis'
    | 'sig-dev'
    | 'latest-news'
    | 'media-mentions'
    | 'sector-scores'

export class ReportPage {
    constructor(private readonly page: Page) {}

    async goto(reportId: string) {
        await this.page.goto(`/reports/${reportId}`)
    }

    get tickerHeading(): Locator {
        return this.page.getByTestId('report-ticker-heading')
    }

    get typeBadge(): Locator {
        return this.page.getByTestId('report-type-badge')
    }

    get sentimentScore(): Locator {
        return this.page.getByTestId('sentiment-score')
    }

    get exportButton(): Locator {
        return this.page.getByTestId('export-pdf-button')
    }

    get latestNewsLeadHeadline(): Locator {
        return this.page.getByTestId('latest-news-lead-headline')
    }

    get latestNewsLeadImage(): Locator {
        return this.page.getByTestId('latest-news-lead-image')
    }

    get latestNewsLeadCover(): Locator {
        return this.page.getByTestId('latest-news-lead-cover')
    }

    get latestNewsItems(): Locator {
        return this.page.getByTestId('latest-news-item')
    }

    get latestNewsItemHeadlines(): Locator {
        return this.page.getByTestId('latest-news-item-headline')
    }

    get sigDevCalendar(): Locator {
        return this.page.getByTestId('sig-dev-calendar')
    }

    get expertReportItems(): Locator {
        return this.page.getByTestId('expert-report-item')
    }

    nav(id: SectionId): Locator {
        return this.page.getByTestId(`nav-${id}`)
    }

    section(id: SectionId): Locator {
        return this.page.getByTestId(`report-section-${id}`)
    }
}
