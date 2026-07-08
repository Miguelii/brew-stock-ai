import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient, getIsDev } from '@/lib/utils.server'
import { CreateSbClientError, ExportReportError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { ReportDTO } from '@/types/ReportDTO'
import type { User } from '@supabase/supabase-js'
import { ClientEnv } from '@/env/client'
import { buildPdfHtml } from '@/_bff/modules/reports/helpers/build-pdf-html.helper'
import {
    selectReportForExport,
    selectStockDataByTicker,
} from '@/_bff/modules/reports/repositories/reports.repository'

const CHROMIUM_PACK_PATH = '/chromium-v148.0.0-pack.x64.tar'

const CHROMIUM_PACK_URL = `${ClientEnv.NEXT_PUBLIC_WEBSITE_URL}${CHROMIUM_PACK_PATH}`

let cachedExecutablePath: string | null = null
let downloadPromise: Promise<string> | null = null
let browserInstance: any = null

const getChromiumPath = Effect.fn('getChromiumPath')(function* () {
    if (cachedExecutablePath) return cachedExecutablePath

    downloadPromise ??= import('@sparticuz/chromium-min')
        .then((m) => m.default.executablePath(CHROMIUM_PACK_URL))
        .then((path) => {
            cachedExecutablePath = path
            return path
        })
        .catch((err) => {
            downloadPromise = null // reset to allow retry
            throw err
        })

    return yield* Effect.tryPromise({
        try: () => downloadPromise!,
        catch: (cause) =>
            new ExportReportError({ cause, error_hash: ErrorCode.EXPORT_REPORT_CHROMIUM }),
    })
})

async function getOrLaunchBrowser(puppeteer: any, launchOptions: any): Promise<any> {
    if (browserInstance?.isConnected()) return browserInstance
    browserInstance = await puppeteer.launch(launchOptions)
    browserInstance.once('disconnected', () => {
        browserInstance = null
    })
    return browserInstance
}

export const exportReport = Effect.fn('exportReport')(function* (user: User, id: ReportDTO['id']) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.EXPORT_REPORT_SB_CLIENT }),
    })

    const report = yield* selectReportForExport(supabase, id, user.id)

    const isDev = getIsDev()

    // Fetch stock_data and resolve the Chromium path in parallel — neither depends on the other
    const [stockData, chromiumPath] = yield* Effect.all(
        [
            report.ticker ? selectStockDataByTicker(supabase, report.ticker) : Effect.succeed(null),
            isDev ? Effect.succeed(null) : getChromiumPath(),
        ],
        { concurrency: 'unbounded' }
    )

    const html = buildPdfHtml({ ...report, stockData })

    const pdf = yield* Effect.tryPromise({
        try: async () => {
            let puppeteer: any
            let launchOptions: any = { headless: true }

            if (isDev) {
                puppeteer = await import('puppeteer')
            } else {
                const chromium = (await import('@sparticuz/chromium-min')).default
                puppeteer = await import('puppeteer-core')
                launchOptions = {
                    ...launchOptions,
                    args: chromium.args,
                    executablePath: chromiumPath!,
                }
            }

            const browser = await getOrLaunchBrowser(puppeteer, launchOptions)

            const page = await browser.newPage()

            try {
                // Block all network requests — HTML is fully self-contained
                await page.setRequestInterception(true)
                page.on('request', (req: any) => {
                    if (req.resourceType() === 'document') req.continue()
                    else req.abort()
                })

                page.setDefaultNavigationTimeout(15000)

                await page.setContent(html, { waitUntil: 'domcontentloaded' })

                return await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '32px', right: '0', bottom: '36px', left: '0' },
                })
            } finally {
                //await browser.close()
                await page.close()
            }
        },
        catch: (cause) => new ExportReportError({ cause, error_hash: ErrorCode.EXPORT_REPORT_PDF }),
    })

    return {
        pdf: Buffer.from(pdf).toString('base64'),
        stock: report.stock,
    }
})
