import type { Page } from '@playwright/test'

const PIXEL_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
)

/**
 * Remote photos (the report news card) go through the app's /_next/image optimizer,
 * which would download the real image from the Next.js process. Serving a local pixel
 * keeps the suite offline. Local assets (/assets/...) still load normally.
 */
export async function mockRemoteImages(page: Page) {
    await page.route(
        (url) =>
            url.pathname === '/_next/image' &&
            (url.searchParams.get('url') ?? '').startsWith('https://'),
        (route) => route.fulfill({ contentType: 'image/png', body: PIXEL_PNG })
    )
}
