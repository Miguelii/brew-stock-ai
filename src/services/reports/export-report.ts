import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CHROMIUM_PACK_PATH } from '@/lib/constants'
import { CreateSbClientError, ExportReportError, UnauthenticatedError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import type { ReportDTO, StockData } from '@/types/ReportDTO'
import { getSession } from '@/services/auth/get-session'
import { ClientEnv } from '@/env/client'
import { buildPdfHtml } from '@/services/reports/helpers/build-pdf-html'

const CHROMIUM_PACK_URL = `${ClientEnv.NEXT_PUBLIC_WEBSITE_URL}${CHROMIUM_PACK_PATH}`

let cachedExecutablePath: string | null = null
let downloadPromise: Promise<string> | null = null

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

export const exportReport = Effect.fn('exportReport')(function* (id: ReportDTO['id']) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.EXPORT_REPORT_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.EXPORT_REPORT_UNAUTH })
    }

    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('stock, type, ai_response, sentiment, created_at, ticker')
                .eq('id', id)
                .eq('user_id', user.id)
                .single(),
        catch: (cause) =>
            new ExportReportError({ cause, error_hash: ErrorCode.EXPORT_REPORT_FETCH }),
    })

    if (error) {
        return yield* new ExportReportError({
            cause: error,
            error_hash: ErrorCode.EXPORT_REPORT_FETCH_ERR,
        })
    }

    const stockData = report.ticker
        ? yield* Effect.tryPromise({
              try: () =>
                  supabase.from('stock_data').select('*').eq('id', report.ticker).maybeSingle(),
              catch: (cause) => cause,
          }).pipe(
              Effect.map((res) => (res.data as StockData) ?? null),
              Effect.orElse(() => Effect.succeed(null))
          )
        : null

    const html = buildPdfHtml({ ...report, stockData })

    const isDev = process.env.NODE_ENV === 'development'

    // Resolve the Chromium path before entering the tryPromise async context
    // so we can use yield* (Effect.gen) instead of await (async/Promise)
    const chromiumPath = isDev ? null : yield* getChromiumPath()

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

            const browser = await puppeteer.launch(launchOptions)

            const page = await browser.newPage()

            // Block all network requests — HTML is fully self-contained
            await page.setRequestInterception(true)
            page.on('request', (req: any) => {
                if (req.resourceType() === 'document') req.continue()
                else req.abort()
            })

            page.setDefaultNavigationTimeout(15000)

            await page.setContent(html, { waitUntil: 'domcontentloaded' })

            const buffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0', right: '0', bottom: '0', left: '0' },
            })

            await browser.close()

            return buffer
        },
        catch: (cause) => new ExportReportError({ cause, error_hash: ErrorCode.EXPORT_REPORT_PDF }),
    })

    return {
        pdf: Buffer.from(pdf).toString('base64'),
        stock: report.stock,
    }
})
